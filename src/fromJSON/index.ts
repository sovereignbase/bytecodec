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
import { fromString } from '../fromString/index.js'

/**
 * Serializes a JavaScript value as JSON UTF-8 bytes.
 *
 * @param value The value to serialize.
 * @returns A new `Uint8Array` containing the JSON representation of `value`.
 */
export function fromJSON(value: any): Uint8Array {
  try {
    return fromString(JSON.stringify(value))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new BytecodecError(
      'JSON_STRINGIFY_FAILED',
      `fromJSON failed to stringify value: ${message}`
    )
  }
}
