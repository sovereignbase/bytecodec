import { resolve } from 'node:path'
import { build } from 'esbuild'
import { EdgeRuntime } from 'edge-runtime'
import { ensurePassing, printResults } from '../shared/suite.mjs'

const entry = resolve(
  process.cwd(),
  'test',
  'e2e',
  'runsInEdgeRuntimes',
  'entry.mjs'
)
const output = await build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2024',
  write: false,
})
const runtime = new EdgeRuntime()
runtime.evaluate(output.outputFiles[0].text)
const results = await runtime.context.__BYTECODEC_RESULTS_PROMISE__

printResults(results)
ensurePassing(results)
