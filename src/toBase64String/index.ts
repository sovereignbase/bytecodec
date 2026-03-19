import { BytecodecError } from '../.errors/class.js'

export function toBase64String(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return Buffer.from(bytes).toString('base64')

  let binaryString = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, bytes.length)
    let chunkString = ''
    for (let index = offset; index < end; index++) {
      chunkString += String.fromCharCode(bytes[index])
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
