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

export function toUint8Array(input: ByteSource): Uint8Array<ArrayBuffer> {
  if (input instanceof Uint8Array) return new Uint8Array(input)
  if (input instanceof ArrayBuffer) return new Uint8Array(input.slice(0))
  if (ArrayBuffer.isView(input)) {
    const view = new Uint8Array(
      input.buffer,
      input.byteOffset,
      input.byteLength
    )
    return new Uint8Array(view)
  }
  if (Array.isArray(input)) return new Uint8Array(input)
  throw new BytecodecError(
    'BYTE_SOURCE_EXPECTED',
    'Expected a Uint8Array, ArrayBuffer, ArrayBufferView, or number[]'
  )
}
