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
import { textEncoder } from '../.helpers/index.js'

/**
 * Encodes a JavaScript string as UTF-8 bytes.
 *
 * @param text The string to encode.
 * @returns A new `Uint8Array` containing the UTF-8 encoded bytes.
 */
export function fromString(text: string): Uint8Array {
  if (typeof text !== 'string')
    throw new BytecodecError(
      'STRING_INPUT_EXPECTED',
      'fromString expects a string input'
    )

  if (textEncoder) return textEncoder.encode(text)

  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return new Uint8Array(Buffer.from(text, 'utf8'))

  throw new BytecodecError(
    'UTF8_ENCODER_UNAVAILABLE',
    'No UTF-8 encoder available in this environment.'
  )
}
