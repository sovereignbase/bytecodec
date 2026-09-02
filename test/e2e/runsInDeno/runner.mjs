import * as root from '../../../dist/index.js'
import * as base45 from '../../../dist/base45/index.js'
import * as base64 from '../../../dist/base64/index.js'
import * as gzip from '../../../dist/gzip/index.js'
import * as utf8 from '../../../dist/utf8/index.js'
import * as util from '../../../dist/util/index.js'
import {
  ensurePassing,
  printResults,
  runBytecodecSuite,
} from '../shared/suite.mjs'

const results = await runBytecodecSuite(
  { root, base45, base64, gzip, utf8, util },
  { label: 'deno esm' }
)
printResults(results)
ensurePassing(results)
