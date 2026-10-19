# Shadowrocket standalone config

**On the iOS device**, tap a button below and Shadowrocket imports the config automatically. (GitHub strips `shadowrocket://` links, which is why one-tap install lives on this site.)

<div class="sr-install">
  <a class="sr-btn" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf">OpenAI + Claude</a>
  <a class="sr-btn ghost" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf">OpenAI only</a>
  <a class="sr-btn ghost" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf">Claude only</a>
  <a class="sr-btn ghost" href="shadowrocket://config/add/https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/apple-intelligence.conf">Apple Intelligence only</a>
</div>

Or copy a URL and add it by hand: Shadowrocket → **Config** → **+** → paste the URL.

| Config | URL |
| --- | --- |
| OpenAI + Claude | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/ai-proxy.conf` |
| OpenAI only | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/openai.conf` |
| Claude only | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/claude.conf` |
| Apple Intelligence only | `https://raw.githubusercontent.com/ma-wenqian/ai-proxy-rules/main/Shadowrocket/apple-intelligence.conf` |

## How it behaves

**These configs contain no servers.** Servers live in Shadowrocket's own list, and `PROXY` resolves to whichever one is currently selected — so pick a node in the app as usual, then switch to this config.

The last rule is `FINAL,DIRECT`, which is what keeps everything other than OpenAI and Anthropic off the proxy. Switch back to your regular config when you need general proxying.

If you'd rather keep your own config, add a [RULE-SET](./rule-set) instead.

<style>
.sr-install { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.vp-doc a.sr-btn {
  font-size: 14px; font-weight: 550; text-decoration: none;
  background: var(--vp-c-brand-1); color: var(--apr-accent-ink);
  border: 1px solid var(--vp-c-brand-1); border-radius: 8px; padding: 7px 14px;
}
.vp-doc a.sr-btn.ghost { background: transparent; color: var(--vp-c-text-1); border-color: var(--vp-c-divider); font-weight: 500; }
</style>
