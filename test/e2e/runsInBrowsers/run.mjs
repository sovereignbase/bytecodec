import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const playwrightBin = resolve(
  process.cwd(),
  'node_modules',
  'playwright',
  'cli.js'
)

const result = spawnSync(process.execPath, [playwrightBin, 'test'], {
  stdio: 'inherit',
})

rmSync(resolve(process.cwd(), 'test-results'), {
  recursive: true,
  force: true,
})

if (result.status !== 0) process.exit(result.status ?? 1)
