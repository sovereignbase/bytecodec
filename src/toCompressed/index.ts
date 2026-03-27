/*
 * Copyright 2026 Sovereignbase
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BytecodecError } from '../.errors/class.js'
import { importNodeBuiltin, isNodeRuntime } from '../.helpers/index.js'
import { toBufferSource, toUint8Array } from '../index.js'
import type { ByteSource } from '../index.js'

/**
 * Compresses bytes using gzip.
 *
 * @param bytes The bytes to compress.
 * @returns A promise that resolves to a new `Uint8Array` containing the gzip payload.
 */
export async function toCompressed(bytes: ByteSource): Promise<Uint8Array> {
  const view = toUint8Array(bytes)

  // Node: use built-in zlib
  if (isNodeRuntime()) {
    const { gzip } =
      await importNodeBuiltin<typeof import('node:zlib')>('node:zlib')
    const { promisify } =
      await importNodeBuiltin<typeof import('node:util')>('node:util')
    const gzipAsync = promisify(gzip)
    const compressed = await gzipAsync(view)
    return toUint8Array(compressed)
  }

  // Browser/edge runtimes: CompressionStream with gzip
  if (typeof CompressionStream === 'undefined')
    throw new BytecodecError(
      'GZIP_COMPRESSION_UNAVAILABLE',
      'gzip compression not available in this environment.'
    )

  return compressWithStream(view, 'gzip')
}

/**
 * Compresses bytes with `CompressionStream` in runtimes that expose the web compression APIs.
 *
 * @param bytes The bytes to compress.
 * @param format The compression format to use.
 * @returns A promise that resolves to the compressed bytes.
 */
async function compressWithStream(
  bytes: Uint8Array,
  format: CompressionFormat
) {
  const compressedStream = new Blob([toBufferSource(bytes)])
    .stream()
    .pipeThrough(new CompressionStream(format))
  const arrayBuffer = await new Response(compressedStream).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
