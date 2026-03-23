[![npm version](https://img.shields.io/npm/v/@sovereignbase/bytecodec)](https://www.npmjs.com/package/@sovereignbase/bytecodec)
[![CI](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/bytecodec/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/bytecodec)
[![license](https://img.shields.io/npm/l/@sovereignbase/bytecodec)](LICENSE)

# bytecodec

Typed JavaScript and TypeScript byte utilities for base64, base64url, hex, Z85, UTF-8 strings, JSON, gzip, concatenation, comparison, and byte-source normalization. The package ships tree-shakeable ESM plus CommonJS entry points and keeps the same API across Node, Bun, Deno, browsers, and edge runtimes.

## Compatibility

- Runtimes: Node, Bun, Deno, browsers, and edge runtimes.
- Module formats: ESM by default, with CommonJS exports for `require()` consumers in Node and Bun.
- Node and Bun runtime behavior: uses `Buffer` for base64 helpers and `node:zlib` for gzip.
- Browser and edge gzip support requires `CompressionStream` and `DecompressionStream`.
- TypeScript: bundled types.

## Goals

- Developer-friendly API for base64, base64url, hex, Z85, UTF-8, JSON, gzip, concat, equality, and byte normalization.
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

### Hex

```js
import { toHex, fromHex } from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([222, 173, 190, 239])
const encoded = toHex(bytes) // "deadbeef"
const decoded = fromHex(encoded) // Uint8Array
```

### Z85

```js
import { toZ85String, fromZ85String } from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b])
const encoded = toZ85String(bytes) // "HelloWorld"
const decoded = fromZ85String(encoded) // Uint8Array
```

Z85 encodes 4 input bytes into 5 output characters, so `toZ85String()` requires a byte length divisible by 4 and `fromZ85String()` requires a string length divisible by 5.

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

Validation failures throw `BytecodecError` instances with a `code` string, for example `BASE64URL_INVALID_LENGTH`, `HEX_INVALID_CHARACTER`, `Z85_INVALID_BLOCK`, `BASE64_DECODER_UNAVAILABLE`, `UTF8_DECODER_UNAVAILABLE`, and `GZIP_COMPRESSION_UNAVAILABLE`. Messages are prefixed with `{@sovereignbase/bytecodec}`.

### Safety / copying semantics

`toUint8Array`, `toArrayBuffer`, and `toBufferSource` always return copies. `concat` normalizes each input to a fresh `Uint8Array` before joining.

## Tests

`npm test` covers:

- 68 unit tests
- 6 integration tests
- Node E2E: ESM and CommonJS
- Bun E2E: ESM and CommonJS
- Deno E2E: ESM
- Edge Runtime E2E: ESM
- Browser E2E: Chromium, Firefox, WebKit, mobile-chrome, and mobile-safari
- Coverage gate: 100% statements, branches, functions, and lines

## Benchmarks

Latest local `npm run bench` run on 2026-03-23 with Node `v22.14.0 (win32 x64)`:

| Benchmark        | Result                    |
| ---------------- | ------------------------- |
| base64 encode    | 1,391,126 ops/s (35.9 ms) |
| base64 decode    | 2,089,279 ops/s (23.9 ms) |
| base64url encode | 697,088 ops/s (71.7 ms)   |
| base64url decode | 1,095,554 ops/s (45.6 ms) |
| hex encode       | 1,053,832 ops/s (47.4 ms) |
| hex decode       | 1,027,413 ops/s (48.7 ms) |
| z85 encode       | 244,928 ops/s (204.1 ms)  |
| z85 decode       | 1,596,730 ops/s (31.3 ms) |
| utf8 encode      | 1,537,199 ops/s (32.5 ms) |
| utf8 decode      | 3,481,143 ops/s (14.4 ms) |
| json encode      | 681,747 ops/s (29.3 ms)   |
| json decode      | 989,746 ops/s (20.2 ms)   |
| concat 3 buffers | 846,612 ops/s (59.1 ms)   |
| toUint8Array     | 9,396,818 ops/s (21.3 ms) |
| toArrayBuffer    | 884,096 ops/s (226.2 ms)  |
| toBufferSource   | 9,279,881 ops/s (21.6 ms) |
| equals same      | 3,932,572 ops/s (50.9 ms) |
| equals diff      | 4,060,534 ops/s (49.3 ms) |
| gzip compress    | 4,126 ops/s (96.9 ms)     |
| gzip decompress  | 5,550 ops/s (72.1 ms)     |

Command: `npm run bench`

Results vary by machine and Node version.

## License

Apache-2.0
