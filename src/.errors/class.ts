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

export type BytecodecErrorCode =
  | 'BASE64_DECODER_UNAVAILABLE'
  | 'BASE64_ENCODER_UNAVAILABLE'
  | 'BASE64URL_INVALID_LENGTH'
  | 'BYTE_SOURCE_EXPECTED'
  | 'CONCAT_INVALID_INPUT'
  | 'CONCAT_NORMALIZE_FAILED'
  | 'GZIP_COMPRESSION_UNAVAILABLE'
  | 'GZIP_DECOMPRESSION_UNAVAILABLE'
  | 'HEX_INPUT_EXPECTED'
  | 'HEX_INVALID_CHARACTER'
  | 'HEX_INVALID_LENGTH'
  | 'JSON_PARSE_FAILED'
  | 'JSON_STRINGIFY_FAILED'
  | 'STRING_INPUT_EXPECTED'
  | 'UTF8_DECODER_UNAVAILABLE'
  | 'UTF8_ENCODER_UNAVAILABLE'
  | 'Z85_INPUT_EXPECTED'
  | 'Z85_INVALID_BLOCK'
  | 'Z85_INVALID_CHARACTER'
  | 'Z85_INVALID_LENGTH'

export class BytecodecError extends Error {
  readonly code: BytecodecErrorCode

  constructor(code: BytecodecErrorCode, message?: string) {
    const detail = message ?? code
    super(`{@sovereignbase/bytecodec} ${detail}`)
    this.code = code
    this.name = 'BytecodecError'
  }
}
