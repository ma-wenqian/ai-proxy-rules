# Shadowrocket 独立配置

**在 iOS 设备上**点下面的按钮，Shadowrocket 会自动跳转并导入配置（GitHub 会屏蔽 `shadowrocket://` 链接，所以一键安装放在这个网站上）。

<div class="sr-install">
  <a class="sr-btn" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf">OpenAI + Claude</a>
  <a class="sr-btn ghost" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf">只要 OpenAI</a>
  <a class="sr-btn ghost" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf">只要 Claude</a>
  <a class="sr-btn ghost" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/apple-intelligence.conf">只要 Apple Intelligence</a>
</div>

也可以复制下面的地址手动添加：Shadowrocket →**配置**→ 右上角 **+** → 粘贴地址。

| 配置 | 地址 |
| --- | --- |
| OpenAI + Claude | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf` |
| 只要 OpenAI | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf` |
| 只要 Claude | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf` |
| 只要 Apple Intelligence | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/apple-intelligence.conf` |

## 它是怎么工作的

**配置里不含任何节点。** 节点在 Shadowrocket 自己的服务器列表里，`PROXY` 表示当前选中的那个，所以照常选好节点再切到这个配置即可。

最后一条 `FINAL,DIRECT` 保证除 OpenAI 和 Anthropic 之外的流量全部直连。需要全局代理时切回你原来的配置。

想保留自己的配置，改用 [RULE-SET](./rule-set)。

<style>
.sr-install { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.vp-doc a.sr-btn {
  font-size: 14px; font-weight: 550; text-decoration: none;
  background: var(--vp-c-brand-1); color: var(--apr-accent-ink);
  border: 1px solid var(--vp-c-brand-1); border-radius: 8px; padding: 7px 14px;
}
.vp-doc a.sr-btn.ghost { background: transparent; color: var(--vp-c-text-1); border-color: var(--vp-c-divider); font-weight: 500; }
</style>
