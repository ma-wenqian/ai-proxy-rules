// 把仓库根的 rules/、Clash/、Shadowrocket/ 拷进 docs/public/,
// 让站点上 /ai-proxy-rules/rules/*.list 这类旧路径继续可用,首页的规则清单也从这里读。
// 拷贝结果已在 docs/.gitignore 里排除,源头永远是仓库根。
import { cpSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const docs = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(docs, '..')

for (const dir of ['rules', 'Clash', 'Shadowrocket']) {
  const dest = join(docs, 'public', dir)
  rmSync(dest, { recursive: true, force: true })
  cpSync(join(root, dir), dest, { recursive: true })
}
console.log('  copied rules/ Clash/ Shadowrocket/ -> docs/public/')
