import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'
import { resolve } from 'node:path'
import {
  codecs,
  provenance,
  root,
  table,
  writeJson,
} from '../scripts/reporting.mjs'
import { fixture } from './shared/fixtures.mjs'

const selected = process.argv.slice(2)
if (selected.some((codec) => !codecs.includes(codec)))
  throw new Error('Unknown codec')
const sizes = (process.env.BENCH_SIZES ?? '64,1024,16384')
  .split(',')
  .map(Number)
const iterations = Number(process.env.BENCH_ITERATIONS ?? 1000)
const warmup = Number(process.env.BENCH_WARMUP ?? 100)
for (const value of [...sizes, iterations, warmup]) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new Error('Benchmark settings must be positive integers')
}
if (sizes.some((size) => size > 65536))
  throw new Error(
    'BENCH_SIZES must stay within the Web Crypto random quota (65536)'
  )
let sink
for (const codec of selected.length ? selected : codecs) {
  const { workloads } = await import(`./${codec}/workloads.mjs`)
  const results = []
  for (const size of sizes) {
    for (const workload of await workloads(fixture(size))) {
      const result = await workload.run()
      if (workload.verify)
        assert.equal(await workload.verify(result), true, workload.operation)
      else assert.deepEqual(result, workload.expected, workload.operation)
      if (workload.async) {
        for (let i = 0; i < warmup; i++) sink = await workload.run()
      } else {
        for (let i = 0; i < warmup; i++) sink = workload.run()
      }
      const start = performance.now()
      if (workload.async) {
        for (let i = 0; i < iterations; i++) sink = await workload.run()
      } else {
        for (let i = 0; i < iterations; i++) sink = workload.run()
      }
      const milliseconds = performance.now() - start
      results.push({
        operation: workload.operation,
        size,
        iterations,
        milliseconds,
        opsPerSec: (iterations * 1000) / milliseconds,
      })
    }
  }
  const report = { ...provenance(), sizes, iterations, warmup, results }
  writeJson(resolve(root, `benchmark/.results/${codec}.json`), report)
  console.log(
    codec +
      '\n' +
      table(
        ['Operation', 'Bytes', 'Ops/sec'],
        results.map((row) => [
          row.operation,
          row.size,
          Math.round(row.opsPerSec).toLocaleString('en-US'),
        ])
      )
  )
}
void sink
