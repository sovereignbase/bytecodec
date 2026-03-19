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
import { toUint8Array } from '../index.js'

/**
 * Concatenates multiple byte sources into a single `Uint8Array`.
 *
 * @param sources The byte sources to concatenate, in order.
 * @returns A new `Uint8Array` containing the concatenated bytes.
 */
export function concat(sources: ByteSource[]): Uint8Array {
  if (!Array.isArray(sources))
    throw new BytecodecError(
      'CONCAT_INVALID_INPUT',
      'concat expects an array of ByteSource items'
    )

  if (sources.length === 0) return new Uint8Array(0)

  const arrays = sources.map((source, index) => {
    try {
      return toUint8Array(source)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new BytecodecError(
        'CONCAT_NORMALIZE_FAILED',
        `concat failed to normalize input at index ${index}: ${message}`
      )
    }
  })

  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0)
  const result = new Uint8Array(totalLength)

  let offset = 0
  for (const array of arrays) {
    if (array.length === 0) continue
    result.set(array, offset)
    offset += array.length
  }

  return result
}
