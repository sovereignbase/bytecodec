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
const normalized: Uint8Array<ArrayBuffer> = normalizeBytes(source)
const concatenated: Uint8Array<ArrayBuffer> = concatBytes([source])
const equal: boolean = equalBytes(source, normalized)
const generated: Uint8Array<ArrayBuffer> = generateBytes(8)
const decoded: Uint8Array<ArrayBuffer>[] = [
  bytesFromBase45String(base45),
  bytesFromBase64String(base64),
  bytesFromBase64UrlString(base64url),
  bytesFromUTF8String(utf8),
]
const pending: Array<Promise<Uint8Array<ArrayBuffer>>> = [
  bytesToGzipBytes(source),
  bytesFromGzipBytes(source),
  deriveBytes(source, source, 8),
]
const encoding = 'base64url' as const
const encodedWithWrapper: string = Bytes[encoding].encode(source)
const decodedWithWrapper: Uint8Array<ArrayBuffer> =
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

// Shared inputs must be accepted; every byte result must narrow to ArrayBuffer.
const shared: ByteSource = new SharedArrayBuffer(16)
const sharedView: ByteSource = new Uint16Array(new SharedArrayBuffer(16), 4, 2)
const sourceBuffer: ByteSource = new ArrayBuffer(16)
const results: Uint8Array<ArrayBuffer>[] = [
  normalizeBytes(shared),
  normalizeBytes(sharedView),
  normalizeBytes(sourceBuffer),
  Bytes.normalize(shared),
  Bytes.concat([sharedView]),
  Bytes.generate(8),
  Bytes.base45.decode(''),
  Bytes.base64.decode(''),
  Bytes.base64url.decode(''),
  Bytes.utf8.decode(''),
]
const asyncResults: Promise<Uint8Array<ArrayBuffer>>[] = [
  Bytes.gzip.encode(shared),
  Bytes.gzip.decode(sharedView),
  Bytes.derive(shared, sharedView, 8),
]
const buffers: ArrayBuffer[] = results.map((result) => result.buffer)
// @ts-expect-error SharedArrayBuffer-backed results violate the output contract.
results.push(new Uint8Array(new SharedArrayBuffer(1)))
void [asyncResults, buffers]
