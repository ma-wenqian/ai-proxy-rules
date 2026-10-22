<script setup lang="ts">
// 生成 Clash Verge Rev 的扩展脚本:把额外的订阅作为 proxy-provider 注入,挂进指定的策略组。
// 组名要和 Clash/template.yaml 里的一致。链接只在浏览器里拼进脚本,不发往任何地方。
import { computed, reactive, ref } from 'vue'
import { useData } from 'vitepress'

const OTHER = '🌍 大陆境外网站（香港选直连，大陆选节点）'
const NODES = '♻️ 节点'

const TEXT = {
  en: {
    name: 'Name', url: 'https://your-subscription-link', group: 'Joins group',
    other: `${OTHER} — sites outside mainland China`, nodes: `${NODES} — Claude / OpenAI`,
    add: '+ Add another subscription', remove: 'Remove',
    copy: 'Copy script', copied: 'Copied', empty: '// fill in a subscription link above',
    privacy: 'The script is built in this page only. Your links are not sent anywhere.',
  },
  zh: {
    name: '名字', url: 'https://你的订阅链接', group: '加入哪个组',
    other: `${OTHER}：大陆境外网站`, nodes: `${NODES}：Claude / OpenAI`,
    add: '+ 再加一个订阅', remove: '删除',
    copy: '复制脚本', copied: '已复制', empty: '// 在上面填上订阅链接',
    privacy: '脚本只在这个页面里生成，你填的链接不会发送到任何地方。',
  },
}

const { lang } = useData()
const t = computed(() => TEXT[lang.value.startsWith('zh') ? 'zh' : 'en'])

type Row = { name: string; url: string; group: string }
const rows = reactive<Row[]>([{ name: '', url: '', group: OTHER }])

const script = computed(() => {
  const seen = new Set<string>()
  const subs = rows
    .map((r, i) => ({ ...r, name: r.name.trim() || `VPN${i + 1}`, url: r.url.trim() }))
    .filter((r) => r.url)
    .map((r) => {
      let n = r.name
      for (let k = 2; seen.has(n); k++) n = `${r.name}-${k}`
      seen.add(n)
      return `  { name: ${JSON.stringify(n)}, url: ${JSON.stringify(r.url)}, group: ${JSON.stringify(r.group)} },`
    })
  return `// Clash Verge Rev 扩展脚本 / extension script
// https://ma-wenqian.github.io/ai-proxy-rules/zh/guide/clash-verge
// 每个订阅作为 proxy-provider 加进指定的组;节点名前面加 [名字],不同订阅的同名节点不会冲突。
const SUBS = [
${subs.length ? subs.join('\n') : '  ' + t.value.empty}
];

function main(config, profileName) {
  const groups = config["proxy-groups"] || [];
  const providers = { ...(config["proxy-providers"] || {}) };
  for (const s of SUBS) {
    if (!s.url.startsWith("https://")) continue;
    const group = groups.find((g) => g.name === s.group);
    if (!group) continue; // 当前订阅里没有这个组:跳过,别让整份配置加载失败
    providers[s.name] = {
      type: "http",
      url: s.url,
      interval: 86400,
      path: \`./proxy_providers/\${encodeURIComponent(s.name)}.yaml\`,
      override: { "additional-prefix": \`[\${s.name}] \` },
      "health-check": { enable: true, url: "https://www.gstatic.com/generate_204", interval: 600 },
    };
    group.use = [...new Set([...(group.use || []), s.name])];
  }
  config["proxy-providers"] = providers;
  return config;
}
`
})

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(script.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = script.value
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {}
    ta.remove()
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="vs">
    <div v-for="(r, i) in rows" :key="i" class="row">
      <input v-model="r.name" class="name" :placeholder="t.name" />
      <input v-model="r.url" class="url" :placeholder="t.url" />
      <select v-model="r.group" :aria-label="t.group">
        <option :value="OTHER">{{ t.other }}</option>
        <option :value="NODES">{{ t.nodes }}</option>
      </select>
      <button v-if="rows.length > 1" class="x" :title="t.remove" @click="rows.splice(i, 1)">×</button>
    </div>
    <button class="add" @click="rows.push({ name: '', url: '', group: OTHER })">{{ t.add }}</button>
    <div class="out">
      <button class="copy" @click="copy">{{ copied ? t.copied : t.copy }}</button>
      <pre><code>{{ script }}</code></pre>
    </div>
    <p class="hint">{{ t.privacy }}</p>
  </div>
</template>

<style scoped>
.vs {
  background: var(--apr-surface);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px 18px;
  margin: 16px 0;
}
.row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.row input,
.row select {
  min-width: 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 6px 10px;
}
.row .name {
  flex: 0 0 96px;
}
.row .url {
  flex: 1 1 220px;
}
.row select {
  flex: 1 1 200px;
}
.row .x {
  flex: none;
  width: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
}
.add {
  font-size: 13.5px;
  color: var(--vp-c-brand-1);
  padding: 4px 0;
}
.out {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-top: 10px;
}
.copy {
  font-size: 13.5px;
  color: #fff;
  background: var(--vp-c-brand-1);
  border-radius: 8px;
  padding: 6px 14px;
}
.out pre {
  align-self: stretch;
  margin: 0;
  max-height: 300px;
  overflow: auto;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 12px;
  line-height: 1.55;
}
.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .row .name {
    flex: 1 1 100%;
  }
}
</style>
