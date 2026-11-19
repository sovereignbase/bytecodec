import { describe, expect, it } from 'vitest'
import { BytecodecError } from '../../src/.errors/class.js'
import { importNodeBuiltin, isNodeRuntime } from '../../src/.helpers/index.js'

describe('internal runtime support', () => {
  it('creates stable structured errors with optional detail', () => {
    const detailed = new BytecodecError(
      'BYTE_SOURCE_EXPECTED',
      'Expected bytes'
    )
    const fallback = new BytecodecError('UTF8_ENCODER_UNAVAILABLE')

    expect(detailed).toMatchObject({
      name: 'BytecodecError',
      code: 'BYTE_SOURCE_EXPECTED',
      message: '{@sovereignbase/bytecodec} Expected bytes',
    })
    expect(fallback.message).toBe(
      '{@sovereignbase/bytecodec} UTF8_ENCODER_UNAVAILABLE'
    )
  })

  it('detects Node and dynamically imports built-ins', async () => {
    expect(isNodeRuntime()).toBe(true)
    const nodeVersion = process.versions.node
    Object.defineProperty(process.versions, 'node', {
      configurable: true,
      value: undefined,
    })
    expect(isNodeRuntime()).toBe(false)
    Object.defineProperty(process.versions, 'node', {
      configurable: true,
      value: nodeVersion,
    })
    const buffer =
      await importNodeBuiltin<typeof import('node:buffer')>('node:buffer')
    expect(buffer.Buffer).toBe(Buffer)
  })
})
