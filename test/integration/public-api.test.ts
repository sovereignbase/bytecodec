import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { Bytes } from '@sovereignbase/bytecodec'
import * as base45 from '@sovereignbase/bytecodec/base45'
import * as base64 from '@sovereignbase/bytecodec/base64'
import * as gzip from '@sovereignbase/bytecodec/gzip'
import * as utf8 from '@sovereignbase/bytecodec/utf8'
import * as util from '@sovereignbase/bytecodec/util'
import { Bytes as SourceBytes } from '../../src/index.js'

describe('published package API', () => {
  it('exposes the intentionally small root API and focused subpaths', () => {
    expect(Object.keys({ Bytes })).toEqual(['Bytes'])
    expect(Object.keys(base45).sort()).toEqual([
      'bytesFromBase45String',
      'bytesToBase45String',
    ])
    expect(Object.keys(base64).sort()).toEqual([
      'bytesFromBase64String',
      'bytesFromBase64UrlString',
      'bytesToBase64String',
      'bytesToBase64UrlString',
    ])
    expect(Object.keys(gzip).sort()).toEqual([
      'bytesFromGzipBytes',
      'bytesToGzipBytes',
    ])
    expect(Object.keys(utf8).sort()).toEqual([
      'bytesFromUTF8String',
      'bytesToUTF8String',
    ])
    expect(Object.keys(util).sort()).toEqual([
      'concatBytes',
      'deriveBytes',
      'equalBytes',
      'generateBytes',
      'normalizeBytes',
    ])
  })

  it('supports the declarative Bytes API end to end', async () => {
    const text = 'public API ✓'
    const bytes = SourceBytes.utf8.decode(text)
    const base45Encoded = SourceBytes.base45.encode(bytes)
    const base64Encoded = SourceBytes.base64.encode(bytes)
    const base64UrlEncoded = SourceBytes.base64.url.encode(bytes)
    const compressed = await SourceBytes.gzip.encode(bytes)

    expect(
      SourceBytes.utf8.encode(SourceBytes.base45.decode(base45Encoded))
    ).toBe(text)
    expect(SourceBytes.base64.decode(base64Encoded)).toEqual(bytes)
    expect(SourceBytes.base64.url.decode(base64UrlEncoded)).toEqual(bytes)
    expect(await SourceBytes.gzip.decode(compressed)).toEqual(bytes)
    expect(SourceBytes.concat([bytes, [1]])).toEqual(
      new Uint8Array([...bytes, 1])
    )
    expect(SourceBytes.equals(SourceBytes.normalize(bytes), bytes)).toBe(true)
    expect(await SourceBytes.derive(bytes, [1], 16)).toHaveLength(16)
    expect(SourceBytes.generate(16)).toHaveLength(16)
  })

  it('provides the same subpaths to CommonJS consumers', () => {
    const require = createRequire(import.meta.url)

    expect(Object.keys(require('@sovereignbase/bytecodec'))).toEqual(['Bytes'])
    expect(
      require('@sovereignbase/bytecodec/utf8').bytesFromUTF8String('cjs')
    ).toEqual(new Uint8Array([99, 106, 115]))
    expect(
      require('@sovereignbase/bytecodec/base45').bytesToBase45String([65, 66])
    ).toBe('BB8')
  })
})
