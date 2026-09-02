import { BytecodecError } from '../.errors/class.js'
import { normalizeBytes } from '../util/index.js'
import type { ByteSource } from '../index.js'

let textEncoder: TextEncoder

let textDecoder: TextDecoder

/**
 * Decodes UTF-8 bytes into a JavaScript string.
 *
 * @param bytes The bytes to decode.
 * @returns The decoded string.
 */
export function bytesToUTF8String(bytes: ByteSource): string {
  const view = normalizeBytes(bytes)

  if (typeof TextDecoder !== 'undefined') {
    if (!textDecoder) textDecoder = new TextDecoder()
    return textDecoder.decode(view)
  }

  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return Buffer.from(view).toString('utf8')

  throw new BytecodecError(
    'UTF8_DECODER_UNAVAILABLE',
    'No UTF-8 decoder available in this environment.'
  )
}

/**
 * Encodes a JavaScript string as UTF-8 bytes.
 *
 * @param text The string to encode.
 * @returns A new `Uint8Array` containing the UTF-8 encoded bytes.
 */
export function bytesFromUTF8String(text: string): Uint8Array {
  if (typeof text !== 'string')
    throw new BytecodecError(
      'STRING_INPUT_EXPECTED',
      'bytesFromUTF8String expects a string input'
    )

  if (typeof TextEncoder !== 'undefined') {
    if (!textEncoder) textEncoder = new TextEncoder()
    return textEncoder.encode(text)
  }

  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return new Uint8Array(Buffer.from(text, 'utf8'))

  throw new BytecodecError(
    'UTF8_ENCODER_UNAVAILABLE',
    'No UTF-8 encoder available in this environment.'
  )
}
