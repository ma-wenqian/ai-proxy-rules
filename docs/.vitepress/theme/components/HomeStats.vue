<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { countRules, loadRules, useI18n } from './shared'

const { t } = useI18n()
const n = ref<{ claude: number; openai: number; apple: number } | null>(null)

onMounted(() => {
  loadRules()
    .then((d) => (n.value = { claude: countRules(d.claude), openai: countRules(d.openai), apple: countRules(d.apple) }))
    .catch(() => {})
})
</script>

<template>
  <div class="features">
    <div class="feature">
      <div class="num">
        <b>{{ n?.claude ?? '–' }}</b> + <b>{{ n?.openai ?? '–' }}</b> + <b>{{ n?.apple ?? '–' }}</b>
      </div>
      <h3>{{ t('f1Title') }}</h3>
      <p>{{ t('f1Text') }}</p>
    </div>
    <div class="feature">
      <div class="num"><b>1</b></div>
      <h3>{{ t('f2Title') }}</h3>
      <p>{{ t('f2Text') }}</p>
    </div>
    <div class="feature">
      <div class="num"><b>0</b></div>
      <h3>{{ t('f3Title') }}</h3>
      <p>{{ t('f3Text') }}</p>
    </div>
  </div>
</template>

<style scoped>
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 8px 0 8px;
}
.feature {
  background: var(--apr-surface);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 18px 20px;
}
.num {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  line-height: 1.3;
}
.num b {
  color: var(--vp-c-text-1);
}
.feature h3 {
  font-size: 15px;
  margin: 6px 0 4px;
  border: 0;
  padding: 0;
  line-height: 1.4;
}
.feature p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
@media (max-width: 760px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
