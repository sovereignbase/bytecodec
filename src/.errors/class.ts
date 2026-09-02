/**
 * All structured error codes thrown by the bytecodec.
 */
export type BytecodecErrorCode =
  | 'BASE45_INPUT_EXPECTED'
  | 'BASE45_INVALID_CHARACTER'
  | 'BASE45_INVALID_CHUNK'
  | 'BASE45_INVALID_LENGTH'
  | 'BASE64_DECODER_UNAVAILABLE'
  | 'BASE64_ENCODER_UNAVAILABLE'
  | 'BASE64URL_INVALID_LENGTH'
  | 'BYTE_SOURCE_EXPECTED'
  | 'CONCAT_INVALID_INPUT'
  | 'CONCAT_NORMALIZE_FAILED'
  | 'GZIP_COMPRESSION_UNAVAILABLE'
  | 'GZIP_DECOMPRESSION_UNAVAILABLE'
  | 'STRING_INPUT_EXPECTED'
  | 'UTF8_DECODER_UNAVAILABLE'
  | 'UTF8_ENCODER_UNAVAILABLE'

/**
 * Error type used by the bytecodec helpers to expose a stable error code.
 */
export class BytecodecError extends Error {
  /**
   * Machine-readable error code for programmatic handling.
   */
  readonly code: BytecodecErrorCode

  /**
   * Creates a new bytecodec error with a package-prefixed message.
   *
   * @param code Stable error code describing the failure category.
   * @param message Optional human-readable detail appended to the package prefix.
   */
  constructor(code: BytecodecErrorCode, message?: string) {
    const detail = message ?? code
    super(`{@sovereignbase/bytecodec} ${detail}`)
    this.code = code
    this.name = 'BytecodecError'
  }
}
