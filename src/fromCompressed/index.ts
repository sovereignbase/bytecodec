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
import { toUint8Array } from '../index.js'
import type { ByteSource } from '../index.js'

/**
 * Decompresses gzip-compressed bytes.
 *
 * @param bytes The gzip-compressed bytes to decompress.
 * @returns A promise that resolves to a new `Uint8Array` containing the decompressed bytes.
 */
export async function fromCompressed(bytes: ByteSource): Promise<Uint8Array> {
  const view = toUint8Array(bytes)

  if (isNodeRuntime()) {
    const { gunzip } = await importNodeBuiltin<typeof import('node:zlib')>(
      'node:zlib'
    )
    const { promisify } = await importNodeBuiltin<typeof import('node:util')>(
      'node:util'
    )
    const gunzipAsync = promisify(gunzip)
    const decompressed = await gunzipAsync(view)
    return toUint8Array(decompressed)
  }

  if (typeof DecompressionStream === 'undefined')
    throw new BytecodecError(
      'GZIP_DECOMPRESSION_UNAVAILABLE',
      'gzip decompression not available in this environment.'
    )

  return decompressWithStream(view, 'gzip')
}

/**
 * Decompresses bytes with `DecompressionStream` in runtimes that expose the web compression APIs.
 *
 * @param bytes The bytes to decompress.
 * @param format The compression format to use.
 * @returns A promise that resolves to the decompressed bytes.
 */
async function decompressWithStream(
  bytes: BufferSource,
  format: CompressionFormat
) {
  const decompressedStream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream(format))
  const arrayBuffer = await new Response(decompressedStream).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
