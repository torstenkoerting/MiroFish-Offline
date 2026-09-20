# MiroFish-Offline — Dev-Handbuch (Mac + simulation.koerting.ai)

Kurzhandbuch fuer die Weiterentwicklung dieses Repos auf deinem MacBook Pro und das Ausrollen auf **simulation.koerting.ai** (Coolify auf koerting.ai-Server).

## Wo lebt was

| Ort | Zweck |
|---|---|
| Dieses Repo (`~/MiroFish-Offline`) | Quellcode. Wird von Coolify aus deployt. |
| `github.com/nikmcfly/MiroFish-Offline` | Remote. `main` = das, was live geht. |
| `simulation.koerting.ai` | Live-App. Container laeuft auf dem koerting.ai-Server. |
| `coolify.koerting.ai` | Deploy-Panel. Startet Builds, verwaltet Env-Vars. |
| `~/Desktop/KI Shortcuts/Simulation MiroFish/` | Alte `.command`-Skripte fuer schnellen Lokalstart. Nicht mehr die primaere Loop — ersetzt durch die Setups unten. |

## Repo-Layout (Kurz)

```
backend/     Flask-API + Simulation-Engine (Python 3.11+)
frontend/    Vue/Vite-Frontend (Node 18+)
static/      Assets, Bilder
docker-compose.yml         Referenz-Setup (nvidia-GPU, Linux-Server)
docker-compose.mac.yml     Angepasst fuer Apple Silicon (Ollama vom Host)
Dockerfile   Fuer Coolify + fuer Mac-Compose
.env         Deine lokalen Secrets (nicht im Git)
```

## Setup A: Voller Docker-Stack auf dem Mac (produktionsnah)

Neo4j + MiroFish-App im Container, Ollama nutzt deine native Installation.

```bash
cd ~/MiroFish-Offline

# Ollama muss laufen (macht es schon):
ollama serve &  # falls nicht bereits als Dienst aktiv
ollama pull qwen2.5:14b        # oder :32b wenn genug RAM
ollama pull nomic-embed-text

# Stack hoch
docker compose -f docker-compose.mac.yml up -d --build

# Logs
docker compose -f docker-compose.mac.yml logs -f mirofish

# Stack runter
docker compose -f docker-compose.mac.yml down
```

App: <http://localhost:3000> · Neo4j-Browser: <http://localhost:7474> (neo4j / siehe `.env`)

Wichtig: In `docker-compose.mac.yml` wird die App per `host.docker.internal:11434` an das Host-Ollama gebunden — der Ollama-Container aus dem Original-Compose wird nicht gestartet (nvidia-Config funktioniert auf Apple Silicon nicht).

## Setup B: Native Dev-Loop mit Hot-Reload (schneller iterieren)

Fuer Code-Aenderungen am Backend/Frontend. Neo4j im Container, Rest nativ.

```bash
# 1. Nur Neo4j im Container
docker compose -f docker-compose.mac.yml up -d neo4j

# 2. Ollama (nativ, laeuft schon)
ollama serve &

# 3. Backend (neues Terminal-Tab)
cd ~/MiroFish-Offline/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py                    # laeuft auf :5001

# 4. Frontend (neues Terminal-Tab)
cd ~/MiroFish-Offline/frontend
npm install
npm run dev                      # laeuft auf :3000, hot reload
```

Der `.env` mit `LLM_BASE_URL=http://localhost:11434/v1` und `NEO4J_URI=bolt://localhost:7687` passt genau fuer diesen Modus (ist schon so gesetzt).

## Weiterentwicklung ueber diese Claude-Session

Die Session ist jetzt im Repo (`~/MiroFish-Offline`, Branch `dev/tj-session`). Damit kann Claude direkt:

- Files lesen/editieren (Read/Edit/Write)
- Commits erstellen und Branches verwalten
- Docker-/Node-/Python-Kommandos ausfuehren
- Tests starten
- Live-App im Browser oeffnen und Screenshots ziehen

Typischer Workflow im Chat:
1. Du sagst was geaendert werden soll ("Report-Agent soll auch Deutsch koennen")
2. Claude sucht die relevante Datei, editiert, testet lokal
3. Wenn ok: Commit auf `dev/tj-session`
4. Du pruefst — dann Merge nach `main` (per PR auf GitHub oder direkt)
5. Coolify holt sich `main` und deployt neu

Alles was du NICHT willst: Direkt in `main` pushen, weil `main` = live. Immer ueber Feature-Branch.

## Deploy nach simulation.koerting.ai

Sobald etwas auf `main` gepusht wird, macht Coolify (vermutlich) einen automatischen Rebuild.

Zu pruefen im Coolify-Panel (<https://coolify.koerting.ai>):
- **Projekt/App:** MiroFish (Name kann abweichen)
- **Source:** GitHub-Repo `nikmcfly/MiroFish-Offline`, Branch `main`
- **Auto-Deploy:** Aktiviert? Wenn ja: Push nach `main` reicht.
- **Env-Vars:** Muessen die relevanten Keys aus `.env` gesetzt sein (LLM_*, NEO4J_*, EMBEDDING_*). `.env` selbst wird NICHT ausgerollt (steht in `.dockerignore`).
- **Domain:** `simulation.koerting.ai` mit TLS-Cert.

Manueller Deploy: Im Coolify-Panel auf die App -> "Deploy" oder "Redeploy".

## Handliche Kommandos

```bash
# Repo-Status
git status && git log --oneline -5

# Was ist auf origin/main aber noch nicht lokal?
git fetch && git log HEAD..origin/main --oneline

# Frisch von main einen Feature-Branch
git checkout main && git pull && git checkout -b feature/xxx

# Docker aufraeumen (nach vielen Rebuilds)
docker compose -f docker-compose.mac.yml down -v   # Volumes weg — Neo4j-Daten futsch!
docker system prune -f                              # nur nicht genutzte Images

# Live-App checken
open https://simulation.koerting.ai
```

## Hardware auf deinem Mac

- Docker 29.4.3 + Compose v5.1.4 ✓
- Node v25.6.1, npm 11.9.0 ✓
- Python 3.13.3 ✓ (Backend erwartet 3.11+, sollte passen — bei Problemen `pyenv install 3.11`)
- Ollama 0.33.3, laeuft auf `localhost:11434` ✓
- Kein nvidia-GPU (deshalb der Mac-Compose)

## Naechste Schritte (Ideen)

Wenn nichts konkretes ansteht — Ideen, was sich lohnt:
- README auf Deutsch spiegeln (User-facing bleibt English)
- Standard-Prompt-Vorlagen fuer typische Koerting-Use-Cases (Team-Reaktion, Programm-Teilnehmer, Marktreaktion)
- Export der Simulation-Reports als PDF/Docx im Koerting-CI
- Login-Schutz vor die Live-App (Basic Auth oder Coolify-eigener Auth-Proxy)
- Backup fuer Neo4j-Volume auf dem Server einrichten

## Betrieb der Live-Instanz

`simulation.koerting.ai` laeuft seit dem 21.09.2026 als **Coolify-Application**
(Projekt "MiroFish", Build-Pack Docker Compose) und folgt `main` dieses Repos.

### Deploy

Ein Push auf `main` loest den Deploy aus — ein GitHub-Webhook meldet ihn an
Coolify. Kein `rsync`, kein SSH mehr noetig. Im Coolify-Panel laesst sich der
Deploy auch von Hand ausloesen.

### Drei Stolpersteine, die beim Aufsetzen aufgefallen sind

**Ollama Cloud kann keine Embeddings.** Der Chat laeuft ueber `ollama.com`, aber
dessen `/v1/embeddings` antwortet mit 404. `nomic-embed-text` muss deshalb in
einem eigenen Ollama-Container laufen — der steckt in der Compose. Nach einem
frischen Volume einmalig nachziehen:

```bash
docker exec <ollama-container> ollama pull nomic-embed-text
```

**Neo4j startet nicht, wenn es die App-Variablen sieht.** Coolify reicht alle
Environment-Variablen an *jeden* Service der Compose weiter. Das Neo4j-Image
liest jede `NEO4J_*`-Variable als Konfigurationseintrag — aus `NEO4J_URI` wird
das unbekannte Setting `URI`, der Container bricht ab und reisst die App als
fehlgeschlagene Abhaengigkeit mit. Die Compose entschaerft das ueber
`NEO4J_server_config_strict__validation_enabled=false`.

**Traefik und zwei Netzwerke.** Haengt ein Container sowohl im `coolify`-Netz als
auch in einem eigenen Compose-Netz, waehlt Traefik ohne Hinweis eine der IPs.
Trifft es die falsche, laeuft jede Anfrage von aussen in einen Timeout, obwohl
der Container lokal mit 200 antwortet — und der TLS-Handshake vorher gelingt,
was den Fehler wie ein Zertifikatsproblem aussehen laesst. Coolify setzt das
noetige `traefik.docker.network`-Label selbst; bei handgebauten Compose-Setups
muss es hinein.

### Vorgaenger

Die frueher von Hand betriebene Instanz liegt archiviert unter
`/opt/mirofish-archiv-<Zeitstempel>`, Datensicherungen unter `/opt/mirofish-backup/`.
Hostnamen und Zugriffswege stehen in `OPERATIONS.local.md` (nicht im Repo).
