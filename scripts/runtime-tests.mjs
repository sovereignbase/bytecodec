import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import {
  provenance,
  readJson,
  root,
  runtimeNames,
  writeJson,
} from './reporting.mjs'

const commands = {
  node: [process.execPath, 'runsInNode/runner.mjs'],
  bun: ['bun', 'runsInBun/runner.mjs'],
  deno: ['deno', 'runsInDeno/runner.mjs'],
  edge: [process.execPath, 'runsInEdgeRuntimes/runner.mjs'],
  cloudflare: [process.execPath, 'runsInCloudflareWorkers/run.mjs'],
}
const selected = process.argv.slice(2)
if (!selected.length || selected.some((name) => !runtimeNames.includes(name)))
  throw new Error('Select one or more runtimes: ' + runtimeNames.join(', '))
for (const name of selected) {
  const [command, runner] = commands[name]
  const args = [resolve(root, 'test/compatibility', runner)]
  if (name === 'deno') args.unshift('run')
  const results = []
  let stdout = ''
  const child = spawn(command, args, {
    cwd: root,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', (chunk) => {
    stdout += chunk
    process.stdout.write(chunk)
  })
  child.stderr.pipe(process.stderr)
  const code = await new Promise((resolveExit) => {
    child.on('error', (error) => {
      console.error(error)
      resolveExit(1)
    })
    child.on('close', resolveExit)
  })
  for (const line of stdout.split(/\r?\n/)) {
    if (line.startsWith('BYTECODEC_RESULT '))
      results.push(JSON.parse(line.slice('BYTECODEC_RESULT '.length)))
  }
  const packageName =
    name === 'edge'
      ? 'edge-runtime'
      : name === 'cloudflare'
        ? 'workerd'
        : undefined
  if (packageName) {
    const version = readJson(
      resolve(root, 'node_modules', packageName, 'package.json')
    ).version
    for (const result of results) result.version = version
  }
  const ok =
    code === 0 &&
    results.length === (name === 'node' || name === 'bun' ? 2 : 1) &&
    results.every((result) => result.ok)
  writeJson(resolve(root, `test/.results/${name}.json`), {
    ...provenance(),
    ok,
    exitCode: code,
    results,
  })
  if (!ok) process.exitCode = 1
}
