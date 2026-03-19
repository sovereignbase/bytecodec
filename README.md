[![npm version](https://img.shields.io/npm/v/@sovereignbase/bytecodec)](https://www.npmjs.com/package/@sovereignbase/bytecodec)
[![CI](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/bytecodec/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/bytecodec)
[![license](https://img.shields.io/npm/l/@sovereignbase/bytecodec)](LICENSE)

# bytecodec

Typed JavaScript and TypeScript byte utilities for base64, base64url, UTF-8 strings, JSON, gzip, concatenation, comparison, and byte-source normalization. The package ships tree-shakeable ESM plus CommonJS entry points and keeps the same API across Node, Bun, Deno, browsers, and edge runtimes.

## Compatibility

- Runtimes: Node, Bun, Deno, browsers, and edge runtimes.
- Module formats: ESM by default, with CommonJS exports for `require()` consumers in Node and Bun.
- Node and Bun runtime behavior: uses `Buffer` for base64 helpers and `node:zlib` for gzip.
- Browser and edge gzip support requires `CompressionStream` and `DecompressionStream`.
- TypeScript: bundled types.

## Goals

- Developer-friendly API for base64, base64url, UTF-8, JSON, gzip, concat, equality, and byte normalization.
- No runtime dependencies or bundler shims.
- Tree-shakeable ESM by default with CommonJS compatibility and no side effects.
- Returns copies for safety when normalizing inputs.
- Consistent behavior across Node, browsers, and edge runtimes.

## Installation

```sh
npm install @sovereignbase/bytecodec
# or
pnpm add @sovereignbase/bytecodec
# or
yarn add @sovereignbase/bytecodec
# or
bun add @sovereignbase/bytecodec
# or
deno add jsr:@sovereignbase/bytecodec
# or
vlt install jsr:@sovereignbase/bytecodec
```

## Usage

### Bytes wrapper

```js
import { Bytes } from '@sovereignbase/bytecodec'

// The `Bytes` convenience class wraps the same functions as static methods.
const encoded = Bytes.toBase64String(new Uint8Array([1, 2, 3])) // base64 string
```

### Base64

```js
import { toBase64String, fromBase64String } from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([104, 101, 108, 108, 111])
const encoded = toBase64String(bytes) // string of base64 chars
const decoded = fromBase64String(encoded) // Uint8Array
```

### CommonJS

```js
const { toBase64String, fromBase64String } = require('@sovereignbase/bytecodec')

const encoded = toBase64String([104, 101, 108, 108, 111]) // string of base64 chars
const decoded = fromBase64String(encoded) // Uint8Array
```

### Base64URL

```js
import {
  toBase64UrlString,
  fromBase64UrlString,
} from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([104, 101, 108, 108, 111])
const encoded = toBase64UrlString(bytes) // string of base64url chars
const decoded = fromBase64UrlString(encoded) // Uint8Array
```

### UTF-8 strings

```js
import { fromString, toString } from '@sovereignbase/bytecodec'

const textBytes = fromString('caffe and rockets') // Uint8Array
const text = toString(textBytes) // "caffe and rockets"
```

### JSON

```js
import { fromJSON, toJSON } from '@sovereignbase/bytecodec'

const jsonBytes = fromJSON({ ok: true, count: 3 }) // Uint8Array
const obj = toJSON(jsonBytes) // { ok: true, count: 3 }
```

### Compression

```js
import { toCompressed, fromCompressed } from '@sovereignbase/bytecodec'

const compressed = await toCompressed(new Uint8Array([1, 2, 3])) // Uint8Array
const restored = await fromCompressed(compressed) // Uint8Array
```

### Normalization

```js
import {
  toUint8Array,
  toArrayBuffer,
  toBufferSource,
} from '@sovereignbase/bytecodec'

const normalized = toUint8Array([1, 2, 3]) // Uint8Array
const copied = toArrayBuffer(normalized) // ArrayBuffer
const bufferSource = toBufferSource(normalized) // Uint8Array as BufferSource
```

Accepted byte inputs (`ByteSource`) are:

- `Uint8Array`
- `ArrayBuffer`
- `ArrayBufferView`
- `number[]`

### Equality

```js
import { equals } from '@sovereignbase/bytecodec'

const isSame = equals(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])) // true | false
```

### Concatenating

```js
import { concat } from '@sovereignbase/bytecodec'

const joined = concat([new Uint8Array([1, 2]), new Uint8Array([3, 4]), [5, 6]]) // Uint8Array
```

## Runtime behavior

### Node

Uses `Buffer.from` for base64 helpers, `TextEncoder` and `TextDecoder` when available with `Buffer` fallback for UTF-8, and `node:zlib` for gzip.

### Bun

Uses the same API shape as Node. ESM and CommonJS entry points are both exported.

### Browsers / Edge runtimes

Uses `TextEncoder`, `TextDecoder`, `btoa`, and `atob`. Gzip uses `CompressionStream` and `DecompressionStream` when available.

### Validation & errors

Validation failures throw `BytecodecError` instances with a `code` string, for example `BASE64URL_INVALID_LENGTH`, `BASE64_DECODER_UNAVAILABLE`, `UTF8_DECODER_UNAVAILABLE`, and `GZIP_COMPRESSION_UNAVAILABLE`. Messages are prefixed with `{@sovereignbase/bytecodec}`.

### Safety / copying semantics

`toUint8Array`, `toArrayBuffer`, and `toBufferSource` always return copies. `concat` normalizes each input to a fresh `Uint8Array` before joining.

## Tests

`npm test` covers:

- 53 unit tests
- 4 integration tests
- Node E2E: ESM and CommonJS
- Bun E2E: ESM and CommonJS
- Deno E2E: ESM
- Edge Runtime E2E: ESM
- Browser E2E: Chromium, Firefox, WebKit, mobile-chrome, and mobile-safari
- Coverage gate: 100% statements, branches, functions, and lines

## Benchmarks

Latest local `npm run bench` run on 2026-03-19 with Node `v22.14.0 (win32 x64)`:

| Benchmark        | Result                    |
| ---------------- | ------------------------- |
| base64 encode    | 1,717,210 ops/s (29.1 ms) |
| base64 decode    | 2,326,783 ops/s (21.5 ms) |
| base64url encode | 768,469 ops/s (65.1 ms)   |
| base64url decode | 1,173,307 ops/s (42.6 ms) |
| utf8 encode      | 1,479,264 ops/s (33.8 ms) |
| utf8 decode      | 4,109,139 ops/s (12.2 ms) |
| json encode      | 353,666 ops/s (56.6 ms)   |
| json decode      | 513,064 ops/s (39.0 ms)   |
| concat 3 buffers | 664,735 ops/s (75.2 ms)   |
| toUint8Array     | 4,721,669 ops/s (42.4 ms) |
| toArrayBuffer    | 751,732 ops/s (266.1 ms)  |
| toBufferSource   | 8,952,992 ops/s (22.3 ms) |
| equals same      | 3,766,379 ops/s (53.1 ms) |
| equals diff      | 4,285,463 ops/s (46.7 ms) |
| gzip compress    | 3,118 ops/s (128.3 ms)    |
| gzip decompress  | 5,070 ops/s (78.9 ms)     |

Command: `npm run bench`

Results vary by machine and Node version.

## License

Apache-2.0
