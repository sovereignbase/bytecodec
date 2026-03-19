import { BytecodecError } from '../.errors/class.js'

function fromBase64String(base64String: string): Uint8Array {
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return new Uint8Array(Buffer.from(base64String, 'base64'))

  if (typeof atob !== 'function')
    throw new BytecodecError(
      'BASE64_DECODER_UNAVAILABLE',
      'No base64 decoder available in this environment.'
    )

  const binaryString = atob(base64String)
  const bytes = new Uint8Array(binaryString.length)
  for (let index = 0; index < binaryString.length; index++)
    bytes[index] = binaryString.charCodeAt(index)
  return bytes
}
