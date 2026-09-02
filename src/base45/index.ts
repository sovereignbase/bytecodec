import { BytecodecError } from '../.errors/class.js'
import { normalizeBytesToUint8Array } from '../util/index.js'
import type { ByteSource } from '../index.js'

let base45Chars: string
let base45Values: Int16Array

/**
 * Encodes bytes as a Base45 string.
 *
 * @param bytes The bytes to encode.
 * @returns A Base45 string representation of `bytes`.
 */
export function bytesToBase45String(bytes: ByteSource): string {
  const view = normalizeBytesToUint8Array(bytes)
  if (!base45Chars)
    base45Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

  let base45String = ''

  for (let offset = 0; offset + 1 < view.length; offset += 2) {
    let value = view[offset] * 256 + view[offset + 1]

    base45String += base45Chars[value % 45]
    value = Math.floor(value / 45)
    base45String += base45Chars[value % 45]
    base45String += base45Chars[Math.floor(value / 45)]
  }

  if (view.length % 2 === 1) {
    const value = view[view.length - 1]
    base45String += base45Chars[value % 45]
    base45String += base45Chars[Math.floor(value / 45)]
  }

  return base45String
}

/**
 * Decodes a Base45 string into a new `Uint8Array`.
 *
 * @param base45String The Base45 string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function bytesFromBase45String(base45String: string): Uint8Array {
  if (typeof base45String !== 'string')
    throw new BytecodecError(
      'BASE45_INPUT_EXPECTED',
      'fromBase45String expects a string input'
    )

  if (base45String.length % 3 === 1)
    throw new BytecodecError(
      'BASE45_INVALID_LENGTH',
      'Base45 string length must not leave a trailing single character'
    )

  const bytes = new Uint8Array(
    Math.floor(base45String.length / 3) * 2 +
      (base45String.length % 3 === 2 ? 1 : 0)
  )
  let byteOffset = 0

  for (let stringOffset = 0; stringOffset < base45String.length;) {
    const remaining = base45String.length - stringOffset
    const digit0 = toBase45Digit(base45String, stringOffset)
    const digit1 = toBase45Digit(base45String, stringOffset + 1)

    if (remaining === 2) {
      const value = digit0 + digit1 * 45

      if (value > 0xff)
        throw new BytecodecError(
          'BASE45_INVALID_CHUNK',
          `Invalid base45 chunk at index ${stringOffset}`
        )

      bytes[byteOffset++] = value
      stringOffset += 2
      continue
    }

    const digit2 = toBase45Digit(base45String, stringOffset + 2)
    const value = digit0 + digit1 * 45 + digit2 * 2025

    if (value > 0xffff)
      throw new BytecodecError(
        'BASE45_INVALID_CHUNK',
        `Invalid base45 chunk at index ${stringOffset}`
      )

    bytes[byteOffset++] = value >>> 8
    bytes[byteOffset++] = value & 0xff
    stringOffset += 3
  }

  return bytes
}

function toBase45Digit(base45String: string, stringOffset: number): number {
  if (!base45Values) base45Values = prepareBase45Values()
  const code = base45String.charCodeAt(stringOffset)
  const digit = code < 128 ? base45Values[code] : -1

  if (digit === -1)
    throw new BytecodecError(
      'BASE45_INVALID_CHARACTER',
      `Invalid base45 character at index ${stringOffset}`
    )

  return digit
}

function prepareBase45Values(): Int16Array {
  if (!base45Chars)
    base45Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'
  const table = new Int16Array(128).fill(-1)
  for (let i = 0; i < base45Chars.length; i++) {
    table[base45Chars.charCodeAt(i)] = i
  }

  return table
}
