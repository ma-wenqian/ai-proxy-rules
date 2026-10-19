---
layout: home
title: AI 分流规则

hero:
  name: ai-proxy-rules
  text: 只让 AI 流量走代理。
  tagline: OpenAI、Claude 与 Apple Intelligence 的域名和 IP 分流规则。其余流量保持直连，不用为了连上 api.anthropic.com 而开全局。
  actions:
    - theme: brand
      text: 获取规则
      link: /zh/#install
    - theme: alt
      text: 看指南
      link: /zh/guide/rule-set
    - theme: alt
      text: GitHub
      link: https://github.com/ma-wenqian/ai-proxy-rules
---

<HomeStats />

## 安装 {#install}

选择你用的客户端。

<InstallTabs />

## 覆盖范围 {#rules}

实时读取 `rules/*.list`，其它所有规则文件都从这里生成。每组规则是干什么的见[覆盖范围](/zh/guide/coverage)。

<RuleBrowser />

## 网页能开、SDK 却超时？ {#dev}

- 规则只对经过代理软件的流量生效。「系统代理」模式通常只影响浏览器，`curl`、Node、Python 默认不读。
- 打开 **TUN / 增强模式** 接管所有进程，或者在终端设置 `HTTPS_PROXY=http://127.0.0.1:7890`（这是全量代理）。
- 不要用 `PROCESS-NAME,node` 匹配 Claude Code，会把所有 Node 进程都拽进代理，按域名分流更精确。
- 建议用住宅 / 家宽节点，不要用负载均衡：两家对机房 IP 风控都很严，会话中途换出口 IP 会掉登录。

详见 [SDK 超时？](/zh/guide/developers)
