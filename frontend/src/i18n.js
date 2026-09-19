import { createI18n } from 'vue-i18n'
import languageRegistry from '../../locales/languages.json'

const STORAGE_KEY = 'mirofish-language'
const FALLBACK = 'en'

// Every locale file next to languages.json becomes an available UI language.
const localeModules = import.meta.glob('../../locales/*.json', { eager: true })

const messages = {}
for (const [path, module] of Object.entries(localeModules)) {
  const code = path.split('/').pop().replace('.json', '')
  if (code === 'languages') continue
  messages[code] = module.default || module
}

export const availableLanguages = Object.keys(messages)
  .filter((code) => code in languageRegistry)
  .map((code) => ({ code, label: languageRegistry[code].label }))

const detectLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored in messages) return stored
  } catch {
    // private mode or blocked storage - fall through to browser preference
  }

  const browser = (navigator.language || '').split('-')[0]
  return browser in messages ? browser : FALLBACK
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLanguage(),
  fallbackLocale: FALLBACK,
  messages,
})

export const setLanguage = (code) => {
  if (!(code in messages)) return

  i18n.global.locale.value = code
  document.documentElement.lang = code
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // storage unavailable - language still applies for this session
  }
}

/** LLM instruction for the active language, sent with report requests. */
export const currentLanguage = () => i18n.global.locale.value

document.documentElement.lang = i18n.global.locale.value

export default i18n
