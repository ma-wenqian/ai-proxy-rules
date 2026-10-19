<script setup lang="ts">
import { ref } from 'vue'
import { RAW, useI18n } from './shared'

const { t } = useI18n()

const tab = ref<'sr' | 'ruleset' | 'clash'>('sr')
const clashMode = ref<'one' | 'two' | 'apple'>('one')

const rulesetLines = (policy: string) =>
  ['openai', 'claude'].map((n) => `RULE-SET,${RAW}rules/${n}.list,${policy}`).join('\n')
const appleLine = (policy: string) => `RULE-SET,${RAW}rules/apple-intelligence.list,${policy}`

const provider = (name: string) => `  ${name}:
    type: http
    behavior: classical
    format: yaml
    interval: 86400
    url: "${RAW}Clash/${name}.yaml"
    path: ./ruleset/${name}.yaml`

const clashSnippets = {
  one: `rule-providers:
${provider('ai-proxy')}

rules:
  - RULE-SET,ai-proxy,AI      # AI = your own proxy group`,
  two: `rule-providers:
${provider('openai')}
${provider('claude')}

rules:
  - RULE-SET,openai,OpenAI
  - RULE-SET,claude,Claude`,
  apple: `rule-providers:
${provider('apple-intelligence')}

rules:
  - RULE-SET,apple-intelligence,AppleIntelligence   # a US node group; above any apple / icloud rule`,
}

const srButtons = [
  ['ai-proxy', 'srBoth', true],
  ['openai', 'srOpenai', false],
  ['claude', 'srClaude', false],
  ['apple-intelligence', 'srApple', false],
] as const

const copied = ref<string | null>(null)
async function copy(id: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {}
    ta.remove()
  }
  copied.value = id
  setTimeout(() => copied.value === id && (copied.value = null), 1500)
}
</script>

<template>
  <div class="install">
    <div class="tabs" role="tablist">
      <button class="tab" role="tab" :aria-selected="tab === 'sr'" @click="tab = 'sr'">Shadowrocket</button>
      <button class="tab" role="tab" :aria-selected="tab === 'ruleset'" @click="tab = 'ruleset'">Surge / Loon / Stash</button>
      <button class="tab" role="tab" :aria-selected="tab === 'clash'" @click="tab = 'clash'">Clash / mihomo</button>
    </div>

    <div v-show="tab === 'sr'">
      <div class="card">
        <h3>{{ t('srOwnTitle') }}</h3>
        <p v-html="t('srOwnText')"></p>
        <div class="code">
          <button class="copy" :class="{ done: copied === 'sr' }" @click="copy('sr', rulesetLines('PROXY'))">{{ copied === 'sr' ? t('copied') : t('copy') }}</button>
          <pre>{{ rulesetLines('PROXY') }}</pre>
        </div>
        <p class="note" v-html="t('appleText')"></p>
        <div class="code">
          <button class="copy" :class="{ done: copied === 'sr-apple' }" @click="copy('sr-apple', appleLine('US'))">{{ copied === 'sr-apple' ? t('copied') : t('copy') }}</button>
          <pre>{{ appleLine('US') }}</pre>
        </div>
      </div>
      <div class="card">
        <h3>{{ t('srStandTitle') }}</h3>
        <p>{{ t('srStandText') }}</p>
        <div class="row">
          <a v-for="[file, key, primary] in srButtons" :key="file" class="btn" :class="{ ghost: !primary }"
            :href="`shadowrocket://config/add/${RAW}Shadowrocket/${file}.conf`">{{ t(key) }}</a>
        </div>
      </div>
    </div>

    <div v-show="tab === 'ruleset'">
      <div class="card">
        <h3>{{ t('rsTitle') }}</h3>
        <p v-html="t('rsText')"></p>
        <div class="code">
          <button class="copy" :class="{ done: copied === 'rs' }" @click="copy('rs', rulesetLines('PROXY'))">{{ copied === 'rs' ? t('copied') : t('copy') }}</button>
          <pre>{{ rulesetLines('PROXY') }}</pre>
        </div>
        <p class="note" v-html="t('appleText2')"></p>
        <div class="code">
          <button class="copy" :class="{ done: copied === 'rs-apple' }" @click="copy('rs-apple', appleLine('US'))">{{ copied === 'rs-apple' ? t('copied') : t('copy') }}</button>
          <pre>{{ appleLine('US') }}</pre>
        </div>
      </div>
    </div>

    <div v-show="tab === 'clash'">
      <div class="tabs" role="tablist">
        <button class="tab" :aria-selected="clashMode === 'one'" @click="clashMode = 'one'">{{ t('clashOne') }}</button>
        <button class="tab" :aria-selected="clashMode === 'two'" @click="clashMode = 'two'">{{ t('clashTwo') }}</button>
        <button class="tab" :aria-selected="clashMode === 'apple'" @click="clashMode = 'apple'">{{ t('clashApple') }}</button>
      </div>
      <div class="card">
        <p v-html="t('clashText')"></p>
        <div class="code">
          <button class="copy" :class="{ done: copied === 'clash' }" @click="copy('clash', clashSnippets[clashMode])">{{ copied === 'clash' ? t('copied') : t('copy') }}</button>
          <pre>{{ clashSnippets[clashMode] }}</pre>
        </div>
        <p class="note" v-html="t('clashNote')"></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
  max-width: 100%;
}
.tab {
  font-size: 14px;
  color: var(--vp-c-text-2);
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab[aria-selected='true'] {
  background: var(--apr-surface);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.card {
  background: var(--apr-surface);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
}
.card h3 {
  font-size: 15px;
  margin: 0 0 4px;
  padding: 0;
  border: 0;
  line-height: 1.4;
}
.card p {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}
.card p.note {
  font-size: 13px;
  margin: 12px 0 8px;
}
.card p.note:last-child {
  margin-bottom: 0;
}
.code {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.code pre {
  margin: 0;
  padding: 12px 14px;
  padding-right: 72px;
  overflow-x: auto;
  font: 12.5px/1.6 var(--vp-font-family-mono);
  white-space: pre;
  color: var(--vp-c-text-1);
}
.copy {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 12px;
  background: var(--apr-surface);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
}
.copy.done {
  color: var(--apr-ok);
  border-color: var(--apr-ok);
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.vp-doc a.btn,
.btn {
  font-size: 14px;
  font-weight: 550;
  text-decoration: none;
  background: var(--vp-c-brand-1);
  color: var(--apr-accent-ink);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  padding: 7px 14px;
  display: inline-flex;
  align-items: center;
}
.vp-doc a.btn.ghost,
.btn.ghost {
  background: transparent;
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
  font-weight: 500;
}
.btn.ghost:hover {
  border-color: var(--vp-c-text-2);
}
@media (max-width: 520px) {
  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    width: 100%;
  }
  .tab {
    font-size: 13px;
    padding: 6px;
    line-height: 1.3;
    text-align: center;
  }
  .card {
    padding: 14px;
  }
}
</style>
