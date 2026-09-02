import { defineConfig } from 'vitest/config'

/** Runs the unit and integration suites with strict V8 coverage thresholds. */
export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.js', 'test/integration/**/*.test.js'],
    environment: 'node',
    fileParallelism: false,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['dist/**/*.js'],
      exclude: ['dist/**/*.d.ts'],
      reporter: ['text', 'lcov'],
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
