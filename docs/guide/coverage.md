# What's covered

| Service | What's included |
| --- | --- |
| **OpenAI** | ChatGPT web & desktop, `api.openai.com`, platform console, Sora, login + Arkose CAPTCHA, advanced voice (LiveKit) |
| **Anthropic** | Claude web app, `api.anthropic.com` (Claude Code / SDKs), console, Artifacts / MCP Apps sandboxes, file uploads, `clau.de` short links, `claude.dev`, Anthropic IP blocks (AS399358) |
| **Apple Intelligence** | Siri / Apple Intelligence backend (`guzzoni.apple.com`, `smoot.apple.com`, `siri` keyword), Private Relay (`mask*`, `apple-relay`), location (`ls.apple.com`), iCloud gateway, App Store assets. Needs a node in a supported region (e.g. US). Standalone — not part of `ai-proxy` |

Every entry is commented with what it's for — see [rules/claude.list](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/rules/claude.list), [rules/openai.list](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/rules/openai.list) and [rules/apple-intelligence.list](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/rules/apple-intelligence.list), or search them on the [home page](/#rules).

## Repository layout

```
rules/                  # source of truth, edited by hand
  openai.list           # also usable directly as a RULE-SET
  claude.list
  apple-intelligence.list
Clash/                  # generated, except example-config.yaml
  ai-proxy.yaml         # OpenAI + Claude, one node for both
  openai.yaml           # OpenAI only
  claude.yaml           # Claude only
  apple-intelligence.yaml  # Apple Intelligence only (not in ai-proxy)
  example-config.yaml   # how to wire it up: rule-providers / proxy-groups / rules
Shadowrocket/           # generated
  ai-proxy.conf         # OpenAI + Claude
  openai.conf           # OpenAI only
  claude.conf           # Claude only
  apple-intelligence.conf  # Apple Intelligence only (not in ai-proxy)
scripts/build.sh        # rules/*.list -> Clash/ + Shadowrocket/
docs/                   # this website (VitePress)
```

`rules/*.list` are RULE-SET files for Shadowrocket, Surge, Loon and Stash. `Clash/*.yaml` are `behavior: classical` rule-provider files. `Shadowrocket/*.conf` are standalone configs.

## Scope

Currently OpenAI, Anthropic and Apple Intelligence. More services may be added later. Intended as a reference for developers in regions where these services aren't directly reachable.

## Credits

[blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) — the source of the OpenAI rules in earlier versions of this repo. The domain lists are now inlined, so no external rule set is fetched.
