[![npm version](https://img.shields.io/npm/v/@sovereignbase/bytecodec)](https://www.npmjs.com/package/@sovereignbase/bytecodec)
[![CI](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/bytecodec/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/bytecodec)
[![license](https://img.shields.io/npm/l/@sovereignbase/bytecodec)](LICENSE)

# `@sovereignbase/bytecodec`

Typed JavaScript and TypeScript byte utilities for base64url, UTF-8 strings, JSON, gzip, concatenation, comparison, and byte-source normalization. The package is ESM-only and keeps the same API across Node and browser or edge runtimes.

## Compatibility

- Runtimes: Node >= 18; browsers and edge runtimes with `TextEncoder`/`TextDecoder` plus `btoa`/`atob` for base64url helpers.
- Module format: ESM-only.
- Node runtime behavior: uses `Buffer` for base64 helpers and `node:zlib` for gzip.
- Browser and edge gzip support requires `CompressionStream` and `DecompressionStream`.
- TypeScript: bundled types.

## Goals

- Developer-friendly API for base64url, UTF-8, JSON, gzip, concat, equality, and byte normalization.
- No runtime dependencies or bundler shims.
- ESM-only and side-effect free for tree-shaking.
- Returns copies for safety when normalizing inputs.
- Consistent behavior across Node, browsers, and edge runtimes.

## Installation

```sh
npm install @sovereignbase/bytecodec
# or
pnpm add @sovereignbase/bytecodec
# or
yarn add @sovereignbase/bytecodec
```

## Usage

### Bytes wrapper

```js
import { Bytes } from '@sovereignbase/bytecodec'

const encoded = Bytes.toBase64UrlString(new Uint8Array([1, 2, 3]))
```

### Base64URL

```js
import {
  toBase64UrlString,
  fromBase64UrlString,
} from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([104, 101, 108, 108, 111])
const encoded = toBase64UrlString(bytes)
const decoded = fromBase64UrlString(encoded)
```

### UTF-8 strings

```js
import { fromString, toString } from '@sovereignbase/bytecodec'

const textBytes = fromString('caffe and rockets')
const text = toString(textBytes)
```

### JSON

```js
import { fromJSON, toJSON } from '@sovereignbase/bytecodec'

const jsonBytes = fromJSON({ ok: true, count: 3 })
const obj = toJSON(jsonBytes)
```

### Compression

```js
import { toCompressed, fromCompressed } from '@sovereignbase/bytecodec'

const compressed = await toCompressed(new Uint8Array([1, 2, 3]))
const restored = await fromCompressed(compressed)
```

### Normalization

```js
import {
  toUint8Array,
  toArrayBuffer,
  toBufferSource,
} from '@sovereignbase/bytecodec'

const normalized = toUint8Array([1, 2, 3])
const copied = toArrayBuffer(normalized)
const bufferSource = toBufferSource(normalized)
```

Accepted byte inputs (`ByteSource`) are:

- `Uint8Array`
- `ArrayBuffer`
- `ArrayBufferView`
- `number[]`

### Equality

```js
import { equals } from '@sovereignbase/bytecodec'

const isSame = equals(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))
```

### Concatenating

```js
import { concat } from '@sovereignbase/bytecodec'

const joined = concat([
  new Uint8Array([1, 2]),
  new Uint8Array([3, 4]),
  [5, 6],
])
```

## Runtime behavior

### Node

Uses `Buffer.from` for base64 helpers, `TextEncoder` and `TextDecoder` when available with `Buffer` fallback for UTF-8, and `node:zlib` for gzip.

### Browsers / Edge runtimes

Uses `TextEncoder`, `TextDecoder`, `btoa`, and `atob`. Gzip uses `CompressionStream` and `DecompressionStream` when available.

### Validation & errors

Validation failures throw `BytecodecError` instances with a `code` string, for example `BASE64URL_INVALID_LENGTH`, `UTF8_DECODER_UNAVAILABLE`, and `GZIP_COMPRESSION_UNAVAILABLE`. Messages are prefixed with `{@sovereignbase/bytecodec}`.

### Safety / copying semantics

`toUint8Array`, `toArrayBuffer`, and `toBufferSource` always return copies. `concat` normalizes each input to a fresh `Uint8Array` before joining.

## Tests

Run the full suite with:

```sh
npm test
```

The suite covers unit and integration tests in Node plus Playwright browser E2E coverage.

## Benchmarks

Run the benchmark script with:

```sh
npm run bench
```

Current benchmark targets:

- base64url encode and decode
- UTF-8 encode and decode
- JSON encode and decode
- concatenation
- `toUint8Array`, `toArrayBuffer`, and `toBufferSource`
- `equals` with equal and different payloads
- gzip compress and decompress

Benchmark results vary by machine and Node version, so the benchmark script is the source of truth instead of a hardcoded results table.

## License

Apache-2.0
