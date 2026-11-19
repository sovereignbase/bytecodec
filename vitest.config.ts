import { defineConfig } from 'vitest/config'

/** Runs the unit and integration suites with strict V8 coverage thresholds. */
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    reporters: ['default', 'json'],
    outputFile: { json: 'test/.results/vitest.json' },
    environment: 'node',
    fileParallelism: false,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'lcov', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
})
