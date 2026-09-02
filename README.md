[![npm version](https://img.shields.io/npm/v/@sovereignbase/bytecodec)](https://www.npmjs.com/package/@sovereignbase/bytecodec)
[![JSR version](https://jsr.io/badges/@sovereignbase/bytecodec)](https://jsr.io/@sovereignbase/bytecodec)
[![CI](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/bytecodec/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/bytecodec)
[![license](https://img.shields.io/npm/l/@sovereignbase/bytecodec)](LICENSE)

# bytecodec

Runtime-agnostic TypeScript byte codecs for Base45, Base64, UTF-8, gzip, HKDF derivation, secure random generation, normalization, concatenation, and comparison.

The root entrypoint provides the declarative `Bytes` API. Focused subpath exports let applications import only the codec or utilities they need.

## Compatibility

- Runtimes: Node.js, Bun, Deno, modern browsers, Cloudflare Workers, and edge runtimes.
- Formats: tree-shakeable ESM and CommonJS.
- TypeScript: strict bundled declarations for the root and every subpath.
- Dependencies: no runtime dependencies or bundler shims.
- Gzip: `node:zlib` in Node-like runtimes; `CompressionStream` and `DecompressionStream` elsewhere.

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

## Entry points

| Import                                  | Exports                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `@sovereignbase/bytecodec`              | `Bytes`, `ByteSource`, `BytecodecErrorCode`                                   |
| `@sovereignbase/bytecodec/base45`       | `bytesToBase45String`, `bytesFromBase45String`                                |
| `@sovereignbase/bytecodec/base64`       | Base64 and unpadded Base64URL encode/decode functions                         |
| `@sovereignbase/bytecodec/utf8`         | `bytesToUTF8String`, `bytesFromUTF8String`                                    |
| `@sovereignbase/bytecodec/gzip`         | `bytesToGzipBytes`, `bytesFromGzipBytes`                                      |
| `@sovereignbase/bytecodec/util`         | `normalizeBytes`, `concatBytes`, `equalBytes`, `deriveBytes`, `generateBytes` |
| `@sovereignbase/bytecodec/package.json` | Package metadata                                                              |

Type-only exports in the table do not add runtime exports. The root runtime surface intentionally contains only `Bytes`.

## Usage

### Declarative `Bytes` API

```ts
import { Bytes } from '@sovereignbase/bytecodec'

const bytes = Bytes.utf8.decode('hello ✓')
const encoded = Bytes.base64.url.encode(bytes)
const decoded = Bytes.base64.url.decode(encoded)
const text = Bytes.utf8.encode(decoded)
```

Codec directions are consistent: `encode` converts bytes into the codec representation and `decode` converts that representation back into bytes. For UTF-8, the representation is a JavaScript string; for gzip, both sides are bytes.

The complete wrapper surface is:

```ts
Bytes.base45.encode(bytes)
Bytes.base45.decode(base45String)

Bytes.base64.encode(bytes)
Bytes.base64.decode(base64String)
Bytes.base64.url.encode(bytes)
Bytes.base64.url.decode(base64UrlString)

Bytes.utf8.encode(bytes)
Bytes.utf8.decode(text)

await Bytes.gzip.encode(bytes)
await Bytes.gzip.decode(compressedBytes)

Bytes.normalize(bytes)
Bytes.concat([first, second])
Bytes.equals(first, second)
await Bytes.derive(base, domain, byteLength)
Bytes.generate(byteLength)
```

### Focused imports

Focused entrypoints avoid loading the root wrapper and unrelated codecs.

```ts
import {
  bytesFromUTF8String,
  bytesToUTF8String,
} from '@sovereignbase/bytecodec/utf8'
import {
  bytesFromBase64UrlString,
  bytesToBase64UrlString,
} from '@sovereignbase/bytecodec/base64'

const bytes = bytesFromUTF8String('split import')
const encoded = bytesToBase64UrlString(bytes)
const restored = bytesToUTF8String(bytesFromBase64UrlString(encoded))
```

### Base45

```ts
import {
  bytesFromBase45String,
  bytesToBase45String,
} from '@sovereignbase/bytecodec/base45'

const encoded = bytesToBase45String(new Uint8Array([65, 66])) // "BB8"
const decoded = bytesFromBase45String(encoded)
```

Base45 follows RFC 9285 and is useful for QR-friendly payloads.

### Base64 and Base64URL

```ts
import {
  bytesFromBase64String,
  bytesFromBase64UrlString,
  bytesToBase64String,
  bytesToBase64UrlString,
} from '@sovereignbase/bytecodec/base64'

const bytes = new Uint8Array([104, 101, 108, 108, 111])
bytesToBase64String(bytes) // "aGVsbG8="
bytesToBase64UrlString(bytes) // "aGVsbG8" (unpadded)
bytesFromBase64String('aGVsbG8=')
bytesFromBase64UrlString('aGVsbG8')
```

### UTF-8

```ts
import {
  bytesFromUTF8String,
  bytesToUTF8String,
} from '@sovereignbase/bytecodec/utf8'

const bytes = bytesFromUTF8String('café ✓ 🚀')
const text = bytesToUTF8String(bytes)
```

### Gzip

```ts
import {
  bytesFromGzipBytes,
  bytesToGzipBytes,
} from '@sovereignbase/bytecodec/gzip'

const compressed = await bytesToGzipBytes(new Uint8Array([1, 2, 3]))
const restored = await bytesFromGzipBytes(compressed)
```

### Byte utilities

```ts
import {
  concatBytes,
  deriveBytes,
  equalBytes,
  generateBytes,
  normalizeBytes,
} from '@sovereignbase/bytecodec/util'

const normalized = normalizeBytes(new DataView(new Uint8Array([1, 2]).buffer))
const joined = concatBytes([normalized, [3, 4]])
const equal = equalBytes(joined, new Uint8Array([1, 2, 3, 4]))
const derived = await deriveBytes(joined, new Uint8Array([5]), 32)
const random = generateBytes(32)
```

`deriveBytes()` uses HKDF-SHA-256 and treats `base` as the salt and `domain` as the context information. The same inputs and byte length produce the same result. Use a distinct domain for every purpose.

All functions accepting `ByteSource` support:

- `ArrayBuffer`
- `SharedArrayBuffer`
- any `ArrayBufferView`, including `Uint8Array` and `DataView`
- `number[]`

`normalizeBytes()` always returns an independent `Uint8Array` copy. `concatBytes()` also normalizes every input before joining it.

### CommonJS

Every npm entrypoint has a matching CommonJS export.

```js
const { Bytes } = require('@sovereignbase/bytecodec')
const { bytesFromUTF8String } = require('@sovereignbase/bytecodec/utf8')
```

## Errors

Package validation and runtime-capability failures throw `BytecodecError` instances. Each error has:

- `name: "BytecodecError"`
- a stable `code` typed as `BytecodecErrorCode`
- a message prefixed with `{@sovereignbase/bytecodec}`

Codes cover invalid Base45/Base64URL input, unsupported byte sources, invalid concatenation, invalid UTF-8 input, unavailable Base64/UTF-8 codecs, and unavailable gzip APIs.

```ts
import type { BytecodecErrorCode } from '@sovereignbase/bytecodec'

try {
  Bytes.base45.decode('A')
} catch (error) {
  const code = (error as { code: BytecodecErrorCode }).code
  // "BASE45_INVALID_LENGTH"
}
```

## Runtime behavior

Node.js and Bun use `Buffer` for Base64 and `node:zlib` for gzip. Browsers, Cloudflare Workers, Deno, and compatible edge runtimes use standard web APIs. An edge runtime without compression streams can still use every non-gzip entrypoint; gzip calls fail with a structured availability error.

The package has no side effects. Multi-entry builds share internal chunks while allowing bundlers and runtimes to resolve only the requested public subpath.

## Tests

`npm test` runs:

- a TypeScript typecheck of source, configuration, tests, and all package entrypoints;
- 27 Vitest unit/integration tests with a 100% statements, branches, functions, and lines coverage gate;
- ESM and CommonJS runtime suites in Node.js and Bun;
- ESM runtime suites in Deno, Cloudflare Workers, and Edge Runtime;
- Playwright tests in Chromium, Firefox, WebKit, mobile Chromium, mobile Firefox, and mobile WebKit.

Useful focused commands include `npm run test:vitest`, `npm run test:e2e:browsers`, and `npm run test:e2e:runtimes`.

## API documentation

Generate the TypeDoc API reference with `npm run build:docs`. The published reference is available at [sovereignbase.dev/bytecodec](https://sovereignbase.dev/bytecodec).

## Benchmarks

`npm run bench` builds the package and benchmarks every public capability. A local run on 2026-09-02 with Node.js 24.16.0 on Windows x64 produced:

| Benchmark        | Operations |   Ops/sec |
| ---------------- | ---------: | --------: |
| Base45 encode    |      5,000 |   457,641 |
| Base45 decode    |      5,000 |   667,067 |
| Base64 encode    |      5,000 |   674,372 |
| Base64 decode    |      5,000 | 1,586,546 |
| Base64URL encode |      5,000 |   724,186 |
| Base64URL decode |      5,000 |   866,912 |
| UTF-8 encode     |      5,000 | 1,349,455 |
| UTF-8 decode     |      5,000 | 1,602,102 |
| Normalize        |      5,000 | 5,221,387 |
| Concatenate      |      5,000 |   597,001 |
| Compare equal    |      5,000 | 1,495,573 |
| Compare unequal  |      5,000 | 2,264,493 |
| Generate random  |      5,000 |   297,134 |
| HKDF derive      |      5,000 |    12,060 |
| Gzip compress    |      5,000 |     6,324 |
| Gzip decompress  |      5,000 |     8,866 |

Results vary by machine, runtime, input, and system load.

## License

Apache-2.0
