#!/usr/bin/env bash
# Generate Clash/*.yaml and Shadowrocket/*.conf from rules/*.list.
# 从 rules/*.list 生成 Clash/*.yaml 与 Shadowrocket/*.conf。
#
#   bash scripts/build.sh          # regenerate
#   bash scripts/build.sh --check  # fail if generated files are out of date (CI)
set -euo pipefail

cd "$(dirname "$0")/.."

REPO_URL="https://github.com/ma-wenqian/ai-proxy-rules"
GENERATED="# Generated from rules/*.list by scripts/build.sh — do not edit by hand.
# 由 scripts/build.sh 从 rules/*.list 生成，请勿手改。"

OPENAI_SECTION="# ===== OpenAI / ChatGPT / Sora ====="
CLAUDE_SECTION="# ===== Anthropic / Claude / Claude Code ====="

out_dir=.
if [[ "${1:-}" == "--check" ]]; then
  out_dir=$(mktemp -d)
  trap 'rm -rf "$out_dir"' EXIT
  mkdir -p "$out_dir/Clash" "$out_dir/Shadowrocket"
fi

# Rule body of a .list file: everything after the header, i.e. after the
# first blank line.
body() {
  awk 'started { print; next } /^[[:space:]]*$/ { started = 1 }' "$1"
}

# Body of both lists, each under a section title.
combined_body() {
  echo "$OPENAI_SECTION"
  body rules/openai.list
  echo
  echo "$CLAUDE_SECTION"
  body rules/claude.list
}

# Clash rule-provider payload: indent comments, turn rules into list items.
to_clash() {
  sed -E \
    -e 's/^(#.*)$/  \1/' \
    -e 's/^([A-Z0-9-]+,.*)$/  - \1/'
}

# Shadowrocket rules: insert the PROXY policy, before no-resolve if present.
to_shadowrocket() {
  sed -E \
    -e '/^[A-Z0-9-]+,/ s/$/,PROXY/' \
    -e 's/,no-resolve,PROXY$/,PROXY,no-resolve/'
}

# $1 file, $2 title, $3 extra header comment (may be empty), stdin = rule body
write_clash() {
  {
    echo "# AI Proxy Rules — $2"
    echo "# Clash / mihomo rule-provider, behavior: classical"
    [[ -n "$3" ]] && echo "$3"
    echo "#"
    echo "$GENERATED"
    echo "# $REPO_URL"
    echo
    echo "payload:"
    to_clash
  } >"$out_dir/Clash/$1"
}

# $1 file, $2 title, $3 English scope, $4 Chinese scope, stdin = rule body
write_shadowrocket() {
  {
    cat <<EOF
# AI Proxy Rules — $2
# A standalone Shadowrocket config: only $3 traffic goes through the proxy,
# everything else stays direct. Servers come from Shadowrocket's own server
# list — PROXY means "the server currently selected in the app".
#
# 独立的 Shadowrocket 配置：只有 $4 流量走代理，其余全部直连。
# 节点不在这里定义，PROXY 表示 App 里当前选中的那个节点。
#
# Already have your own config? Use the RULE-SET in rules/ instead.
# 已经有自己的配置？改用 rules/ 下的 RULE-SET，不用整份切换。
#
$GENERATED
# $REPO_URL

[General]
bypass-system = true
skip-proxy = 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, 100.64.0.0/10, localhost, *.local
bypass-tun = 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
dns-server = system

[Rule]
EOF
    to_shadowrocket
    echo
    echo "# Everything else stays direct / 其余流量全部直连"
    echo "FINAL,DIRECT"
  } >"$out_dir/Shadowrocket/$1"
}

COMBINED_NOTE="# Use this single file when both services share the same node; use
# openai.yaml and claude.yaml if you want to route them separately.
#
# 两家共用同一个节点时用这一个文件即可；需要分别指定节点请改用
# openai.yaml 与 claude.yaml"

body rules/openai.list | write_clash openai.yaml "OpenAI / ChatGPT / Sora" ""
body rules/apple-intelligence.list | write_clash apple-intelligence.yaml "Apple Intelligence / Siri / Relay" ""
body rules/claude.list | write_clash claude.yaml "Anthropic / Claude / Claude Code" ""
combined_body | write_clash ai-proxy.yaml "OpenAI + Claude" "$COMBINED_NOTE"

body rules/openai.list | write_shadowrocket openai.conf "OpenAI only" "OpenAI" "OpenAI"
body rules/claude.list | write_shadowrocket claude.conf "Claude only" "Anthropic" "Anthropic"
body rules/apple-intelligence.list | write_shadowrocket apple-intelligence.conf "Apple Intelligence only" "Apple Intelligence" "Apple Intelligence"
combined_body | write_shadowrocket ai-proxy.conf "OpenAI + Claude" "AI" "AI"

if [[ "$out_dir" != "." ]]; then
  status=0
  for f in Clash/openai.yaml Clash/claude.yaml Clash/apple-intelligence.yaml Clash/ai-proxy.yaml \
           Shadowrocket/openai.conf Shadowrocket/claude.conf Shadowrocket/apple-intelligence.conf Shadowrocket/ai-proxy.conf; do
    if ! diff -u "$f" "$out_dir/$f"; then
      status=1
    fi
  done
  if [[ $status -ne 0 ]]; then
    echo "Generated files are out of date — run: bash scripts/build.sh" >&2
  fi
  exit $status
fi
