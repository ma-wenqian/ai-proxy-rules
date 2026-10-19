# 覆盖范围

| 服务 | 包含内容 |
| --- | --- |
| **OpenAI** | ChatGPT 网页与桌面端、`api.openai.com`、platform 控制台、Sora、登录与 Arkose 人机验证、高级语音（LiveKit） |
| **Anthropic** | Claude 网页端、`api.anthropic.com`（Claude Code / SDK）、console 控制台、Artifacts / MCP Apps 沙箱、文件上传、`clau.de` 短链、`claude.dev`、Anthropic 自有 IP 段（AS399358） |
| **Apple Intelligence** | Siri / Apple Intelligence 后端（`guzzoni.apple.com`、`smoot.apple.com`、`siri` 关键字）、Private Relay（`mask*`、`apple-relay`）、定位（`ls.apple.com`）、iCloud 网关、App Store 资源。需要走支持地区（如美国）的节点；独立规则集，不包含在 `ai-proxy` 里 |

每条规则都带用途注释，见 [rules/claude.list](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/rules/claude.list)、[rules/openai.list](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/rules/openai.list) 与 [rules/apple-intelligence.list](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/rules/apple-intelligence.list)，也可以在[首页](/zh/#rules)直接搜索。

## 目录结构

```
rules/                  # 规则源文件，只手改这里
  openai.list           # 也可直接作为 RULE-SET 使用
  claude.list
  apple-intelligence.list
Clash/                  # 脚本生成（example-config.yaml 除外）
  ai-proxy.yaml         # OpenAI + Claude 合集，两家共用一个节点时用这个
  openai.yaml           # 仅 OpenAI
  claude.yaml           # 仅 Claude
  apple-intelligence.yaml  # 仅 Apple Intelligence（不在 ai-proxy 里）
  example-config.yaml   # 接入示例：rule-providers / proxy-groups / rules
Shadowrocket/           # 脚本生成
  ai-proxy.conf         # OpenAI + Claude 合集
  openai.conf           # 仅 OpenAI
  claude.conf           # 仅 Claude
  apple-intelligence.conf  # 仅 Apple Intelligence（不在 ai-proxy 里）
scripts/build.sh        # rules/*.list -> Clash/ + Shadowrocket/
docs/                   # 这个网站（VitePress）
```

`rules/*.list` 是 Shadowrocket、Surge、Loon、Stash 通用的 RULE-SET 文件；`Clash/*.yaml` 是 `behavior: classical` 的 rule-provider 文件；`Shadowrocket/*.conf` 是独立配置。

## 维护范围

目前只维护 OpenAI、Anthropic 和 Apple Intelligence，其他服务后续再补。本仓库可供相关地区的开发者参考。

## 致谢

[blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) —— 早期版本的 OpenAI 规则来源。现在域名清单已内置，不再引用外部规则集。
