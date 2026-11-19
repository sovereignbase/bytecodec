import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import {
  codecs,
  replaceBlock,
  summarizeTests,
  renderCompatibility,
  updateReadme,
  writeJson,
  provenance,
  metrics,
  projects,
  runtimeNames,
} from './reporting.mjs'

test('updates only the requested block, preserving surrounding documentation', () => {
  const source =
    'before\n<!-- BEGIN GENERATED:base45:tests -->\nold\n<!-- END GENERATED:base45:tests -->\nafter'
  const result = replaceBlock(source, 'base45:tests', 'new')
  assert.equal(result, source.replace('\nold\n', '\n\nnew\n\n'))
  assert.throws(() => replaceBlock(source, 'missing', ''), /Missing/)
  assert.throws(
    () => replaceBlock(source + source, 'base45:tests', ''),
    /duplicate/
  )
  assert.throws(
    () =>
      replaceBlock(
        '<!-- END GENERATED:x --><!-- BEGIN GENERATED:x -->',
        'x',
        ''
      ),
    /Reversed/
  )
})

test('counts failures and skips by codec across Windows and Linux paths', () => {
  const report = {
    testResults: [
      {
        name: 'C:\\repo\\test\\base45\\unit.test.ts',
        assertionResults: [
          { status: 'passed' },
          { status: 'failed' },
          { status: 'pending' },
        ],
      },
      {
        name: '/repo/test/base64/unit.test.ts',
        assertionResults: [{ status: 'passed' }],
      },
    ],
  }
  assert.deepEqual(summarizeTests(report, 'base45'), {
    passed: 1,
    failed: 1,
    skipped: 1,
    files: 1,
  })
  assert.equal(summarizeTests(report, 'gzip'), undefined)
})

test('compatibility tables expose absent, failing, skipped and flaky runs', () => {
  const browser = {
    suites: [
      {
        suites: [
          {
            specs: [
              {
                tests: [
                  { projectName: 'chromium', status: 'flaky', results: [] },
                  { projectName: 'firefox', status: 'unexpected', results: [] },
                  { projectName: 'webkit', status: 'skipped', results: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
  const result = renderCompatibility(browser, {
    node: { ok: false, results: [] },
  })
  assert.match(result, /node.*failed/)
  assert.match(result, /bun.*not run/)
  assert.match(result, /chromium.*flaky/)
  assert.match(result, /firefox.*failed/)
  assert.match(result, /webkit.*skipped/)
})

test('missing reports stay unrun and strict CI generation fails without touching README', async () => {
  const root = mkdtempSync(join(tmpdir(), 'bytecodec-report-'))
  try {
    const blocks = codecs
      .flatMap((codec) =>
        ['tests', 'benchmarks'].map((kind) => `${codec}:${kind}`)
      )
      .concat('validation')
    const source =
      '# Fixture\n\n' +
      blocks
        .map(
          (id) =>
            `<!-- BEGIN GENERATED:${id} -->\n\n<!-- END GENERATED:${id} -->`
        )
        .join('\n\n') +
      '\n'
    writeFileSync(join(root, 'README.md'), source)
    await assert.rejects(updateReadme(root, true), /CI reports/)
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), source)
    await updateReadme(root)
    const generated = readFileSync(join(root, 'README.md'), 'utf8')
    assert.match(generated, /Not run yet/)
    assert.doesNotMatch(generated, /100%|passed/)
    // A failed report must never be silently displayed as a successful run.
    writeJson(join(root, 'test/.results/node.json'), {
      ok: false,
      results: [{ label: 'node esm', ok: true, tests: [{ ok: true }] }],
    })
    await updateReadme(root)
    assert.match(
      readFileSync(join(root, 'README.md'), 'utf8'),
      /node esm.*failed/
    )
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()))
    assert.ok(root.startsWith(join(tmpdir(), 'bytecodec-report-')))
    rmSync(root, { recursive: true, force: true })
  }
})

test('complete CI reports render together; mixed runs and missing projects are rejected', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'bytecodec-report-'))
  try {
    const run = {
      ...provenance(),
      run: 'https://github.com/example/repo/actions/runs/123',
    }
    const blocks = codecs
      .flatMap((codec) =>
        ['tests', 'benchmarks'].map((kind) => `${codec}:${kind}`)
      )
      .concat('validation')
    writeFileSync(
      join(directory, 'README.md'),
      '# Fixture\n\n' +
        blocks
          .map(
            (id) =>
              `<!-- BEGIN GENERATED:${id} -->\n\n<!-- END GENERATED:${id} -->`
          )
          .join('\n\n')
    )
    writeJson(join(directory, 'test/.results/run.json'), run)
    writeJson(join(directory, 'test/.results/vitest.json'), {
      success: true,
      numTotalTests: codecs.length,
      testResults: codecs.map((codec) => ({
        name: `/repo/test/${codec}/unit.test.ts`,
        assertionResults: [{ status: 'passed' }],
      })),
    })
    const summary = Object.fromEntries(
      metrics.map((metric) => [metric, { pct: 100 }])
    )
    writeJson(join(directory, 'coverage/coverage-summary.json'), {
      total: summary,
      ...Object.fromEntries(
        codecs.map((codec) => [`/repo/src/${codec}/index.ts`, summary])
      ),
    })
    const browser = {
      stats: { unexpected: 0, flaky: 0, skipped: 0 },
      errors: [],
      suites: [
        {
          specs: [
            {
              tests: projects.map((projectName) => ({
                projectName,
                status: 'expected',
                results: [],
              })),
            },
          ],
        },
      ],
    }
    writeJson(join(directory, 'test/.results/playwright.json'), browser)
    for (const codec of codecs)
      writeJson(join(directory, `benchmark/.results/${codec}.json`), {
        ...run,
        iterations: 100,
        results: [{ operation: 'encode', size: 64, opsPerSec: 1234 }],
      })
    for (const name of runtimeNames)
      writeJson(join(directory, `test/.results/${name}.json`), {
        ...run,
        ok: true,
        results: Array.from(
          { length: name === 'node' || name === 'bun' ? 2 : 1 },
          () => ({ label: name, ok: true, tests: [{ ok: true }] })
        ),
      })
    await updateReadme(directory, true)
    const output = readFileSync(join(directory, 'README.md'), 'utf8')
    assert.match(output, /\[CI run\]/)
    assert.match(output, /100%/)
    assert.match(output, /1,234/)
    browser.suites[0].specs[0].tests.pop()
    writeJson(join(directory, 'test/.results/playwright.json'), browser)
    await assert.rejects(updateReadme(directory, true), /Missing browser/)
    assert.equal(readFileSync(join(directory, 'README.md'), 'utf8'), output)
    browser.suites[0].specs[0].tests.push({
      projectName: projects.at(-1),
      status: 'expected',
      results: [],
    })
    writeJson(join(directory, 'test/.results/playwright.json'), browser)
    writeJson(join(directory, 'benchmark/.results/base45.json'), {
      ...run,
      run: 'old run',
      results: [{}],
    })
    await assert.rejects(
      updateReadme(directory, true),
      /Missing current benchmark/
    )
    assert.equal(readFileSync(join(directory, 'README.md'), 'utf8'), output)
  } finally {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()))
    assert.ok(directory.startsWith(join(tmpdir(), 'bytecodec-report-')))
    rmSync(directory, { recursive: true, force: true })
  }
})
