[![npm version](https://img.shields.io/npm/v/@sovereignbase/bytecodec)](https://www.npmjs.com/package/@sovereignbase/bytecodec)
[![JSR version](https://jsr.io/badges/@sovereignbase/bytecodec)](https://jsr.io/@sovereignbase/bytecodec)
[![CI](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/bytecodec/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/bytecodec/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/bytecodec)
[![license](https://img.shields.io/npm/l/@sovereignbase/bytecodec)](LICENSE)

# bytecodec

Runtime-agnostic TypeScript byte codecs for Base45, Base64, UTF-8, gzip, HKDF derivation, secure random generation, normalization, concatenation, and comparison.

## Contents

- [Compatibility](#compatibility)
- [Bytes API](#bytes-api)
- [Base45](#base45) · [Usage](#base45-usage) · [Errors](#base45-errors) · [Benchmarks](#base45-benchmarks) · [Tests](#base45-tests)
- [Base64 and Base64URL](#base64-and-base64url) · [Usage](#base64-usage) · [Errors](#base64-errors) · [Benchmarks](#base64-benchmarks) · [Tests](#base64-tests)
- [UTF-8](#utf-8) · [Usage](#utf8-usage) · [Errors](#utf8-errors) · [Benchmarks](#utf8-benchmarks) · [Tests](#utf8-tests)
- [Gzip](#gzip) · [Usage](#gzip-usage) · [Errors](#gzip-errors) · [Benchmarks](#gzip-benchmarks) · [Tests](#gzip-tests)
- [Byte utilities](#byte-utilities) · [Usage](#util-usage) · [Errors](#util-errors) · [Benchmarks](#util-benchmarks) · [Tests](#util-tests)
- [License](#license)

## Compatibility

- Runtimes: Node.js, Bun, Deno, modern browsers, Cloudflare Workers, and edge runtimes.
- Formats: tree-shakeable ESM and CommonJS.
- TypeScript: strict bundled declarations for the root and every subpath.
- Dependencies: no runtime dependencies or bundler shims.
- Gzip: `node:zlib` in Node-like runtimes; `CompressionStream` and `DecompressionStream` elsewhere.

## Bytes API

### Declarative `Bytes` API

```ts
import { Bytes } from '@sovereignbase/bytecodec'

Bytes.base45.encode(bytes)
Bytes.base45.decode(base45String)

Bytes.base64.encode(bytes)
Bytes.base64.decode(base64String)

Bytes.base64url.encode(bytes)
Bytes.base64url.decode(base64UrlString)

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

Codec directions are consistent: `encode` converts bytes into the codec representation and `decode` converts that representation back into bytes.

The root also exports `BytecodecError` for `instanceof` checks and the `ByteSource` and `BytecodecErrorCode` types. Validation errors expose a stable `code`; unexpected wrapped failures use `UNKNOWN_ERROR` and retain the original `cause`.

## Base45

<a id="base45-usage"></a>

### Usage

```ts
import {
  bytesFromBase45String,
  bytesToBase45String,
} from '@sovereignbase/bytecodec/base45'

const encoded = bytesToBase45String(new Uint8Array([65, 66])) // "BB8"
const decoded = bytesFromBase45String(encoded)
```

Base45 follows RFC 9285 and is useful for QR-friendly payloads.

<a id="base45-errors"></a>

### Errors

Invalid text is reported as BASE45_INPUT_EXPECTED, BASE45_INVALID_LENGTH, BASE45_INVALID_CHARACTER or BASE45_INVALID_CHUNK.

<a id="base45-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:base45:benchmarks -->

2026-11-19T14:31:08.442Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz · 1,000 measured calls per case after warmup

| Operation | Input bytes | Ops/sec |
| --------- | ----------: | ------: |
| encode    |          64 | 141,237 |
| decode    |          64 | 238,317 |
| encode    |        1024 |  31,255 |
| decode    |        1024 |  67,955 |
| encode    |       16384 |   2,048 |
| decode    |       16384 |   3,433 |

<!-- END GENERATED:base45:benchmarks -->

<a id="base45-tests"></a>

### Tests

<!-- BEGIN GENERATED:base45:tests -->

2026-11-19T14:28:15.863Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

| Suite            | Passed | Failed | Skipped |
| ---------------- | -----: | -----: | ------: |
| base45 (2 files) |     35 |      0 |       0 |

| Coverage | statements | branches | functions | lines |
| -------- | ---------: | -------: | --------: | ----: |
| Percent  |       100% |     100% |      100% |  100% |

#### Compatibility

The shared compatibility suite exercises the whole public API.

| Runtime / browser      |      Version | Status | Passed | Failed |
| ---------------------- | -----------: | -----: | -----: | -----: |
| node esm               |      24.16.0 | passed |      9 |      0 |
| node cjs               |      24.16.0 | passed |      9 |      0 |
| bun esm                |       1.3.10 | passed |      9 |      0 |
| bun cjs                |       1.3.10 | passed |      9 |      0 |
| deno esm               |        2.8.3 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |            — | failed |      0 |      1 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |            — | failed |      0 |      1 |
| mobile-webkit          |         27.2 | passed |      1 |      0 |

<!-- END GENERATED:base45:tests -->

## Base64 and Base64URL

<a id="base64-usage"></a>

### Usage

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

<a id="base64-errors"></a>

### Errors

Unavailable runtime APIs throw BASE64_ENCODER_UNAVAILABLE or BASE64_DECODER_UNAVAILABLE. Base64URL length modulo four must not equal one (BASE64URL_INVALID_LENGTH). Other parsing behavior follows the runtime Base64 decoder.

<a id="base64-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:base64:benchmarks -->

2026-11-19T14:31:09.132Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz · 1,000 measured calls per case after warmup

| Operation        | Input bytes | Ops/sec |
| ---------------- | ----------: | ------: |
| base64 encode    |          64 | 116,532 |
| base64 decode    |          64 | 297,628 |
| base64url encode |          64 | 281,698 |
| base64url decode |          64 | 496,376 |
| base64 encode    |        1024 | 209,258 |
| base64 decode    |        1024 | 160,377 |
| base64url encode |        1024 |  82,570 |
| base64url decode |        1024 |  96,676 |
| base64 encode    |       16384 |  18,179 |
| base64 decode    |       16384 |  20,135 |
| base64url encode |       16384 |   8,358 |
| base64url decode |       16384 |  13,444 |

<!-- END GENERATED:base64:benchmarks -->

<a id="base64-tests"></a>

### Tests

<!-- BEGIN GENERATED:base64:tests -->

2026-11-19T14:28:15.863Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

| Suite            | Passed | Failed | Skipped |
| ---------------- | -----: | -----: | ------: |
| base64 (2 files) |     34 |      0 |       0 |

| Coverage | statements | branches | functions | lines |
| -------- | ---------: | -------: | --------: | ----: |
| Percent  |       100% |     100% |      100% |  100% |

#### Compatibility

The shared compatibility suite exercises the whole public API.

| Runtime / browser      |      Version | Status | Passed | Failed |
| ---------------------- | -----------: | -----: | -----: | -----: |
| node esm               |      24.16.0 | passed |      9 |      0 |
| node cjs               |      24.16.0 | passed |      9 |      0 |
| bun esm                |       1.3.10 | passed |      9 |      0 |
| bun cjs                |       1.3.10 | passed |      9 |      0 |
| deno esm               |        2.8.3 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |            — | failed |      0 |      1 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |            — | failed |      0 |      1 |
| mobile-webkit          |         27.2 | passed |      1 |      0 |

<!-- END GENERATED:base64:tests -->

## UTF-8

<a id="utf8-usage"></a>

### Usage

```ts
import {
  bytesFromUTF8String,
  bytesToUTF8String,
} from '@sovereignbase/bytecodec/utf8'

const bytes = bytesFromUTF8String('café ✓ 🚀')
const text = bytesToUTF8String(bytes)
```

<a id="utf8-errors"></a>

### Errors

Non-string text input throws STRING_INPUT_EXPECTED. Missing codecs throw UTF8_ENCODER_UNAVAILABLE or UTF8_DECODER_UNAVAILABLE.

<a id="utf8-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:utf8:benchmarks -->

2026-11-19T14:31:09.535Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz · 1,000 measured calls per case after warmup

| Operation               | Input bytes | Ops/sec |
| ----------------------- | ----------: | ------: |
| encode (bytes → string) |          64 | 336,383 |
| decode (string → bytes) |          64 | 429,627 |
| encode (bytes → string) |        1024 | 164,864 |
| decode (string → bytes) |        1024 | 138,968 |
| encode (bytes → string) |       16384 |  32,916 |
| decode (string → bytes) |       16384 |   9,672 |

<!-- END GENERATED:utf8:benchmarks -->

<a id="utf8-tests"></a>

### Tests

<!-- BEGIN GENERATED:utf8:tests -->

2026-11-19T14:28:15.863Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

| Suite          | Passed | Failed | Skipped |
| -------------- | -----: | -----: | ------: |
| utf8 (2 files) |     32 |      0 |       0 |

| Coverage | statements | branches | functions | lines |
| -------- | ---------: | -------: | --------: | ----: |
| Percent  |       100% |     100% |      100% |  100% |

#### Compatibility

The shared compatibility suite exercises the whole public API.

| Runtime / browser      |      Version | Status | Passed | Failed |
| ---------------------- | -----------: | -----: | -----: | -----: |
| node esm               |      24.16.0 | passed |      9 |      0 |
| node cjs               |      24.16.0 | passed |      9 |      0 |
| bun esm                |       1.3.10 | passed |      9 |      0 |
| bun cjs                |       1.3.10 | passed |      9 |      0 |
| deno esm               |        2.8.3 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |            — | failed |      0 |      1 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |            — | failed |      0 |      1 |
| mobile-webkit          |         27.2 | passed |      1 |      0 |

<!-- END GENERATED:utf8:tests -->

## Gzip

<a id="gzip-usage"></a>

### Usage

```ts
import {
  bytesFromGzipBytes,
  bytesToGzipBytes,
} from '@sovereignbase/bytecodec/gzip'

const compressed = await bytesToGzipBytes(new Uint8Array([1, 2, 3]))
const restored = await bytesFromGzipBytes(compressed)
```

<a id="gzip-errors"></a>

### Errors

Missing compression APIs use GZIP_COMPRESSION_UNAVAILABLE or GZIP_DECOMPRESSION_UNAVAILABLE. Node zlib failures use UNKNOWN_ERROR with the original cause. Web stream processing errors can reject with the original runtime error.

<a id="gzip-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:gzip:benchmarks -->

2026-11-19T14:31:13.084Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz · 1,000 measured calls per case after warmup

| Operation  | Input bytes | Ops/sec |
| ---------- | ----------: | ------: |
| compress   |          64 |   2,014 |
| decompress |          64 |   2,857 |
| compress   |        1024 |   1,695 |
| decompress |        1024 |   2,857 |
| compress   |       16384 |   1,576 |
| decompress |       16384 |   2,377 |

<!-- END GENERATED:gzip:benchmarks -->

<a id="gzip-tests"></a>

### Tests

<!-- BEGIN GENERATED:gzip:tests -->

2026-11-19T14:28:15.863Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

| Suite          | Passed | Failed | Skipped |
| -------------- | -----: | -----: | ------: |
| gzip (1 files) |      5 |      0 |       0 |

| Coverage | statements | branches | functions | lines |
| -------- | ---------: | -------: | --------: | ----: |
| Percent  |       100% |     100% |      100% |  100% |

#### Compatibility

The shared compatibility suite exercises the whole public API.

| Runtime / browser      |      Version | Status | Passed | Failed |
| ---------------------- | -----------: | -----: | -----: | -----: |
| node esm               |      24.16.0 | passed |      9 |      0 |
| node cjs               |      24.16.0 | passed |      9 |      0 |
| bun esm                |       1.3.10 | passed |      9 |      0 |
| bun cjs                |       1.3.10 | passed |      9 |      0 |
| deno esm               |        2.8.3 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |            — | failed |      0 |      1 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |            — | failed |      0 |      1 |
| mobile-webkit          |         27.2 | passed |      1 |      0 |

<!-- END GENERATED:gzip:tests -->

## Byte utilities

<a id="util-usage"></a>

### Usage

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

`normalizeBytes()` always returns an independent `Uint8Array<ArrayBuffer>` copy, including for shared buffers and offset views. All byte-returning APIs explicitly return `Uint8Array<ArrayBuffer>` (or a promise of it). `concatBytes()` also normalizes every input before joining it.

<a id="util-errors"></a>

### Errors

Invalid sources use BYTE_SOURCE_EXPECTED. Invalid concatenation uses CONCAT_INVALID_INPUT or CONCAT_NORMALIZE_FAILED with the input index. Web Crypto failures use UNKNOWN_ERROR with the original cause. Random generation is limited to 65,536 bytes per call by Web Crypto.

<a id="util-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:util:benchmarks -->

2026-11-19T14:31:15.360Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz · 1,000 measured calls per case after warmup

| Operation        | Input bytes | Ops/sec |
| ---------------- | ----------: | ------: |
| normalize view   |          64 | 896,539 |
| concat three     |          64 | 180,333 |
| equals same      |          64 | 402,495 |
| equals different |          64 | 378,530 |
| generate         |          64 |  90,700 |
| derive 32 bytes  |          64 |   3,494 |
| normalize view   |        1024 | 290,630 |
| concat three     |        1024 |  59,787 |
| equals same      |        1024 | 155,960 |
| equals different |        1024 | 134,553 |
| generate         |        1024 | 113,249 |
| derive 32 bytes  |        1024 |   3,021 |
| normalize view   |       16384 |  20,386 |
| concat three     |       16384 |   3,275 |
| equals same      |       16384 |   9,604 |
| equals different |       16384 |   8,352 |
| generate         |       16384 |  23,555 |
| derive 32 bytes  |       16384 |   2,326 |

<!-- END GENERATED:util:benchmarks -->

<a id="util-tests"></a>

### Tests

<!-- BEGIN GENERATED:util:tests -->

2026-11-19T14:28:15.863Z · local run · commit `cca7177`

Node v24.16.0 · win32 x64

| Suite          | Passed | Failed | Skipped |
| -------------- | -----: | -----: | ------: |
| util (3 files) |     68 |      0 |       0 |

| Coverage | statements | branches | functions | lines |
| -------- | ---------: | -------: | --------: | ----: |
| Percent  |       100% |     100% |      100% |  100% |

#### Compatibility

The shared compatibility suite exercises the whole public API.

| Runtime / browser      |      Version | Status | Passed | Failed |
| ---------------------- | -----------: | -----: | -----: | -----: |
| node esm               |      24.16.0 | passed |      9 |      0 |
| node cjs               |      24.16.0 | passed |      9 |      0 |
| bun esm                |       1.3.10 | passed |      9 |      0 |
| bun cjs                |       1.3.10 | passed |      9 |      0 |
| deno esm               |        2.8.3 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |            — | failed |      0 |      1 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |            — | failed |      0 |      1 |
| mobile-webkit          |         27.2 | passed |      1 |      0 |

<!-- END GENERATED:util:tests -->

## License

Licensed under the Apache License, Version 2.0.

Copyright © 2026 Sovereignbase.
