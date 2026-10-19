# Editing the rules

Only edit `rules/*.list`, then regenerate:

```bash
bash scripts/build.sh
```

Commit the `.list` change together with the regenerated `Clash/` and `Shadowrocket/` files. CI runs `bash scripts/build.sh --check` and fails if they are out of sync.

## List format

```
# AI Proxy Rules — Anthropic / Claude / Claude Code
# (header comments up to the first blank line)

# API — used by Claude Code, the SDKs and third-party clients
# API：Claude Code、SDK、第三方客户端都走这里
DOMAIN,api.anthropic.com

# Site, console, docs, login / 主站、控制台、文档、登录
DOMAIN-SUFFIX,anthropic.com
DOMAIN-SUFFIX,claude.ai
```

Groups are separated by blank lines. The comment lines above each group are shown on the website's rule list: a bilingual `English / 中文` line is split by language, and separate English / Chinese lines are shown in the matching language.

## This website

The site lives in `docs/` (VitePress). It reads the rule lists at build time from the repository root, so the website and the raw files can't drift.

```bash
cd docs
npm install
npm run dev        # http://localhost:8772/ai-proxy-rules/
```

Pushing to `main` rebuilds and publishes it with GitHub Actions.
