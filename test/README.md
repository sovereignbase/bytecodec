# Tests

`base45/`, `base64/`, `utf8/`, `gzip/` and `util/` contain codec and utility tests. Shared byte-source fixtures, error contracts and runtime detection live in `shared/`. `integration/` verifies the built ESM and CommonJS public exports; `typecheck/` checks the published declarations. Runtime harnesses and browser checks live in `compatibility/` and share the same compatibility suite.

```sh
npm test
npm run test:base45
npm run test:base64
npm run test:utf8
npm run test:gzip
npm run test:util
```

`npm test` builds the package and API documentation, checks TypeScript, tests the README report generator, enforces 100% statements, branches, functions and lines in source, and runs browser and runtime compatibility checks. Focused codec commands disable coverage; run `npm run test:vitest` for the complete coverage gate. Integration tests require a current package build.

Byte-source cases cover ordinary and shared buffers, offset DataViews, every standard numeric typed-array kind, empty views and Node Buffer slices. Tests check exact byte ranges, independent output ownership and ordinary ArrayBuffer backing. HKDF is compared with Node's independent implementation. Gzip is exercised through both zlib and web streams.

Type tests assign every byte-returning public function and wrapper method to `Uint8Array<ArrayBuffer>` or its promise, accept shared input views, and reject shared-backed output types.

Compatibility checks run the built package in Node and Bun (ESM and CommonJS), Deno, Edge Runtime and local workerd, plus Chromium, Firefox and WebKit with desktop and mobile profiles. Install Bun, Deno and Playwright browsers (`npx playwright install chromium firefox webkit`) before a complete local run.

`PLAYWRIGHT_FIREFOX_EXECUTABLE` can select an already installed Playwright Firefox binary for local checks. CI uses the matching default download. Browser reports record the actual browser version.

Vitest, Playwright and runtime JSON reports go to `.results/`; coverage goes to `../coverage/`. `npm run reports` updates README tables explicitly, so focused tests do not silently rewrite documentation. `npm test` starts a fresh report set. CI attaches the raw reports and commits README tables only on a successful master push; pull requests only produce artifacts.
