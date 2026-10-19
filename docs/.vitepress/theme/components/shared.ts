import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

export const RAW = 'https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/'

const I18N = {
  en: {
    eyebrow: 'For Claude Code, ChatGPT and the APIs',
    legendProxy: 'AI node', legendDirect: 'no proxy',
    f1Title: 'Claude + OpenAI + Apple Intelligence rules',
    f1Text: "Web apps, APIs, Claude Code, sandboxes, login and CAPTCHA, Anthropic's own IP blocks, plus Siri / Apple Intelligence and Private Relay.",
    f2Title: 'One source, every client',
    f2Text: 'Rules live in one list; Clash and Shadowrocket files are generated from it and checked in CI.',
    f3Title: 'Servers included',
    f3Text: 'Rules only. Use your own nodes — pick one, and only AI traffic goes through it.',
    srOwnTitle: 'Keep your own config — add a RULE-SET',
    srOwnText: 'Add these lines to your config, above <code>FINAL</code>. Replace <code>PROXY</code> with your own policy group if you want a dedicated node.',
    srStandTitle: 'Or switch to a standalone config',
    srStandText: 'One tap on your iPhone or iPad imports the config. It contains no servers: PROXY is whichever server is selected in the app, and everything else goes direct.',
    rsTitle: 'RULE-SET',
    rsText: 'The same <code>.list</code> files work in Surge, Loon and Stash. Add them above your final rule.',
    clashOne: 'One node for both', clashTwo: 'Separate nodes', clashApple: 'Apple Intelligence',
    clashText: 'Merge into your own config. <code>RULE-SET</code> must come <b>before</b> <code>GEOIP,CN</code> and <code>MATCH</code>, and the policy name must be a group that exists in your <code>proxy-groups</code>.',
    clashNote: 'Full example: <a href="https://github.com/ma-wenqian/ai-proxy-rules/blob/main/Clash/example-config.yaml">Clash/example-config.yaml</a>. On old Clash Premium, drop the <code>format: yaml</code> line.',
    appleText: 'Apple Intelligence is a separate rule set: point it at a node in a supported region (e.g. US) and place it <b>above</b> any rule that sends apple.com / iCloud direct.',
    appleText2: 'Apple Intelligence is separate — use a supported-region (e.g. US) policy and put it above any direct apple.com / iCloud rule.',
    srBoth: 'OpenAI + Claude', srOpenai: 'OpenAI only', srClaude: 'Claude only', srApple: 'Apple Intelligence only',
    loading: 'Loading rules…', noMatch: 'No rules match.', loadError: "Couldn't load the rule lists.",
    search: 'Filter, e.g. claude.ai',
    copy: 'Copy', copied: 'Copied',
  },
  zh: {
    eyebrow: '适用于 Claude Code、ChatGPT 与各家 API',
    legendProxy: '走 AI 节点', legendDirect: '直连',
    f1Title: '条 Claude + OpenAI + Apple Intelligence 规则',
    f1Text: '网页端、API、Claude Code、沙箱、登录与人机验证，外加 Anthropic 自有 IP 段，以及 Siri / Apple Intelligence 与 Private Relay。',
    f2Title: '份规则源，所有客户端通用',
    f2Text: '规则只维护一份清单，Clash 和 Shadowrocket 文件都由它生成，CI 自动校验。',
    f3Title: '个节点',
    f3Text: '只提供规则，节点用你自己的。选好节点后，只有 AI 流量会经过它。',
    srOwnTitle: '保留自己的配置：加 RULE-SET',
    srOwnText: '把下面几行加到你的配置里，放在 <code>FINAL</code> 之前。想给 AI 单独指定节点，把 <code>PROXY</code> 换成你自己的策略组名。',
    srStandTitle: '或者切换到独立配置',
    srStandText: '在 iPhone / iPad 上点一下即可导入。配置里不含节点：PROXY 指 App 里当前选中的节点，其余流量全部直连。',
    rsTitle: 'RULE-SET',
    rsText: '同一份 <code>.list</code> 文件在 Surge、Loon、Stash 里都能用，放在兜底规则之前即可。',
    clashOne: '两家共用一个节点', clashTwo: '两家分开走', clashApple: 'Apple Intelligence',
    clashText: '合并进你自己的配置。<code>RULE-SET</code> 必须放在 <code>GEOIP,CN</code> 和 <code>MATCH</code> <b>之前</b>，策略组名必须是 <code>proxy-groups</code> 里真实存在的名字。',
    clashNote: '完整示例见 <a href="https://github.com/ma-wenqian/ai-proxy-rules/blob/main/Clash/example-config.yaml">Clash/example-config.yaml</a>。老版本 Clash Premium 删掉 <code>format: yaml</code> 这一行。',
    appleText: 'Apple Intelligence 是独立规则集：请指向支持地区（如美国）的节点，并放在所有把 apple.com / iCloud 直连的规则<b>之前</b>。',
    appleText2: 'Apple Intelligence 单独使用：策略指向支持地区（如美国）的节点，并放在 apple.com / iCloud 直连规则之前。',
    srBoth: 'OpenAI + Claude', srOpenai: '只要 OpenAI', srClaude: '只要 Claude', srApple: '只要 Apple Intelligence',
    loading: '正在加载规则…', noMatch: '没有匹配的规则。', loadError: '规则清单加载失败。',
    search: '筛选，例如 claude.ai',
    copy: '复制', copied: '已复制',
  },
} as const

export type Key = keyof typeof I18N.en

export function useI18n() {
  const { lang } = useData()
  const isZh = computed(() => lang.value.startsWith('zh'))
  const t = (k: Key) => (isZh.value ? I18N.zh : I18N.en)[k]
  return { isZh, t }
}

export interface Rule { kind: string; value: string }
export interface Group { notes: string[]; rules: Rule[] }
export interface RuleData { claude: Group[]; openai: Group[]; apple: Group[] }

// A .list file: header comments up to the first blank line, then groups of
// comment lines followed by rule lines, separated by blank lines.
function parseList(text: string): Group[] {
  const blocks = text.replace(/\r/g, '').split(/\n\s*\n/).slice(1)
  return blocks
    .map((b) => {
      const lines = b.split('\n').filter(Boolean)
      return {
        notes: lines.filter((l) => l.startsWith('#')).map((l) => l.replace(/^#\s?/, '')),
        rules: lines
          .filter((l) => !l.startsWith('#'))
          .map((l) => {
            const [kind, value] = l.split(',')
            return { kind, value }
          }),
      }
    })
    .filter((g) => g.rules.length)
}

async function fetchList(name: string): Promise<string> {
  for (const url of [withBase(`/rules/${name}.list`), `${RAW}rules/${name}.list`]) {
    try {
      const r = await fetch(url, { cache: 'no-cache' })
      if (r.ok) return await r.text()
    } catch {}
  }
  throw new Error(name)
}

// 三个组件共用一次请求
let pending: Promise<RuleData> | null = null
export function loadRules(): Promise<RuleData> {
  pending ??= Promise.all([fetchList('claude'), fetchList('openai'), fetchList('apple-intelligence')]).then(
    ([c, o, a]) => ({ claude: parseList(c), openai: parseList(o), apple: parseList(a) }),
  )
  return pending
}

export const countRules = (gs: Group[]) => gs.reduce((n, g) => n + g.rules.length, 0)

// Pick the comment lines for the current language: bilingual "EN / 中文"
// lines are split; pure-CJK lines show in zh, pure-Latin lines in en.
const hasCJK = (s: string) => /[㐀-鿿]/.test(s)
export function notesFor(notes: string[], zh: boolean): string[] {
  const out: string[] = []
  for (const n of notes) {
    const parts = n.split(' / ')
    if (parts.length === 2 && hasCJK(parts[1]) && !hasCJK(parts[0])) out.push(zh ? parts[1] : parts[0])
    else if (hasCJK(n) === zh) out.push(n)
  }
  return out.length ? out : notes
}
