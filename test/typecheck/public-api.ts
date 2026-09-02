import {
  Bytes,
  type BytecodecErrorCode,
  type ByteSource,
} from '@sovereignbase/bytecodec'
import {
  bytesFromBase45String,
  bytesToBase45String,
} from '@sovereignbase/bytecodec/base45'
import {
  bytesFromBase64String,
  bytesFromBase64UrlString,
  bytesToBase64String,
  bytesToBase64UrlString,
} from '@sovereignbase/bytecodec/base64'
import {
  bytesFromGzipBytes,
  bytesToGzipBytes,
} from '@sovereignbase/bytecodec/gzip'
import {
  bytesFromUTF8String,
  bytesToUTF8String,
} from '@sovereignbase/bytecodec/utf8'
import {
  concatBytes,
  deriveBytes,
  equalBytes,
  generateBytes,
  normalizeBytes,
} from '@sovereignbase/bytecodec/util'

const source: ByteSource = [1, 2, 3]
const errorCode: BytecodecErrorCode = 'BYTE_SOURCE_EXPECTED'
const base45: string = bytesToBase45String(source)
const base64: string = bytesToBase64String(source)
const base64url: string = bytesToBase64UrlString(source)
const utf8: string = bytesToUTF8String(source)
const normalized: Uint8Array = normalizeBytes(source)
const concatenated: Uint8Array = concatBytes([source])
const equal: boolean = equalBytes(source, normalized)
const generated: Uint8Array = generateBytes(8)
const decoded: Uint8Array[] = [
  bytesFromBase45String(base45),
  bytesFromBase64String(base64),
  bytesFromBase64UrlString(base64url),
  bytesFromUTF8String(utf8),
]
const pending: Array<Promise<Uint8Array>> = [
  bytesToGzipBytes(source),
  bytesFromGzipBytes(source),
  deriveBytes(source, source, 8),
]
const encoding = 'base64url' as const
const encodedWithWrapper: string = Bytes[encoding].encode(source)
const decodedWithWrapper: Uint8Array =
  Bytes[encoding].decode(encodedWithWrapper)

void [
  Bytes,
  errorCode,
  concatenated,
  equal,
  generated,
  decoded,
  pending,
  decodedWithWrapper,
]
