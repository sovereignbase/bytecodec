[![npm version](https://img.shields.io/npm/v/@sovereignbase/bytecodec)](https://www.npmjs.com/package/@sovereignbase/bytecodec)
[![CI](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/bytecodec/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/bytecodec)
[![license](https://img.shields.io/npm/l/@sovereignbase/bytecodec)](LICENSE)

# bytecodec

Typed JavaScript and TypeScript byte utilities for base58, base58btc, base64, base64url, hex, Z85, UTF-8 strings, unsigned BigInt conversion, JSON, gzip, concatenation, comparison, and byte-source normalization. The package ships tree-shakeable ESM plus CommonJS entry points and keeps the same API across Node, Bun, Deno, browsers, and edge runtimes.

## Compatibility

- Runtimes: Node, Bun, Deno, browsers, Cloudflare Workers, and edge runtimes.
- Module formats: ESM by default, with CommonJS exports for `require()` consumers in Node and Bun.
- Node and Bun runtime behavior: uses `Buffer` for base64 helpers and `node:zlib` for gzip.
- Browser and edge gzip support requires `CompressionStream` and `DecompressionStream`.
- TypeScript: bundled types.

## Goals

- Developer-friendly API for base58, base58btc, base64, base64url, hex, Z85, UTF-8, unsigned BigInt conversion, JSON, gzip, concat, equality, and byte normalization.
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

### Base58

```js
import { toBase58String, fromBase58String } from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([104, 101, 108, 108, 111])
const encoded = toBase58String(bytes) // "Cn8eVZg"
const decoded = fromBase58String(encoded) // Uint8Array
```

### Base58btc

```js
import { toBase58BtcString, fromBase58BtcString } from '@sovereignbase/bytecodec'

const bytes = new Uint8Array([104, 101, 108, 108, 111])
const encoded = toBase58BtcString(bytes) // "zCn8eVZg"
const decoded = fromBase58BtcString(encoded) // Uint8Array
```

`base58btc` uses the Bitcoin base58 alphabet and adds the multibase `z` prefix.

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

### BigInt

```js
import { fromBigInt, toBigInt } from '@sovereignbase/bytecodec'

const bytes = fromBigInt(0x1234n) // Uint8Array([0x12, 0x34])
const value = toBigInt(bytes) // 0x1234n
```

BigInt helpers use unsigned big-endian encoding. `fromBigInt(0n)` returns an empty `Uint8Array`, because no byte width is implied.
Leading zero bytes are not preserved, so the helpers model integers rather than fixed-width binary fields.

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

- `ArrayBuffer`
- `SharedArrayBuffer`
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

Uses pure JavaScript for base58/base58btc, `Buffer.from` for base64 helpers, `TextEncoder` and `TextDecoder` when available with `Buffer` fallback for UTF-8, and `node:zlib` for gzip.

### Bun

Uses the same API shape as Node. ESM and CommonJS entry points are both exported.

### Browsers / Edge runtimes

Uses `TextEncoder`, `TextDecoder`, `btoa`, and `atob`. Gzip uses `CompressionStream` and `DecompressionStream` when available.

### Validation & errors

Validation failures throw `BytecodecError` instances with a `code` string, for example `BASE58_INVALID_CHARACTER`, `BASE58BTC_INVALID_PREFIX`, `BASE64URL_INVALID_LENGTH`, `BIGINT_UNSIGNED_EXPECTED`, `HEX_INVALID_CHARACTER`, `Z85_INVALID_BLOCK`, `BASE64_DECODER_UNAVAILABLE`, `UTF8_DECODER_UNAVAILABLE`, and `GZIP_COMPRESSION_UNAVAILABLE`. Messages are prefixed with `{@sovereignbase/bytecodec}`.

### Safety / copying semantics

`toUint8Array`, `toArrayBuffer`, and `toBufferSource` always return copies. `concat` normalizes each input to a fresh `Uint8Array` before joining.

## Tests

`npm test` covers:

- 85 unit tests
- 9 integration tests
- Node E2E: 27/27 passed in ESM and 27/27 passed in CommonJS
- Bun E2E: 27/27 passed in ESM and 27/27 passed in CommonJS
- Deno E2E: 27/27 passed in ESM
- Cloudflare Workers E2E: 27/27 passed in ESM
- Edge Runtime E2E: 27/27 passed in ESM
- Browser E2E: 5/5 passed in Chromium, Firefox, WebKit, mobile-chrome, and mobile-safari
- Coverage gate: 100% statements, branches, functions, and lines

## Benchmarks

Latest local `npm run bench` run on 2026-04-17 with Node `v22.14.0 (win32 x64)`. Each benchmark uses the same `5,000` operations:

| Benchmark        | Ops   | Ms       | Ms/Op    | Ops/Sec   |
| ---------------- | ----- | -------- | -------- | --------- |
| base58 encode    | 5,000 | 378.548  | 0.075710 | 13,208    |
| base58 decode    | 5,000 | 64.313   | 0.012863 | 77,745    |
| base58btc encode | 5,000 | 318.044  | 0.063609 | 15,721    |
| base58btc decode | 5,000 | 56.138   | 0.011228 | 89,066    |
| base64 encode    | 5,000 | 16.971   | 0.003394 | 294,629   |
| base64 decode    | 5,000 | 13.244   | 0.002649 | 377,541   |
| base64url encode | 5,000 | 23.162   | 0.004632 | 215,867   |
| base64url decode | 5,000 | 22.993   | 0.004599 | 217,454   |
| hex encode       | 5,000 | 18.494   | 0.003699 | 270,361   |
| hex decode       | 5,000 | 10.099   | 0.002020 | 495,084   |
| z85 encode       | 5,000 | 65.417   | 0.013083 | 76,433    |
| z85 decode       | 5,000 | 11.928   | 0.002386 | 419,171   |
| utf8 encode      | 5,000 | 9.949    | 0.001990 | 502,583   |
| utf8 decode      | 5,000 | 4.835    | 0.000967 | 1,034,105 |
| bigint encode    | 5,000 | 17.098   | 0.003420 | 292,435   |
| bigint decode    | 5,000 | 21.104   | 0.004221 | 236,922   |
| json encode      | 5,000 | 10.640   | 0.002128 | 469,912   |
| json decode      | 5,000 | 11.192   | 0.002238 | 446,740   |
| concat 3 buffers | 5,000 | 28.862   | 0.005772 | 173,240   |
| toUint8Array     | 5,000 | 4.866    | 0.000973 | 1,027,475 |
| toArrayBuffer    | 5,000 | 13.325   | 0.002665 | 375,229   |
| toBufferSource   | 5,000 | 3.412    | 0.000682 | 1,465,373 |
| equals same      | 5,000 | 9.302    | 0.001860 | 537,536   |
| equals diff      | 5,000 | 5.908    | 0.001182 | 846,267   |
| gzip compress    | 5,000 | 1370.000 | 0.274000 | 3,650     |
| gzip decompress  | 5,000 | 1493.242 | 0.298648 | 3,348     |

Results vary by machine and Node version.

## License

Apache-2.0
