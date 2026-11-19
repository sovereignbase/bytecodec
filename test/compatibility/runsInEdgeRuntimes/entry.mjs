import * as root from '../../../dist/index.js'
import * as base45 from '../../../dist/base45/index.js'
import * as base64 from '../../../dist/base64/index.js'
import * as gzip from '../../../dist/gzip/index.js'
import * as utf8 from '../../../dist/utf8/index.js'
import * as util from '../../../dist/util/index.js'
import { runBytecodecSuite } from '../shared/suite.mjs'

globalThis.__BYTECODEC_RESULTS_PROMISE__ = runBytecodecSuite(
  { root, base45, base64, gzip, utf8, util },
  { label: 'edge-runtime esm' }
)
