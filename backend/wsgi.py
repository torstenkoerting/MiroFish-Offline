"""
WSGI entry point for production.

run.py stays the development entry point: it validates the configuration and
starts Flask's own server. Gunicorn needs a module-level application object
instead, which is what this module provides.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.config import Config
from app.utils.logger import get_logger

logger = get_logger('mirofish.wsgi')

for error in Config.validate():
    logger.error("Configuration problem: %s", error)

app = create_app()
