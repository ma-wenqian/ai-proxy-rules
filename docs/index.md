---
layout: home
title: AI Proxy Rules

hero:
  name: ai-proxy-rules
  text: Route only AI traffic through your proxy.
  tagline: Domain and IP rules for OpenAI, Claude and Apple Intelligence. Everything else stays direct — no global mode needed just to reach api.anthropic.com.
  actions:
    - theme: brand
      text: Get the rules
      link: /#install
    - theme: alt
      text: Read the guide
      link: /guide/rule-set
    - theme: alt
      text: GitHub
      link: https://github.com/ma-wenqian/ai-proxy-rules
---

<HomeStats />

## Install {#install}

Pick your client.

<InstallTabs />

## What's covered {#rules}

Live from `rules/*.list` — the single source every other file is generated from. What each group is for: [What's covered](/guide/coverage).

<RuleBrowser />

## If the web app works but your SDK times out {#dev}

- Rules only apply to traffic that goes through the proxy client. System-proxy mode usually covers browsers only — `curl`, Node and Python ignore it.
- Turn on **TUN / enhanced mode** so every process is captured, or set `HTTPS_PROXY=http://127.0.0.1:7890` in your shell (this proxies everything).
- Don't match Claude Code with `PROCESS-NAME,node` — that pulls every Node process through the proxy. Domain rules are more precise.
- Prefer a residential node and avoid load balancing: both providers are strict about datacenter IPs, and changing exit IP mid-session drops your login.

More in [SDK times out?](/guide/developers)
