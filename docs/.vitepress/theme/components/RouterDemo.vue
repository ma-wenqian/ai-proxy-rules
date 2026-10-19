<script setup lang="ts">
// 旧单页的「规则匹配」动画:逐行点亮,命中规则的打 PROXY,其余 DIRECT。
// 规则清单加载前用写死的结果,加载后按真实 DOMAIN / DOMAIN-SUFFIX 规则判断。
import { onMounted, onUnmounted, ref } from 'vue'
import { loadRules, useI18n, type Rule } from './shared'

const { t } = useI18n()

const HOSTS = ['api.anthropic.com', 'github.com', 'claude.ai', 'registry.npmjs.org', 'chatgpt.com', 'guzzoni.apple.com', 'www.bilibili.com']
const FALLBACK: Record<string, boolean> = { 'api.anthropic.com': true, 'claude.ai': true, 'chatgpt.com': true, 'guzzoni.apple.com': true }

const domainRules = ref<Rule[] | null>(null)
const step = ref(-1) // -1 = 还没开始动(SSR / 减少动态时全部显示)
const reduced = ref(false)

function proxied(host: string) {
  if (!domainRules.value) return !!FALLBACK[host]
  return domainRules.value.some(
    ({ kind, value }) =>
      (kind === 'DOMAIN' && host === value) ||
      (kind === 'DOMAIN-SUFFIX' && (host === value || host.endsWith('.' + value))),
  )
}

const cycle = HOSTS.length + 2 // 全部亮起后停两拍再重来
const pos = () => step.value % cycle
const isOn = (j: number) => !reduced.value && step.value >= 0 && j === pos()
const isSeen = (j: number) => reduced.value || step.value < 0 || j < pos() || pos() >= HOSTS.length

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced.value) {
    step.value = 0
    timer = setInterval(() => step.value++, 900)
  }
  loadRules()
    .then((d) => (domainRules.value = [...d.claude, ...d.openai, ...d.apple].flatMap((g) => g.rules)))
    .catch(() => {})
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="router" aria-hidden="true">
    <div class="router-head">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      <span class="router-title">rule match</span>
    </div>
    <ol class="router-rows">
      <li v-for="(host, j) in HOSTS" :key="host" :class="{ on: isOn(j), seen: isSeen(j) }">
        <span class="host">{{ host }}</span>
        <i class="tag" :class="proxied(host) ? 'proxy' : 'direct'">{{ proxied(host) ? 'PROXY' : 'DIRECT' }}</i>
      </li>
    </ol>
    <div class="router-foot">
      <span><i class="tag proxy">PROXY</i> {{ t('legendProxy') }}</span>
      <span><i class="tag direct">DIRECT</i> {{ t('legendDirect') }}</span>
    </div>
  </div>
</template>

<style scoped>
.router {
  width: 100%;
  max-width: 420px;
  background: var(--apr-surface);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  text-align: left;
}
.router-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}
.router-title {
  margin-left: 8px;
  font: 12px var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}
.router-rows {
  list-style: none;
  margin: 0;
  padding: 8px 0;
  font: 13px/1 var(--vp-font-family-mono);
}
.router-rows li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 16px;
  transition: background 0.3s, opacity 0.3s;
  opacity: 0.55;
}
.host {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.router-rows li.on {
  background: var(--vp-c-bg-soft);
  opacity: 1;
}
.router-rows li.seen {
  opacity: 1;
}
.router-rows li .tag {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.25s, transform 0.25s;
}
.router-rows li.on .tag,
.router-rows li.seen .tag {
  opacity: 1;
  transform: none;
}
.tag {
  font: 600 10.5px/1 var(--vp-font-family-mono);
  font-style: normal;
  letter-spacing: 0.04em;
  padding: 4px 7px;
  border-radius: 5px;
  flex: none;
}
.tag.proxy {
  color: var(--apr-accent-ink);
  background: var(--vp-c-brand-1);
}
.tag.direct {
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.router-foot {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 10px 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-2);
}
@media (max-width: 520px) {
  .router-rows {
    font-size: 12.5px;
  }
  .router-rows li {
    padding: 9px 14px;
  }
}
</style>
