import { defineConfig } from 'vitepress'

const repo = 'https://github.com/ma-wenqian/ai-proxy-rules'
const base = '/ai-proxy-rules/'

const enSidebar = [
  {
    text: 'Use the rules',
    items: [
      { text: 'RULE-SET (Shadowrocket / Surge / Loon / Stash)', link: '/guide/rule-set' },
      { text: 'Shadowrocket standalone config', link: '/guide/shadowrocket' },
      { text: 'Clash / mihomo', link: '/guide/clash' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: "What's covered", link: '/guide/coverage' },
      { text: 'SDK times out?', link: '/guide/developers' },
      { text: 'Editing the rules', link: '/guide/editing' },
    ],
  },
]

const zhSidebar = [
  {
    text: '使用规则',
    items: [
      { text: 'RULE-SET（Shadowrocket / Surge / Loon / Stash）', link: '/zh/guide/rule-set' },
      { text: 'Shadowrocket 独立配置', link: '/zh/guide/shadowrocket' },
      { text: 'Clash / mihomo', link: '/zh/guide/clash' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '覆盖范围', link: '/zh/guide/coverage' },
      { text: 'SDK 超时？', link: '/zh/guide/developers' },
      { text: '修改规则', link: '/zh/guide/editing' },
    ],
  },
]

// 旧单页会按浏览器语言自动切中文。这里保留:第一次打开根路径且浏览器是中文时跳到 /zh/,
// 之后记住最近看的是哪种语言(theme/index.ts 每次换页写 localStorage 'apr-lang')。
const langRedirect = `(()=>{try{
var b='${base}',p=location.pathname;
if(p!==b&&p!==b+'index.html')return;
var s=localStorage.getItem('apr-lang');
if(s==='en')return;
if(s==='zh'||(navigator.language||'').toLowerCase().indexOf('zh')===0)location.replace(b+'zh/'+location.hash);
}catch(e){}})()`

export default defineConfig({
  title: 'ai-proxy-rules',
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png` }],
    ['meta', { name: 'theme-color', content: '#fbfaf7', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#171614', media: '(prefers-color-scheme: dark)' }],
    ['script', {}, langRedirect],
  ],
  themeConfig: {
    logo: '/favicon.svg',
    socialLinks: [{ icon: 'github', link: repo }],
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到结果',
                resetButtonTitle: '清除',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'OpenAI / Claude / Apple Intelligence proxy rules for Clash (mihomo), Shadowrocket, Surge and Loon.',
      themeConfig: {
        nav: [
          { text: 'Install', link: '/#install' },
          { text: 'Rules', link: '/#rules' },
          { text: 'Guide', link: '/guide/rule-set' },
        ],
        sidebar: { '/guide/': enSidebar },
        editLink: { pattern: `${repo}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
        footer: {
          message: 'Domain lists and configuration notes only — no proxy servers are provided. Use within the law where you live.',
          copyright: 'Released under the MIT License.',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description: 'OpenAI、Claude 与 Apple Intelligence 的分流规则，覆盖 Clash（mihomo）、Shadowrocket、Surge、Loon。',
      themeConfig: {
        nav: [
          { text: '安装', link: '/zh/#install' },
          { text: '规则', link: '/zh/#rules' },
          { text: '指南', link: '/zh/guide/rule-set' },
        ],
        sidebar: { '/zh/guide/': zhSidebar },
        editLink: { pattern: `${repo}/edit/main/docs/:path`, text: '在 GitHub 上编辑此页' },
        footer: {
          message: '本站只提供域名清单和配置说明，不提供任何代理节点。请在所在地法律允许的范围内使用。',
          copyright: '基于 MIT 许可发布',
        },
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新' },
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言',
        notFound: { title: '页面不存在', quote: '链接可能已经失效。', linkText: '回到首页' },
      },
    },
  },
})
