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

import { HEX_PAIRS } from '../.helpers/index.js'
import type { ByteSource } from '../index.js'
import { toUint8Array } from '../index.js'

/**
 * Encodes bytes as a lowercase hexadecimal string.
 *
 * @param bytes The bytes to encode.
 * @returns A hexadecimal string representation of `bytes`.
 */
export function toHex(bytes: ByteSource): string {
  const view = toUint8Array(bytes)
  let hex = ''

  for (let index = 0; index < view.length; index++) {
    hex += HEX_PAIRS[view[index]]
  }

  return hex
}
