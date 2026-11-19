import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cpus } from 'node:os'
import { execFileSync } from 'node:child_process'
import { format, resolveConfig } from 'prettier'

export const root = fileURLToPath(new URL('../', import.meta.url))
export const codecs = ['base45', 'base64', 'utf8', 'gzip', 'util']
export const metrics = ['statements', 'branches', 'functions', 'lines']
export const runtimeNames = ['node', 'bun', 'deno', 'edge', 'cloudflare']
export const projects = [
  'chromium',
  'firefox',
  'webkit',
  'mobile-chromium',
  'mobile-firefox',
  'mobile-webkit',
]

export function readJson(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined
}
export function writeJson(file, report) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(report, null, 2) + '\n')
}
export function provenance() {
  return {
    generatedAt: new Date().toISOString(),
    commit: execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
    }).trim(),
    run:
      process.env.GITHUB_ACTIONS === 'true'
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : undefined,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpu: cpus()[0]?.model,
  }
}
const cell = (value) =>
  String(value).replaceAll('|', '&#124;').replaceAll('\n', ' ')
export function table(headings, rows) {
  return [
    '| ' + headings.map(cell).join(' | ') + ' |',
    '| ' + headings.map((_, i) => (i ? '---:' : '---')).join(' | ') + ' |',
    ...rows.map((row) => '| ' + row.map(cell).join(' | ') + ' |'),
  ].join('\n')
}
export function replaceBlock(source, id, body) {
  const begin = `<!-- BEGIN GENERATED:${id} -->`
  const end = `<!-- END GENERATED:${id} -->`
  if (source.split(begin).length !== 2 || source.split(end).length !== 2)
    throw new Error(`Missing or duplicate README report block: ${id}`)
  const start = source.indexOf(begin) + begin.length
  const stop = source.indexOf(end)
  if (stop < start) throw new Error(`Reversed README report block: ${id}`)
  return source.slice(0, start) + '\n\n' + body + '\n\n' + source.slice(stop)
}
function origin(report) {
  if (!report) return 'Not run yet.'
  return `${report.generatedAt} · ${report.run ? `[CI run](${report.run})` : 'local run'} · commit \`${report.commit.slice(0, 7)}\`\n\nNode ${report.node} · ${report.platform} ${report.arch}`
}
export function summarizeTests(report, codec) {
  const files =
    report?.testResults.filter((file) =>
      file.name.replaceAll('\\', '/').includes(`/test/${codec}/`)
    ) ?? []
  if (!files.length) return undefined
  const tests = files.flatMap((file) => file.assertionResults)
  return {
    passed: tests.filter((test) => test.status === 'passed').length,
    failed: tests.filter((test) => test.status === 'failed').length,
    skipped: tests.filter(
      (test) => test.status !== 'passed' && test.status !== 'failed'
    ).length,
    files: files.length,
  }
}
function renderTests(unit, coverage, codec) {
  const summary = summarizeTests(unit, codec)
  if (!summary) return 'Not run yet.'
  const file = Object.entries(coverage ?? {}).find(([path]) =>
    path.replaceAll('\\', '/').endsWith(`/src/${codec}/index.ts`)
  )?.[1]
  return [
    table(
      ['Suite', 'Passed', 'Failed', 'Skipped'],
      [
        [
          `${codec} (${summary.files} files)`,
          summary.passed,
          summary.failed,
          summary.skipped,
        ],
      ]
    ),
    file
      ? '\n' +
        table(
          ['Coverage', ...metrics],
          [['Percent', ...metrics.map((metric) => `${file[metric].pct}%`)]]
        )
      : '\nCoverage not measured in this run.',
  ].join('\n')
}
function renderBenchmark(report) {
  if (!report) return 'Not run yet.'
  return (
    origin(report) +
    `\n\n${report.cpu} · ${report.iterations.toLocaleString('en-US')} measured calls per case after warmup\n\n` +
    table(
      ['Operation', 'Input bytes', 'Ops/sec'],
      report.results.map((row) => [
        row.operation,
        row.size,
        Math.round(row.opsPerSec).toLocaleString('en-US'),
      ])
    )
  )
}
export function renderCompatibility(browser, runtimes) {
  const rows = []
  for (const name of runtimeNames) {
    const report = runtimes[name]
    if (!report) {
      rows.push([name, '—', 'not run', '—', '—'])
      continue
    }
    if (!report.results.length)
      rows.push([name, report.version ?? '—', 'failed', 0, 1])
    for (const result of report.results)
      rows.push([
        result.label,
        result.version ?? report.version ?? '—',
        result.ok && report.ok ? 'passed' : 'failed',
        result.tests.filter((test) => test.ok).length,
        result.tests.filter((test) => !test.ok).length,
      ])
  }
  function collect(suites) {
    return suites.flatMap((suite) => [
      ...(suite.specs ?? []).flatMap((spec) => spec.tests),
      ...collect(suite.suites ?? []),
    ])
  }
  const tests = collect(browser?.suites ?? [])
  for (const name of projects) {
    const selected = tests.filter((test) => test.projectName === name)
    const failed = selected.filter(
      (test) => test.status === 'unexpected'
    ).length
    const passed = selected.filter((test) => test.status === 'expected').length
    const skipped = selected.filter((test) => test.status === 'skipped').length
    const flaky = selected.some((test) => test.status === 'flaky')
    const version = selected
      .flatMap((test) => test.results)
      .flatMap((result) => result.annotations ?? [])
      .find((annotation) => annotation.type === 'browser-version')?.description
    rows.push([
      name,
      version ?? '—',
      !selected.length
        ? 'not run'
        : failed
          ? 'failed'
          : flaky
            ? 'flaky'
            : skipped
              ? 'skipped'
              : 'passed',
      passed,
      failed,
    ])
  }
  return table(
    ['Runtime / browser', 'Version', 'Status', 'Passed', 'Failed'],
    rows
  )
}
export async function updateReadme(directory = root, strict = false) {
  const unit = readJson(resolve(directory, 'test/.results/vitest.json'))
  const coverage = readJson(
    resolve(directory, 'coverage/coverage-summary.json')
  )
  const browser = readJson(resolve(directory, 'test/.results/playwright.json'))
  const runtimes = Object.fromEntries(
    runtimeNames.map((name) => [
      name,
      readJson(resolve(directory, `test/.results/${name}.json`)),
    ])
  )
  const benchmarks = Object.fromEntries(
    codecs.map((codec) => [
      codec,
      readJson(resolve(directory, `benchmark/.results/${codec}.json`)),
    ])
  )
  const run = readJson(resolve(directory, 'test/.results/run.json'))
  if (strict) {
    if (
      !run?.run ||
      run.commit !== provenance().commit ||
      !unit?.success ||
      !unit.numTotalTests ||
      unit.numPendingTests ||
      !coverage ||
      !browser ||
      browser.errors?.length ||
      browser.stats.unexpected ||
      browser.stats.flaky ||
      browser.stats.skipped
    )
      throw new Error('CI reports are missing, incomplete, or failing')
    const browserProjects = new Set()
    function collectProjects(suites) {
      for (const suite of suites) {
        for (const spec of suite.specs ?? [])
          for (const test of spec.tests) browserProjects.add(test.projectName)
        collectProjects(suite.suites ?? [])
      }
    }
    collectProjects(browser.suites)
    if (projects.some((project) => !browserProjects.has(project)))
      throw new Error('Missing browser project report')
    for (const codec of codecs) {
      if (
        !summarizeTests(unit, codec) ||
        !benchmarks[codec]?.results.length ||
        benchmarks[codec].commit !== run.commit ||
        benchmarks[codec].run !== run.run
      )
        throw new Error(`Missing current benchmark/test report: ${codec}`)
    }
    for (const name of runtimeNames) {
      if (
        !runtimes[name]?.ok ||
        runtimes[name].results.length !==
          (name === 'node' || name === 'bun' ? 2 : 1) ||
        runtimes[name].commit !== run.commit ||
        runtimes[name].run !== run.run
      )
        throw new Error(`Missing current runtime report: ${name}`)
    }
    for (const metric of metrics)
      if (coverage.total[metric].pct !== 100)
        throw new Error(`Coverage below 100%: ${metric}`)
  }
  const file = resolve(directory, 'README.md')
  let source = readFileSync(file, 'utf8')
  for (const codec of codecs) {
    source = replaceBlock(
      source,
      `${codec}:tests`,
      origin(run) +
        '\n\n' +
        renderTests(unit, coverage, codec) +
        '\n\n#### Compatibility\n\nThe shared compatibility suite exercises the whole public API.\n\n' +
        renderCompatibility(browser, runtimes)
    )
    source = replaceBlock(
      source,
      `${codec}:benchmarks`,
      renderBenchmark(benchmarks[codec])
    )
  }
  const suites = [...codecs, 'shared', 'integration'].map((codec) => {
    const summary = summarizeTests(unit, codec)
    return [
      codec,
      summary?.passed ?? '—',
      summary?.failed ?? '—',
      summary?.skipped ?? '—',
    ]
  })
  if (source.includes('<!-- BEGIN GENERATED:validation -->'))
    source = replaceBlock(
      source,
      'validation',
      origin(run) +
        '\n\n' +
        table(['Suite', 'Passed', 'Failed', 'Skipped'], suites) +
        '\n\n' +
        renderCompatibility(browser, runtimes)
    )
  source = await format(source, {
    ...(await resolveConfig(file)),
    filepath: file,
  })
  writeFileSync(file, source)
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv.includes('--start')) {
    for (const file of ['vitest', 'playwright', ...runtimeNames])
      rmSync(resolve(root, `test/.results/${file}.json`), { force: true })
    for (const codec of codecs)
      rmSync(resolve(root, `benchmark/.results/${codec}.json`), { force: true })
    rmSync(resolve(root, 'coverage/coverage-summary.json'), { force: true })
    writeJson(resolve(root, 'test/.results/run.json'), provenance())
  } else await updateReadme(root, process.argv.includes('--ci'))
}
