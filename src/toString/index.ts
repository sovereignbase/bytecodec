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
import { textDecoder } from '../.helpers/index.js'
import { toUint8Array } from '../index.js'
import type { ByteSource } from '../index.js'

/**
 * Decodes UTF-8 bytes into a JavaScript string.
 *
 * @param bytes The bytes to decode.
 * @returns The decoded string.
 */
export function toString(bytes: ByteSource): string {
  const view = toUint8Array(bytes)

  if (textDecoder) return textDecoder.decode(view)

  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return Buffer.from(view).toString('utf8')

  throw new BytecodecError(
    'UTF8_DECODER_UNAVAILABLE',
    'No UTF-8 decoder available in this environment.'
  )
}
