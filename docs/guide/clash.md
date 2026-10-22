# Clash / mihomo

Want a complete routing config instead (import into Clash Verge and go, with your own subscriptions on top)? See [Clash Verge full config](./clash-verge).

Add two sections to your own config. Full example: [Clash/example-config.yaml](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/Clash/example-config.yaml).

`Clash/*.yaml` are `behavior: classical` rule-provider files (a `payload:` list), meant to be merged into your existing config.

## One node for both

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
  - RULE-SET,ai-proxy,AI      # AI = your own proxy group name
```

## Separate nodes

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

Always its own provider; point it at a US node group.

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
  - RULE-SET,apple-intelligence,AppleIntelligence   # before any apple / icloud rule
```

## Three things to watch

- `RULE-SET` must come **before** catch-alls like `GEOIP,CN,DIRECT` or `MATCH`, otherwise it will never be reached. Apple Intelligence also has to sit above any `apple` / `icloud` direct rules, which overlap with its domains.
- The policy name (`AI` / `OpenAI` / `Claude` above) has to match a group that actually exists in your `proxy-groups`, or the config will fail to load.
- `format: yaml` is a mihomo field; drop that line on older Clash Premium.
