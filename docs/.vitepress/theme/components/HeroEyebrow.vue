<script setup lang="ts">
import { useI18n } from './shared'
const { t } = useI18n()
</script>

<template>
  <div class="eyebrow">{{ t('eyebrow') }}</div>
</template>

<style scoped>
.eyebrow {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 16px;
}
</style>
