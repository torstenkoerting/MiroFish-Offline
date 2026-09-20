<template>
  <select
    v-if="availableLanguages.length > 1"
    :value="locale"
    :style="style"
    :aria-label="$t('nav.language')"
    @change="onChange"
  >
    <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
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

const style = {
  fontFamily: 'var(--mono)',
  fontSize: '0.85rem',
  fontWeight: '500',
  background: 'transparent',
  color: props.variant === 'dark' ? 'var(--bg-2)' : 'var(--text-100)',
  border: `1px solid ${props.variant === 'dark' ? 'rgba(255,255,255,0.3)' : 'var(--border-strong)'}`,
  padding: '4px 8px',
  marginLeft: '20px',
  cursor: 'pointer',
  outline: 'none',
}

const onChange = (event) => setLanguage(event.target.value)
</script>
