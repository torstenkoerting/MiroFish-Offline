"""
Language registry

Reads locales/languages.json, the single source of truth shared with the
frontend, and exposes the LLM instruction used to steer report language.
"""

import json
import os
from typing import Dict, Optional

from ..utils.logger import get_logger

logger = get_logger('mirofish.language_registry')

LANGUAGES_FILE = os.path.join(
    os.path.dirname(__file__),
    '../../../locales/languages.json'
)

DEFAULT_LANGUAGE = 'en'
FALLBACK_INSTRUCTION = 'Please respond in English.'

_registry: Optional[Dict[str, Dict[str, str]]] = None


def _load() -> Dict[str, Dict[str, str]]:
    global _registry
    if _registry is not None:
        return _registry

    try:
        with open(LANGUAGES_FILE, 'r', encoding='utf-8') as f:
            _registry = json.load(f)
    except Exception as e:
        logger.error(f"Failed to load language registry, falling back to English only: {e}")
        _registry = {DEFAULT_LANGUAGE: {'label': 'English', 'llmInstruction': FALLBACK_INSTRUCTION}}

    return _registry


def is_supported(code: str) -> bool:
    return bool(code) and code in _load()


def get_instruction(code: Optional[str]) -> str:
    """LLM instruction for a language code, falling back to English."""
    registry = _load()
    entry = registry.get(code) or registry.get(DEFAULT_LANGUAGE) or {}
    return entry.get('llmInstruction', FALLBACK_INSTRUCTION)


def get_label(code: Optional[str]) -> str:
    registry = _load()
    entry = registry.get(code) or registry.get(DEFAULT_LANGUAGE) or {}
    return entry.get('label', 'English')


def list_languages() -> Dict[str, Dict[str, str]]:
    return dict(_load())
