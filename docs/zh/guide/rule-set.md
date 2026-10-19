# RULE-SET

适用于 **Shadowrocket、Surge、Loon、Stash**。已经有自己的配置的话，不用整份切换，把规则集加进去即可。

放在 `FINAL` 之前：

```
RULE-SET,https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/rules/openai.list,PROXY
RULE-SET,https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/rules/claude.list,PROXY
```

想给 AI 单独指定节点，把 `PROXY` 换成你自己的策略组名。

## Apple Intelligence

独立规则集。要指向支持地区（如美国）的节点，并且放在所有把 `apple.com` / iCloud 直连的规则**之前**：

```
RULE-SET,https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/rules/apple-intelligence.list,US
```

## 规则文件

`rules/*.list` 是规则源文件：每行一条（`DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`IP-CIDR`、`IP-CIDR6`），按用途分组并带注释，见[覆盖范围](./coverage)。

不想动自己的配置？Shadowrocket 也可以直接导入[独立配置](./shadowrocket)。
