# ai-proxy-rules

Proxy rules for **OpenAI** and **Claude**, for Clash (mihomo) and Shadowrocket.

English | [中文](#中文说明)

---

Only AI traffic is routed through the proxy — everything else stays direct, so
you don't have to turn on global mode just to reach `api.anthropic.com`.

## Coverage

| Service | What's included |
| --- | --- |
| **OpenAI** | ChatGPT web & desktop, `api.openai.com`, platform console, Sora, login + Arkose CAPTCHA, advanced voice (LiveKit) |
| **Anthropic** | Claude web app, `api.anthropic.com` (Claude Code / SDKs), console, Artifacts sandbox and file uploads |

Every entry is commented with what it's for — see [Clash/ai-proxy.yaml](Clash/ai-proxy.yaml).

## Layout

```
Clash/
  ai-proxy.yaml         # OpenAI + Claude, one node for both
  openai.yaml           # OpenAI only
  claude.yaml           # Claude only
  example-config.yaml   # how to wire it up: rule-providers / proxy-groups / rules
Shadowrocket/
  ai-proxy.conf         # OpenAI + Claude
  openai.conf           # OpenAI only
  claude.conf           # Claude only
```

`Clash/*.yaml` are `behavior: classical` rule-provider files (a `payload:` list)
meant to be merged into your existing config. `Shadowrocket/*.conf` are
standalone configs — see below.

## Shadowrocket

Tap one of the install links **on the iOS device** and Shadowrocket will import
the config automatically. If the link doesn't open, copy the URL below it and
add it by hand: Shadowrocket → **Config** → **+** → paste the URL.

**OpenAI + Claude** — [install](shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf)

```
https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf
```

**OpenAI only** — [install](shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf)

```
https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf
```

**Claude only** — [install](shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf)

```
https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf
```

**These configs contain no servers.** Servers live in Shadowrocket's own list,
and `PROXY` resolves to whichever one is currently selected — so pick a node in
the app as usual, then switch to this config. The last rule is `FINAL,DIRECT`,
which is what keeps everything other than OpenAI and Anthropic off the proxy.
Switch back to your regular config when you need general proxying.

## Clash / mihomo

Add two sections to your own config. Full example:
[Clash/example-config.yaml](Clash/example-config.yaml).

**One node for both:**

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

**Separate nodes:**

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

Three things to watch:

- `RULE-SET` must come **before** catch-alls like `GEOIP,CN,DIRECT` or `MATCH`,
  otherwise it will never be reached.
- The policy name (`AI` / `OpenAI` / `Claude` above) has to match a group that
  actually exists in your `proxy-groups`, or the config will fail to load.
- `format: yaml` is a mihomo field; drop that line on older Clash Premium.

## Notes for developers

**Rules only apply to traffic that actually goes through the proxy client.**
On desktop, "system proxy" mode usually only covers browsers — `curl`, Node and
Python do **not** read the system proxy settings by default. This is the most
common reason the web app works but your SDK times out.

Two ways out:

1. **Turn on TUN / enhanced mode** (Clash Verge, mihomo, Surge all have it).
   Traffic from every process is captured, so the rules apply as expected.

2. **Set proxy environment variables in your shell:**

   ```bash
   export HTTPS_PROXY=http://127.0.0.1:7890
   export HTTP_PROXY=http://127.0.0.1:7890
   export NO_PROXY=localhost,127.0.0.1
   ```

   PowerShell:

   ```powershell
   $env:HTTPS_PROXY="http://127.0.0.1:7890"
   ```

   Use whatever port your client actually listens on. Note this proxies
   **everything**, not just the domains in these rule sets — add your internal
   hostnames to `NO_PROXY`.

**On process rules:** don't use `PROCESS-NAME` to match Claude Code or the
SDKs. Claude Code runs on Node, so `PROCESS-NAME,node` would drag every Node
process on the machine through the proxy, including local dev servers and npm
installs. Matching on domains is more precise.

**Node choice:** both providers are strict about datacenter IPs and will throw
CAPTCHAs or refuse outright. Prefer a residential node, and don't put these
rules behind load balancing — changing exit IP mid-session drops your login.

## Scope

Currently OpenAI and Anthropic only. More services may be added later. Intended
as a reference for developers in regions where these services aren't directly
reachable.

## Credits

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
  — the source of the OpenAI rules in earlier versions of this repo. The domain
  lists are now inlined, so no external rule set is fetched.

## Disclaimer

This repository contains domain lists and configuration notes only. It does not
provide any proxy servers or circumvention service. Use it within the law where
you live.

## License

[MIT](LICENSE)

---

# 中文说明

[English](#ai-proxy-rules) | 中文

面向开发者的 OpenAI / Claude 分流规则，覆盖 Clash（mihomo）与 Shadowrocket。
只让 AI 相关的域名走代理，其余流量保持原样——不用为了跑通 `api.anthropic.com` 而开全局。

## 覆盖范围

| 服务 | 包含内容 |
| --- | --- |
| **OpenAI** | ChatGPT 网页与桌面端、`api.openai.com`、platform 控制台、Sora、登录与 Arkose 人机验证、高级语音（LiveKit） |
| **Anthropic** | Claude 网页端、`api.anthropic.com`（Claude Code / SDK）、console 控制台、Artifacts 沙箱与文件上传 |

每条规则都带用途注释，域名清单见 [Clash/ai-proxy.yaml](Clash/ai-proxy.yaml)。

## 目录结构

```
Clash/
  ai-proxy.yaml         # OpenAI + Claude 合集，两家共用一个节点时用这个
  openai.yaml           # 仅 OpenAI
  claude.yaml           # 仅 Claude
  example-config.yaml   # 接入示例：rule-providers / proxy-groups / rules
Shadowrocket/
  ai-proxy.conf         # OpenAI + Claude 合集
  openai.conf           # 仅 OpenAI
  claude.conf           # 仅 Claude
```

`Clash/*.yaml` 是 `behavior: classical` 的 rule-provider 文件（`payload:` 列表），
合并进你现有的配置使用；`Shadowrocket/*.conf` 是独立配置，见下文。

## Shadowrocket

**在 iOS 设备上**点击「一键安装」，Shadowrocket 会自动跳转并导入配置。
如果链接打不开，复制下面的地址手动添加：Shadowrocket →**配置**→ 右上角 **+** → 粘贴地址。

**OpenAI + Claude** —— [一键安装](shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf)

```
https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf
```

**只要 OpenAI** —— [一键安装](shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf)

```
https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf
```

**只要 Claude** —— [一键安装](shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf)

```
https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf
```

**配置里不含任何节点。** 节点在 Shadowrocket 自己的服务器列表里，`PROXY` 表示当前选中的那个，
所以照常选好节点再切到这个配置即可。最后一条 `FINAL,DIRECT` 保证除 OpenAI 和 Anthropic
之外的流量全部直连。需要全局代理时切回你原来的配置。

## Clash / mihomo

在自己的配置里加两段，完整示例见 [Clash/example-config.yaml](Clash/example-config.yaml)。

**两家共用一个节点：**

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

**两家分开走不同节点：**

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

三个要点：

- `RULE-SET` 必须放在 `GEOIP,CN,DIRECT`、`MATCH` 这类兜底规则**之前**，否则永远命中不到。
- 策略组名（上面的 `AI` / `OpenAI` / `Claude`）必须是 `proxy-groups` 里真实存在的名字，
  写错会导致配置加载失败。
- `format: yaml` 是 mihomo 的字段，老版本 Clash Premium 删掉该行即可。

## 开发者须知

**规则只对经过代理软件的流量生效。** 桌面端的「系统代理」模式通常只影响浏览器，
终端里的 `curl`、Node、Python 默认不读系统代理设置，这是「网页能开、SDK 报连接超时」的最常见原因。

两个解决办法：

1. **开 TUN / 增强模式**（Clash Verge、mihomo、Surge 都有），所有进程的流量都会被接管，
   规则自然生效。

2. **给终端设环境变量：**

   ```bash
   export HTTPS_PROXY=http://127.0.0.1:7890
   export HTTP_PROXY=http://127.0.0.1:7890
   export NO_PROXY=localhost,127.0.0.1
   ```

   PowerShell：

   ```powershell
   $env:HTTPS_PROXY="http://127.0.0.1:7890"
   ```

   端口以你的客户端实际监听端口为准。注意这是**全量**代理，不再按域名分流，
   `NO_PROXY` 里记得加上公司内网域名。

**关于进程规则**：不建议用 `PROCESS-NAME` 匹配 Claude Code 或各类 SDK。
Claude Code 跑在 Node 之上，`PROCESS-NAME,node` 会把机器上所有 Node 进程的流量都拽进代理，
包括本地开发服务器和 npm 安装。按域名分流更精确。

**节点选择**：两家对机房 IP 的风控都比较严，容易触发验证码或直接拒绝，
建议选原生住宅／家宽节点；不要用负载均衡，同一会话中途换出口 IP 会掉登录态。

## 维护范围

目前只维护 OpenAI 和 Anthropic 两家，其他服务后续再补。本仓库可供相关地区的开发者参考。

## 致谢

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
  —— 早期版本的 OpenAI 规则来源。现在域名清单已内置，不再引用外部规则集。

## 免责声明

本仓库只包含域名清单和配置说明，不提供任何代理节点或翻墙服务。
请在所在地法律法规允许的范围内使用。

## 许可证

[MIT](LICENSE)
