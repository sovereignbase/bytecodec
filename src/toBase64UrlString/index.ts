import type { ByteSource } from '../index.js'
import { toUint8Array } from '../index.js'
import { toBase64String } from '../toBase64String/index.js'

export function toBase64UrlString(bytes: ByteSource): Base64URLString {
  const view = toUint8Array(bytes)
  const base64 = toBase64String(view)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
