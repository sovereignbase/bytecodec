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
import { isSharedArrayBuffer } from '../.helpers/index.js'
import type { ByteSource } from '../index.js'

/**
 * Normalizes a supported byte source into a new `ArrayBuffer`.
 *
 * @param bytes The byte source to normalize.
 * @returns A new `ArrayBuffer` copy of `bytes`.
 */
export function toArrayBuffer(bytes: ByteSource): ArrayBuffer {
  if (bytes instanceof ArrayBuffer) return bytes.slice(0)

  if (ArrayBuffer.isView(bytes)) {
    const view = new Uint8Array(
      bytes.buffer,
      bytes.byteOffset,
      bytes.byteLength
    )
    return isSharedArrayBuffer(view.buffer)
      ? view.slice().buffer
      : view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength)
  }

  if (Array.isArray(bytes)) return new Uint8Array(bytes).buffer

  throw new BytecodecError(
    'BYTE_SOURCE_EXPECTED',
    'Expected a Uint8Array, ArrayBuffer, ArrayBufferView, or number[]'
  )
}
