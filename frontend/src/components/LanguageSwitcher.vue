<template>
  <select
    v-if="availableLanguages.length > 1"
    :value="locale"
    :style="style"
    :aria-label="$t('nav.language')"
    @change="onChange"
  >
    <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code" :style="optionStyle">
      {{ lang.label }}
    </option>
  </select>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { availableLanguages, setLanguage } from '../i18n'

const props = defineProps({
  variant: { type: String, default: 'dark' },
})

const { locale } = useI18n()

const onDark = props.variant === 'dark'

// A bare <select> falls back to the browser's own light chrome, which breaks
// the dark stage - so appearance is reset and the arrow drawn as a background.
const style = {
  appearance: 'none',
  WebkitAppearance: 'none',
  fontFamily: 'var(--mono)',
  fontSize: 'var(--fs-xs)',
  fontWeight: '500',
  letterSpacing: '0.05em',
  background: onDark ? 'var(--bg-3)' : 'var(--bg-2)',
  backgroundImage:
    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='%23C4D600' d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '10px',
  color: 'var(--text-200)',
  border: '1px solid var(--border-soft)',
  borderRadius: 'var(--r-xs)',
  padding: '6px 30px 6px 10px',
  marginLeft: 'var(--space-lg)',
  cursor: 'pointer',
  outline: 'none',
}

const optionStyle = { background: 'var(--bg-3)', color: 'var(--text-200)' }

const onChange = (event) => setLanguage(event.target.value)
</script>
