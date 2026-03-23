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
import { Z85_CHARS } from '../.helpers/index.js'
import type { ByteSource } from '../index.js'
import { toUint8Array } from '../index.js'

/**
 * Encodes bytes as a Z85 string.
 *
 * @param bytes The bytes to encode.
 * @returns A Z85 string representation of `bytes`.
 */
export function toZ85String(bytes: ByteSource): string {
  const view = toUint8Array(bytes)

  if (view.length % 4 !== 0)
    throw new BytecodecError(
      'Z85_INVALID_LENGTH',
      'Z85 input length must be divisible by 4'
    )

  let z85String = ''

  for (let offset = 0; offset < view.length; offset += 4) {
    let value =
      ((view[offset] * 256 + view[offset + 1]) * 256 + view[offset + 2]) * 256 +
      view[offset + 3]

    const block = new Array(5)

    for (let index = 4; index >= 0; index--) {
      block[index] = Z85_CHARS[value % 85]
      value = Math.floor(value / 85)
    }

    z85String += block.join('')
  }

  return z85String
}
