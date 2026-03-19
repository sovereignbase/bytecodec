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
import { toString } from '../toString/index.js'

export function toJSON(input: ByteSource | string): any {
  const jsonString = typeof input === 'string' ? input : toString(input)
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new BytecodecError(
      'JSON_PARSE_FAILED',
      `toJSON failed to parse value: ${message}`
    )
  }
}
