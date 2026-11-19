# Benchmarks

Each codec has its own `workloads.mjs`. All suites use `runner.mjs`, serial execution, deterministic inputs, and warmup. Fixture construction, result verification, and report writing happen outside measurement. Synchronous calls and awaited asynchronous calls are measured separately.

```sh
npm run bench
npm run bench:base45
npm run bench:base64
npm run bench:utf8
npm run bench:gzip
npm run bench:util
```

The defaults are 64, 1,024 and 16,384 input bytes, 100 warmup calls and 1,000 measured calls per operation. `BENCH_SIZES`, `BENCH_WARMUP` and `BENCH_ITERATIONS` override these values. Input sizes must be positive and at most 65,536 bytes, matching the random generator's Web Crypto quota.

UTF-8 labels follow the public wrapper: encode converts bytes to a string, decode converts a string to bytes. Utilities measure a shared DataView, concatenation of three inputs, equality, random generation, and 32-byte HKDF derivation. Gzip measures Node's zlib backend. Throughput is calls per second, including each API's normalization and allocation costs. Results depend on machine, runtime, input and system load; they are not a statistical regression gate.

JSON reports in `.results/<codec>.json` record the commit, CI run when available, Node version, operating system, architecture, CPU, configuration and measured timings. `npm run reports` copies these results into the codec sections of the root README. Local reports are labeled as local. CI publishes reports only after the complete test and benchmark run succeeds.
