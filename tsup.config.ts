import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'neutral',
  target: 'es2024',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  external: ['node:*'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
})
