# SDK 超时？

**规则只对经过代理软件的流量生效。** 桌面端的「系统代理」模式通常只影响浏览器，终端里的 `curl`、Node、Python 默认不读系统代理设置，这是「网页能开、SDK 报连接超时」的最常见原因。

## 两个解决办法

### 开 TUN / 增强模式

Clash Verge、mihomo、Surge 都有。所有进程的流量都会被接管，规则自然生效。

### 给终端设环境变量

```bash
export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1
```

PowerShell：

```powershell
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

端口以你的客户端实际监听端口为准。

::: warning 这是全量代理
环境变量会让这个终端里的**所有**流量都走代理，不再按域名分流。`NO_PROXY` 里记得加上公司内网域名。
:::

## 不要用进程规则

不建议用 `PROCESS-NAME` 匹配 Claude Code 或各类 SDK。Claude Code 跑在 Node 之上，`PROCESS-NAME,node` 会把机器上所有 Node 进程的流量都拽进代理，包括本地开发服务器和 npm 安装。按域名分流更精确。

## 节点选择

两家对机房 IP 的风控都比较严，容易触发验证码或直接拒绝，建议选原生住宅 / 家宽节点；不要用负载均衡，同一会话中途换出口 IP 会掉登录态。
