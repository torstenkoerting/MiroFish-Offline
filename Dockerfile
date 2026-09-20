# ---- Stage 1: build the frontend once ----
FROM node:22-slim AS frontend

WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm ci --prefix frontend

# vite.config.js reads ../locales via import.meta.glob, so it must be present
COPY frontend ./frontend
COPY locales ./locales
RUN npm run build --prefix frontend


# ---- Stage 2: runtime, Python only ----
# Not -slim: some dependencies (psutil, langdetect) compile from source.
FROM python:3.11

COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

WORKDIR /app

COPY backend/pyproject.toml backend/uv.lock ./backend/
RUN cd backend && uv sync

COPY backend ./backend
COPY locales ./locales
COPY static ./static
COPY --from=frontend /build/frontend/dist ./frontend/dist

EXPOSE 3000

# Gunicorn serves both the API and the compiled frontend from one process.
# Long simulations hold a request open, hence the generous timeout.
CMD ["/app/backend/.venv/bin/gunicorn", \
     "--chdir", "/app/backend", \
     "--bind", "0.0.0.0:3000", \
     "--workers", "2", \
     "--threads", "4", \
     "--timeout", "1800", \
     "--access-logfile", "-", \
     "wsgi:app"]
