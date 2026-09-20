<template>
  <div :style="wrap">
    <img :src="logo" alt="Koerting Institute" :style="logoStyle" />
    <span :style="divider"></span>
    <span :style="product">
      <span class="brace">{</span><span class="brand-word">MiroFish</span><span class="brace">}</span>
    </span>
  </div>
</template>

<script setup>
import logo from '../assets/brand/ki-mark-neg.svg'

defineProps({ compact: { type: Boolean, default: false } })

// The KI monogram is used as shipped - never redrawn or recoloured (22 §2.2).
const wrap = { display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }
const logoStyle = { height: '28px', width: 'auto', display: 'block' }
const divider = { width: '1px', height: '20px', background: 'var(--border-soft)' }
const product = {
  fontFamily: 'var(--font)',
  fontSize: 'var(--fs-lg)',
  fontWeight: '700',
  letterSpacing: '-0.01em',
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '6px',
  whiteSpace: 'nowrap',
}
</script>
