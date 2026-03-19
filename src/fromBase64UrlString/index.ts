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
import { fromBase64String } from '../fromBase64String/index.js'

export function fromBase64UrlString(
  base64UrlString: Base64URLString
): Uint8Array {
  const base64String = toBase64String(base64UrlString)
  return fromBase64String(base64String)
}

/**
 * From Base 64 URL String to Base 64 String
 */
function toBase64String(base64UrlString: Base64URLString): string {
  let base64String = base64UrlString.replace(/-/g, '+').replace(/_/g, '/')
  const mod = base64String.length & 3
  if (mod === 2) base64String += '=='
  else if (mod === 3) base64String += '='
  else if (mod !== 0)
    throw new BytecodecError(
      'BASE64URL_INVALID_LENGTH',
      'Invalid base64url length'
    )
  return base64String
}
