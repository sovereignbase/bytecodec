import { defineConfig } from 'tsdown'

/** Apache-2.0 notice prepended to every emitted JavaScript bundle. */
const apache2Banner = [
  '/*',
  ` * Copyright ${new Date().getUTCFullYear()} Sovereignbase`,
  ' *',
  ' * Licensed under the Apache License, Version 2.0 (the "License");',
  ' * you may not use this file except in compliance with the License.',
  ' * You may obtain a copy of the License at',
  ' *',
  ' *     http://www.apache.org/licenses/LICENSE-2.0',
  ' *',
  ' * Unless required by applicable law or agreed to in writing, software',
  ' * distributed under the License is distributed on an "AS IS" BASIS,',
  ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
  ' * See the License for the specific language governing permissions and',
  ' * limitations under the License.',
  ' */',
].join('\n')

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'base45/index': 'src/base45/index.ts',
    'base64/index': 'src/base64/index.ts',
    'gzip/index': 'src/gzip/index.ts',
    'utf8/index': 'src/utf8/index.ts',
    'util/index': 'src/util/index.ts',
  },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'neutral',
  target: 'es2024',
  dts: true,
  sourcemap: true,
  clean: true,
  banner: {
    js: `${apache2Banner}\n`,
  },
  outExtensions({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
})
