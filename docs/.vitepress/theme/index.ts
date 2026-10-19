import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './custom.css'
import HeroEyebrow from './components/HeroEyebrow.vue'
import HeroClients from './components/HeroClients.vue'
import RouterDemo from './components/RouterDemo.vue'
import HomeStats from './components/HomeStats.vue'
import InstallTabs from './components/InstallTabs.vue'
import RuleBrowser from './components/RuleBrowser.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(HeroEyebrow),
      'home-hero-actions-after': () => h(HeroClients),
      'home-hero-image': () => h(RouterDemo),
    })
  },
  enhanceApp({ app, router }) {
    app.component('HomeStats', HomeStats)
    app.component('InstallTabs', InstallTabs)
    app.component('RuleBrowser', RuleBrowser)
    // 记住最近看的语言,配合 config.mts 里根路径的自动跳转
    if (typeof window !== 'undefined') {
      router.onAfterRouteChange = (to) => {
        try {
          localStorage.setItem('apr-lang', to.includes('/zh/') ? 'zh' : 'en')
        } catch {}
      }
    }
  },
} satisfies Theme
