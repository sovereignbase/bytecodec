# Changelog

## [1.3.1](https://github.com/sovereignbase/bytecodec/compare/v1.3.0...v1.3.1) (2026-03-19)


### Bug Fixes

* JSR release ci ([2839c75](https://github.com/sovereignbase/bytecodec/commit/2839c75d4f9a90ccbbc82d116e22767911acd4ab))

## [1.3.0](https://github.com/sovereignbase/bytecodec/compare/v1.2.0...v1.3.0) (2026-03-19)


### Features

* Added tested CommonJS and deno + bun + edge runtime support. ([f21f9ff](https://github.com/sovereignbase/bytecodec/commit/f21f9ff953141e753f912c25a6aa5388580889c6))
* Added tested CommonJS and deno + bun + edge runtime support. ([1b9397a](https://github.com/sovereignbase/bytecodec/commit/1b9397a1c784a6877d5915bc5a8c31b600364e1e))

## [1.2.0](https://github.com/sovereignbase/bytecodec/compare/v1.1.0...v1.2.0) (2026-03-19)


### Features

* Added Base64String support (already had Base64UrlString support). ([13e03da](https://github.com/sovereignbase/bytecodec/commit/13e03da9d8bb126d4b8cad8098dd33814f0aab5e))


### Bug Fixes

* license ([a95d69f](https://github.com/sovereignbase/bytecodec/commit/a95d69f9aa5c518f0f6dbcf68c83c523efc3de6b))

## [1.1.0](https://github.com/z-base/bytecodec/compare/v1.0.7...v1.1.0) (2026-01-28)


### Features

* Added non-blocking compress/decompress support for node runtimes (async zlib) ([9ec3b2e](https://github.com/z-base/bytecodec/commit/9ec3b2eaef4b2a9e8128e6d28caa3f3c9e605adf))

## [1.0.7](https://github.com/z-base/bytecodec/compare/v1.0.6...v1.0.7) (2026-01-27)


### Bug Fixes

* readme tags ordering ([dc98815](https://github.com/z-base/bytecodec/commit/dc988159b8454898bb396e95ffb57b0acde443a8))

## [1.0.6](https://github.com/z-base/bytecodec/compare/v1.0.5...v1.0.6) (2026-01-27)


### Bug Fixes

* npm publish automation ([cd93462](https://github.com/z-base/bytecodec/commit/cd93462a14496f9996e435eac08d372d2f74bfc5))

## [1.0.5](https://github.com/z-base/bytecodec/compare/v1.0.4...v1.0.5) (2026-01-27)


### Bug Fixes

* npm publish automation ([8ec6bee](https://github.com/z-base/bytecodec/commit/8ec6beeff72890b4521ad4c3a712c25f13766089))

## [1.0.4](https://github.com/z-base/bytecodec/compare/v1.0.3...v1.0.4) (2026-01-27)


### Bug Fixes

* npm publish automation ([2eee989](https://github.com/z-base/bytecodec/commit/2eee9895c88eeabe978489862e51a29a22f1e92b))
* npm publish automation ([25eed87](https://github.com/z-base/bytecodec/commit/25eed87f9410616dc0b5b35df3e36b0f98a32e81))

## [1.0.3](https://github.com/z-base/bytecodec/compare/v1.0.2...v1.0.3) (2026-01-27)


### Bug Fixes

* npm publish automation ([d6bf537](https://github.com/z-base/bytecodec/commit/d6bf53760cccce09cffdb07f73a1525ec1871028))

## [1.0.2](https://github.com/z-base/bytecodec/compare/v1.0.1...v1.0.2) (2026-01-27)


### Bug Fixes

* npm publish automation ([708fc35](https://github.com/z-base/bytecodec/commit/708fc35da1c458e70f0773c58e0b4cd6f25ade9a))
* npm publish automation ([e90c83e](https://github.com/z-base/bytecodec/commit/e90c83ed0503c609620c849d670f326fe93e077c))

## [1.0.1](https://github.com/z-base/bytecodec/compare/v1.0.0...v1.0.1) (2026-01-27)


### Bug Fixes

* trigger release ([22d8b5e](https://github.com/z-base/bytecodec/commit/22d8b5e092f2b5640d7334c15cd0789b83118897))

## 1.0.0 (2026-01-27)

### Bug Fixes

- configure release-please v4 ([cceaf1b](https://github.com/z-base/bytecodec/commit/cceaf1b573518298926d4240f3e95969033a5eb1))

## 0.0.0 - (2026-01-27)

- Package name change from `bytecodec` to `@z-base/bytecodec`.
- Added GitHub Actions CI/CD.
- Made documentation a bit richer.
- Added linting and formatting scripts.

## 3.0.1 - (2026-01-24)

- Updated documentation formatting and usage examples.

## 3.0.0 - (2026-01-23)

- Added comprehensive Node unit/integration tests with enforced 100% c8 coverage.
- Added Playwright E2E coverage for Chromium, Firefox, WebKit, and mobile emulation.
- Expanded benchmarks to cover all public byte helpers.
- Removed the generateNonce method.
- Updated documentation, testing notes, and benchmark results.
- Added the toArrayBuffer method.
- Added explicit error handling.
