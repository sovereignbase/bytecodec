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
import type { ByteSource } from '../index.js'
import { isNodeRuntime } from '../.helpers/index.js'
import { toUint8Array } from '../index.js'

export async function toCompressed(bytes: ByteSource): Promise<Uint8Array> {
  const view = toUint8Array(bytes)

  // Node: use built-in zlib
  if (isNodeRuntime()) {
    const { gzip } = await import('node:zlib')
    const { promisify } = await import('node:util')
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

async function compressWithStream(
  bytes: BufferSource,
  format: CompressionFormat
) {
  const cs = new CompressionStream(format)
  const writer = cs.writable.getWriter()
  await writer.write(bytes)
  await writer.close()
  const arrayBuffer = await new Response(cs.readable).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
