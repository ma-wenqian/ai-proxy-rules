# SDK times out?

**Rules only apply to traffic that actually goes through the proxy client.** On desktop, "system proxy" mode usually only covers browsers — `curl`, Node and Python do **not** read the system proxy settings by default. This is the most common reason the web app works but your SDK times out.

## Two ways out

### Turn on TUN / enhanced mode

Clash Verge, mihomo and Surge all have it. Traffic from every process is captured, so the rules apply as expected.

### Set proxy environment variables in your shell

```bash
export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1
```

PowerShell:

```powershell
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

Use whatever port your client actually listens on.

::: warning This proxies everything
Environment variables send **all** traffic from that shell through the proxy, not just the domains in these rule sets. Add your internal hostnames to `NO_PROXY`.
:::

## Don't use process rules

Don't use `PROCESS-NAME` to match Claude Code or the SDKs. Claude Code runs on Node, so `PROCESS-NAME,node` would drag every Node process on the machine through the proxy, including local dev servers and npm installs. Matching on domains is more precise.

## Node choice

Both providers are strict about datacenter IPs and will throw CAPTCHAs or refuse outright. Prefer a residential node, and don't put these rules behind load balancing — changing exit IP mid-session drops your login.
