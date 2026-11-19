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

Invalid text throws BASE45_INPUT_EXPECTED, BASE45_INVALID_LENGTH, BASE45_INVALID_CHARACTER or BASE45_INVALID_CHUNK.

<a id="base45-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:base45:benchmarks -->

2026-11-19T14:58:40.016Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

AMD EPYC 9V74 80-Core Processor · 1,000 measured calls per case after warmup

| Operation | Input bytes | Ops/sec |
| --------- | ----------: | ------: |
| encode    |          64 | 394,024 |
| decode    |          64 | 754,451 |
| encode    |        1024 |  85,925 |
| decode    |        1024 | 213,873 |
| encode    |       16384 |   6,953 |
| decode    |       16384 |  12,931 |

<!-- END GENERATED:base45:benchmarks -->

<a id="base45-tests"></a>

### Tests

<!-- BEGIN GENERATED:base45:tests -->

2026-11-19T14:58:18.590Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

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
| node esm               |      24.22.2 | passed |      9 |      0 |
| node cjs               |      24.22.2 | passed |      9 |      0 |
| bun esm                |        1.4.5 | passed |      9 |      0 |
| bun cjs                |        1.4.5 | passed |      9 |      0 |
| deno esm               |        2.9.8 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |        159.0 | passed |      1 |      0 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |        159.0 | passed |      1 |      0 |
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

2026-11-19T14:58:40.123Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

AMD EPYC 9V74 80-Core Processor · 1,000 measured calls per case after warmup

| Operation        | Input bytes |   Ops/sec |
| ---------------- | ----------: | --------: |
| base64 encode    |          64 |   411,066 |
| base64 decode    |          64 | 1,675,502 |
| base64url encode |          64 |   990,526 |
| base64url decode |          64 | 1,534,665 |
| base64 encode    |        1024 |   680,135 |
| base64 decode    |        1024 |   726,874 |
| base64url encode |        1024 |   286,099 |
| base64url decode |        1024 |   416,825 |
| base64 encode    |       16384 |    78,796 |
| base64 decode    |       16384 |   107,817 |
| base64url encode |       16384 |    33,135 |
| base64url decode |       16384 |    79,937 |

<!-- END GENERATED:base64:benchmarks -->

<a id="base64-tests"></a>

### Tests

<!-- BEGIN GENERATED:base64:tests -->

2026-11-19T14:58:18.590Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

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
| node esm               |      24.22.2 | passed |      9 |      0 |
| node cjs               |      24.22.2 | passed |      9 |      0 |
| bun esm                |        1.4.5 | passed |      9 |      0 |
| bun cjs                |        1.4.5 | passed |      9 |      0 |
| deno esm               |        2.9.8 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |        159.0 | passed |      1 |      0 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |        159.0 | passed |      1 |      0 |
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

2026-11-19T14:58:40.153Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

AMD EPYC 9V74 80-Core Processor · 1,000 measured calls per case after warmup

| Operation               | Input bytes |   Ops/sec |
| ----------------------- | ----------: | --------: |
| encode (bytes → string) |          64 | 1,213,672 |
| decode (string → bytes) |          64 | 2,418,731 |
| encode (bytes → string) |        1024 |   778,770 |
| decode (string → bytes) |        1024 | 1,129,947 |
| encode (bytes → string) |       16384 |   133,063 |
| decode (string → bytes) |       16384 |   106,280 |

<!-- END GENERATED:utf8:benchmarks -->

<a id="utf8-tests"></a>

### Tests

<!-- BEGIN GENERATED:utf8:tests -->

2026-11-19T14:58:18.590Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

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
| node esm               |      24.22.2 | passed |      9 |      0 |
| node cjs               |      24.22.2 | passed |      9 |      0 |
| bun esm                |        1.4.5 | passed |      9 |      0 |
| bun cjs                |        1.4.5 | passed |      9 |      0 |
| deno esm               |        2.9.8 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |        159.0 | passed |      1 |      0 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |        159.0 | passed |      1 |      0 |
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

Missing compression APIs throw GZIP_COMPRESSION_UNAVAILABLE or GZIP_DECOMPRESSION_UNAVAILABLE. Node zlib failures throw UNKNOWN_ERROR with the original cause. Web stream processing errors can reject with the original runtime error.

<a id="gzip-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:gzip:benchmarks -->

2026-11-19T14:58:40.833Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

AMD EPYC 9V74 80-Core Processor · 1,000 measured calls per case after warmup

| Operation  | Input bytes | Ops/sec |
| ---------- | ----------: | ------: |
| compress   |          64 |  10,008 |
| decompress |          64 |  11,661 |
| compress   |        1024 |  10,645 |
| decompress |        1024 |  14,229 |
| compress   |       16384 |   8,201 |
| decompress |       16384 |   8,390 |

<!-- END GENERATED:gzip:benchmarks -->

<a id="gzip-tests"></a>

### Tests

<!-- BEGIN GENERATED:gzip:tests -->

2026-11-19T14:58:18.590Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

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
| node esm               |      24.22.2 | passed |      9 |      0 |
| node cjs               |      24.22.2 | passed |      9 |      0 |
| bun esm                |        1.4.5 | passed |      9 |      0 |
| bun cjs                |        1.4.5 | passed |      9 |      0 |
| deno esm               |        2.9.8 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |        159.0 | passed |      1 |      0 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |        159.0 | passed |      1 |      0 |
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

Invalid sources throw BYTE_SOURCE_EXPECTED. Invalid concatenation throws CONCAT_INVALID_INPUT or CONCAT_NORMALIZE_FAILED with the input index. Web Crypto failures throw UNKNOWN_ERROR with the original cause. Random generation is limited to 65,536 bytes per call by Web Crypto.

<a id="util-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:util:benchmarks -->

2026-11-19T14:58:41.132Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

AMD EPYC 9V74 80-Core Processor · 1,000 measured calls per case after warmup

| Operation        | Input bytes |   Ops/sec |
| ---------------- | ----------: | --------: |
| normalize view   |          64 | 2,767,461 |
| concat three     |          64 |   735,554 |
| equals same      |          64 | 1,339,692 |
| equals different |          64 | 1,048,526 |
| generate         |          64 |   262,352 |
| derive 32 bytes  |          64 |    25,910 |
| normalize view   |        1024 |   790,772 |
| concat three     |        1024 |   236,490 |
| equals same      |        1024 |   456,956 |
| equals different |        1024 |   442,929 |
| generate         |        1024 |   355,614 |
| derive 32 bytes  |        1024 |    30,297 |
| normalize view   |       16384 |    94,520 |
| concat three     |       16384 |    22,036 |
| equals same      |       16384 |    42,062 |
| equals different |       16384 |    77,216 |
| generate         |       16384 |   178,851 |
| derive 32 bytes  |       16384 |    17,976 |

<!-- END GENERATED:util:benchmarks -->

<a id="util-tests"></a>

### Tests

<!-- BEGIN GENERATED:util:tests -->

2026-11-19T14:58:18.590Z · [CI run](https://github.com/sovereignbase/bytecodec/actions/runs/44549280023) · commit `082f503`

Node v24.22.2 · linux x64

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
| node esm               |      24.22.2 | passed |      9 |      0 |
| node cjs               |      24.22.2 | passed |      9 |      0 |
| bun esm                |        1.4.5 | passed |      9 |      0 |
| bun cjs                |        1.4.5 | passed |      9 |      0 |
| deno esm               |        2.9.8 | passed |      9 |      0 |
| edge-runtime esm       |        4.0.1 | passed |      9 |      0 |
| cloudflare-workers esm | 1.20261118.1 | passed |      9 |      0 |
| chromium               | 159.0.8154.6 | passed |      1 |      0 |
| firefox                |        159.0 | passed |      1 |      0 |
| webkit                 |         27.2 | passed |      1 |      0 |
| mobile-chromium        | 159.0.8154.6 | passed |      1 |      0 |
| mobile-firefox         |        159.0 | passed |      1 |      0 |
| mobile-webkit          |         27.2 | passed |      1 |      0 |

<!-- END GENERATED:util:tests -->

## License

Licensed under the Apache License, Version 2.0.

Copyright © 2026 Sovereignbase.
