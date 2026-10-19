<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadRules, notesFor, useI18n, type Group } from './shared'

const { t, isZh } = useI18n()
const data = ref<[string, Group[]][] | null>(null)
const failed = ref(false)
const q = ref('')

onMounted(() => {
  loadRules()
    .then((d) => (data.value = [['Anthropic / Claude', d.claude], ['OpenAI', d.openai], ['Apple Intelligence', d.apple]]))
    .catch(() => (failed.value = true))
})

const kindLabel = (k: string) =>
  k.replace('DOMAIN-KEYWORD', 'keyword').replace('DOMAIN-SUFFIX', 'suffix').replace('DOMAIN', 'exact').replace('IP-CIDR6', 'ipv6').replace('IP-CIDR', 'ipv4')

const filtered = computed(() => {
  if (!data.value) return []
  const s = q.value.trim().toLowerCase()
  return data.value
    .map(([svc, groups]) => ({
      svc,
      groups: groups
        .map((g) => ({
          ...g,
          rules: g.rules.filter((r) => !s || r.value.toLowerCase().includes(s) || g.notes.join(' ').toLowerCase().includes(s)),
        }))
        .filter((g) => g.rules.length),
    }))
    .filter((x) => x.groups.length)
})
</script>

<template>
  <div class="rules">
    <input v-model="q" class="search" type="search" :placeholder="t('search')" :aria-label="t('search')" />
    <p v-if="failed" class="empty">{{ t('loadError') }}</p>
    <p v-else-if="!data" class="empty">{{ t('loading') }}</p>
    <p v-else-if="!filtered.length" class="empty">{{ t('noMatch') }}</p>
    <template v-for="s in filtered" :key="s.svc">
      <div class="svc-label">{{ s.svc }}</div>
      <div v-for="(g, i) in s.groups" :key="i" class="group">
        <div class="group-title">
          <span v-for="(n, k) in notesFor(g.notes, isZh)" :key="k">{{ n }}</span>
        </div>
        <div class="chips">
          <span v-for="r in g.rules" :key="r.kind + r.value" class="chip">
            <span class="kind">{{ kindLabel(r.kind) }}</span><span>{{ r.value }}</span>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.search {
  width: 100%;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--apr-surface);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
}
.search:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -1px;
}
.svc-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 20px 0 10px;
}
.group {
  margin-bottom: 14px;
}
.group-title {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 6px;
  line-height: 1.5;
}
.group-title span {
  display: block;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  font: 12.5px/1 var(--vp-font-family-mono);
  background: var(--apr-surface);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 6px 8px;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.kind {
  color: var(--vp-c-text-2);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.empty {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style>
