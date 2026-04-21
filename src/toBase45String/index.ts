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

import { BASE45_CHARS } from '../.helpers/index.js'
import type { ByteSource } from '../index.js'
import { toUint8Array } from '../index.js'

/**
 * Encodes bytes as a Base45 string.
 *
 * @param bytes The bytes to encode.
 * @returns A Base45 string representation of `bytes`.
 */
export function toBase45String(bytes: ByteSource): string {
  const view = toUint8Array(bytes)
  let base45String = ''

  for (let offset = 0; offset + 1 < view.length; offset += 2) {
    let value = view[offset] * 256 + view[offset + 1]

    base45String += BASE45_CHARS[value % 45]
    value = Math.floor(value / 45)
    base45String += BASE45_CHARS[value % 45]
    base45String += BASE45_CHARS[Math.floor(value / 45)]
  }

  if (view.length % 2 === 1) {
    const value = view[view.length - 1]
    base45String += BASE45_CHARS[value % 45]
    base45String += BASE45_CHARS[Math.floor(value / 45)]
  }

  return base45String
}
