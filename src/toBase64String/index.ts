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
 * Encodes bytes as a base64 string.
 *
 * @param bytes The bytes to encode.
 * @returns A base64 string representation of `bytes`.
 */
export function toBase64String(bytes: ByteSource): string {
  const view = toUint8Array(bytes)
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return Buffer.from(view).toString('base64')

  let binaryString = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < view.length; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, view.length)
    let chunkString = ''
    for (let index = offset; index < end; index++) {
      chunkString += String.fromCharCode(view[index])
    }
    binaryString += chunkString
  }
  if (typeof btoa !== 'function')
    throw new BytecodecError(
      'BASE64_ENCODER_UNAVAILABLE',
      'No base64 encoder available in this environment.'
    )
  return btoa(binaryString)
}
