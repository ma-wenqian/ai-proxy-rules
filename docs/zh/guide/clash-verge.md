# Clash Verge 完整配置

这一页讲的是**拿到一份已经带好规则的订阅**之后怎么用，比如 3x-ui 面板生成的 `/clash/…` 链接。
只想把 AI 规则合进自己现有的配置，看 [Clash / mihomo](./clash) 就够了。

## 分流方案

订阅里带的分组和规则就是仓库里的 [Clash/template.yaml](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/Clash/template.yaml)：

| 策略组 | 可选 | 默认 | 管哪些流量 |
| --- | --- | --- | --- |
| `♻️ 节点` | 订阅里的全部节点 | 第一个节点 | **Claude、OpenAI、`claude.exe`，永远走代理**（组里没有 DIRECT） |
| `🧱 大陆无法访问（默认直连）` | DIRECT / `♻️ 节点` / 你自己加的订阅 | DIRECT | Google、YouTube、Telegram、被墙站点、境外顶级域名 |
| `🏠 其他流量（默认直连）` | DIRECT / `🧱 大陆无法访问` | DIRECT | 上面都没匹配到的，一般不用动 |

国内网站、局域网、Apple / iCloud 固定直连。有的订阅里还会多一两个组（名字会写清楚什么时候切），用法一样。

## 安装 Clash Verge Rev

1. 从 [GitHub Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases/latest) 下载：Windows 选 `x64-setup.exe`，Apple 芯片的 Mac 选 `aarch64.dmg`，Intel Mac 选 `x64.dmg`。
2. 打开「订阅」，把 `/clash/…` 链接粘贴进输入框，点「导入」。再点一下这张订阅卡片，让它成为当前使用的配置。
3. 打开「设置」：先安装**服务模式**，再打开**虚拟网卡模式（TUN）**。这样浏览器、命令行、IDE 的流量都会被接管，不用一个个设代理。
4. 完成。规则由订阅提供方维护，客户端按订阅里写的间隔自动刷新；想马上拿到新规则，右键订阅卡片 →「更新」。
5. **不用的时候**：关掉 TUN，或者直接在托盘图标上退出 Clash Verge。

## 再加别的订阅（扩展脚本）

Clash Verge 同一时间只能用一份订阅。想同时用到别的订阅里的节点，比如：

- 你自己买了 VPN，想让 Google、YouTube 这些走它，AI 照旧走上面那份订阅；
- 你手上有两份订阅，一份专门给 AI、一份给其他流量。

做法是：**当前用的那份订阅不动，把其他订阅作为节点来源注入进来**，挂到某个策略组里。在下面填好，复制生成的脚本：

<VergeScript />

贴到哪里：

| 位置 | 对谁生效 | 什么时候用 |
| --- | --- | --- |
| 订阅卡片右键 →「扩展脚本」 | 只对这一份订阅 | **一般用这个** |
| 订阅页的「全局扩展脚本」 | 所有订阅 | 你会在几份订阅之间来回切，每份都要带上这些节点 |

打开后把编辑器里原有的内容**全部替换**成复制的脚本，保存。回到「代理」页，在你选的那个组里就能看到 `[名字] …` 开头的新节点，选上即可。

只要贴一次。之后每次订阅刷新，Clash Verge 都会先下载订阅、再跑这段脚本、最后才加载，所以订阅那边改了规则也不会把你加的节点冲掉。

::: tip 脚本做了什么
它只做两件事：把每个订阅加成一个 `proxy-provider`（只取节点，不用那份订阅自带的规则），再把它加进你选的组的 `use`。规则和别的组一点都不改。
如果当前订阅里找不到你选的组，那一条会被跳过，不会让整份配置加载失败。
:::

## 不用 Verge，自己写 mihomo 配置

把 [Clash/template.yaml](https://github.com/ma-wenqian/ai-proxy-rules/blob/main/Clash/template.yaml) 当成配置的主体，再补上节点来源。模板里的 `♻️ 节点` 用的是 `include-all-proxies`，只认 `proxies:` 里写死的节点；用订阅链接的话，把它换成 `use`：

```yaml
proxy-providers:
  my-sub:
    type: http
    url: "https://你的订阅链接"
    interval: 43200
    path: ./proxy_providers/my-sub.yaml

proxy-groups:
  - name: ♻️ 节点
    type: select
    use: [my-sub]
  # 其余分组、rule-providers、rules 照抄模板
```

## 注意

- **组名别改。** 规则和扩展脚本都是按组名找的，改了名字规则会指向不存在的组，整份配置加载失败。
- **只认 Meta 内核**（mihomo：Clash Verge Rev、FlClash、Clash Meta for Android）。`include-all-proxies` 老版 Clash for Windows 不认。
- 规则集从 jsDelivr 直接下载、不经过节点。jsDelivr 拉不到时**不会报错**，只是对应规则不命中：AI 那两条拉不到，Claude / OpenAI 就会落进默认直连。看到 AI 突然连不上，先在「规则」页看规则集是不是空的。
