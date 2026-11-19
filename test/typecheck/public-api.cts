import root = require('@sovereignbase/bytecodec')
import base45 = require('@sovereignbase/bytecodec/base45')
import base64 = require('@sovereignbase/bytecodec/base64')
import utf8 = require('@sovereignbase/bytecodec/utf8')
import gzip = require('@sovereignbase/bytecodec/gzip')
import util = require('@sovereignbase/bytecodec/util')

const shared: root.ByteSource = new Uint8Array(new SharedArrayBuffer(8))
const outputs: Uint8Array<ArrayBuffer>[] = [
  base45.bytesFromBase45String(''),
  base64.bytesFromBase64String(''),
  base64.bytesFromBase64UrlString(''),
  utf8.bytesFromUTF8String(''),
  util.normalizeBytes(shared),
  util.concatBytes([shared]),
  util.generateBytes(8),
  root.Bytes.normalize(shared),
  root.Bytes.concat([shared]),
  root.Bytes.generate(8),
  root.Bytes.base45.decode(''),
  root.Bytes.base64.decode(''),
  root.Bytes.base64url.decode(''),
  root.Bytes.utf8.decode(''),
]
const pending: Promise<Uint8Array<ArrayBuffer>>[] = [
  gzip.bytesToGzipBytes(shared),
  gzip.bytesFromGzipBytes(shared),
  util.deriveBytes(shared, shared, 8),
  root.Bytes.gzip.encode(shared),
  root.Bytes.gzip.decode(shared),
  root.Bytes.derive(shared, shared, 8),
]
const error: root.BytecodecError = new root.BytecodecError('UNKNOWN_ERROR')
void [outputs, pending, error]
