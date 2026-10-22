# Clash / mihomo

想要一份带好全部分流的完整配置（Clash Verge 导入即用、还能叠加自己的订阅），看 [Clash Verge 完整配置](./clash-verge)。

在自己的配置里加两段，完整示例见 [Clash/example-config.yaml](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/Clash/example-config.yaml)。

`Clash/*.yaml` 是 `behavior: classical` 的 rule-provider 文件（`payload:` 列表），合并进你现有的配置使用。

## 两家共用一个节点

```yaml
rule-providers:
  ai-proxy:
    type: http
    behavior: classical
    format: yaml
    interval: 86400
    url: "https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Clash/ai-proxy.yaml"
    path: ./ruleset/ai-proxy.yaml

rules:
  - RULE-SET,ai-proxy,AI      # AI 换成你自己的策略组名
```

## 两家分开走不同节点

```yaml
rule-providers:
  openai:
    type: http
    behavior: classical
    format: yaml
    interval: 86400
    url: "https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Clash/openai.yaml"
    path: ./ruleset/openai.yaml
  claude:
    type: http
    behavior: classical
    format: yaml
    interval: 86400
    url: "https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Clash/claude.yaml"
    path: ./ruleset/claude.yaml

rules:
  - RULE-SET,openai,OpenAI
  - RULE-SET,claude,Claude
```

## Apple Intelligence

始终单独一个 provider，指向美国节点组。

```yaml
rule-providers:
  apple-intelligence:
    type: http
    behavior: classical
    format: yaml
    interval: 86400
    url: "https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Clash/apple-intelligence.yaml"
    path: ./ruleset/apple-intelligence.yaml

rules:
  - RULE-SET,apple-intelligence,AppleIntelligence   # 放在 apple / icloud 规则之前
```

## 三个要点

- `RULE-SET` 必须放在 `GEOIP,CN,DIRECT`、`MATCH` 这类兜底规则**之前**，否则永远命中不到。Apple Intelligence 还要放在 `apple` / `icloud` 直连规则之上，域名有重叠。
- 策略组名（上面的 `AI` / `OpenAI` / `Claude`）必须是 `proxy-groups` 里真实存在的名字，写错会导致配置加载失败。
- `format: yaml` 是 mihomo 的字段，老版本 Clash Premium 删掉该行即可。
