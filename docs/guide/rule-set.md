# RULE-SET

For **Shadowrocket, Surge, Loon and Stash**. If you already have your own config, add the rule sets to it instead of switching configs.

Put these lines above your `FINAL` rule:

```
RULE-SET,https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/rules/openai.list,PROXY
RULE-SET,https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/rules/claude.list,PROXY
```

Replace `PROXY` with a policy group of your own if you want a dedicated node.

## Apple Intelligence

A separate rule set. Send it to a node in a supported region (e.g. US), and put it **before** any rule that sends `apple.com` / iCloud domains direct:

```
RULE-SET,https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/rules/apple-intelligence.list,US
```

## The files

`rules/*.list` are the source of truth: one rule per line (`DOMAIN`, `DOMAIN-SUFFIX`, `DOMAIN-KEYWORD`, `IP-CIDR`, `IP-CIDR6`), grouped with a comment that says what each group is for. See [What's covered](./coverage).

Don't want to touch your own config? Shadowrocket can also import a [standalone config](./shadowrocket).
