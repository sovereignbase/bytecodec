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
