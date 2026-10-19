# 修改规则

只改 `rules/*.list`，然后重新生成：

```bash
bash scripts/build.sh
```

`.list` 和生成出来的 `Clash/`、`Shadowrocket/` 文件一起提交。CI 会跑 `bash scripts/build.sh --check`，两边不一致就报错。

## 清单格式

```
# AI Proxy Rules — Anthropic / Claude / Claude Code
# （文件头注释，到第一个空行为止）

# API — used by Claude Code, the SDKs and third-party clients
# API：Claude Code、SDK、第三方客户端都走这里
DOMAIN,api.anthropic.com

# Site, console, docs, login / 主站、控制台、文档、登录
DOMAIN-SUFFIX,anthropic.com
DOMAIN-SUFFIX,claude.ai
```

组与组之间用空行隔开。每组上面的注释会显示在网站的规则清单里：`English / 中文` 写在一行的会按语言拆开，中英文分两行写的按当前语言显示对应那行。

## 这个网站

网站在 `docs/`（VitePress），构建时从仓库根读取规则清单，所以网站和原始文件不会对不上。

```bash
cd docs
npm install
npm run dev        # http://localhost:8772/ai-proxy-rules/
```

push 到 `main` 后由 GitHub Actions 重新构建并发布。
