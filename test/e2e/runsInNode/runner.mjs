import { createRequire } from 'node:module'
import * as esmRoot from '@sovereignbase/bytecodec'
import * as esmBase45 from '@sovereignbase/bytecodec/base45'
import * as esmBase64 from '@sovereignbase/bytecodec/base64'
import * as esmGzip from '@sovereignbase/bytecodec/gzip'
import * as esmUtf8 from '@sovereignbase/bytecodec/utf8'
import * as esmUtil from '@sovereignbase/bytecodec/util'
import {
  ensurePassing,
  printResults,
  runBytecodecSuite,
} from '../shared/suite.mjs'

const require = createRequire(import.meta.url)
const apis = [
  [
    'node esm',
    {
      root: esmRoot,
      base45: esmBase45,
      base64: esmBase64,
      gzip: esmGzip,
      utf8: esmUtf8,
      util: esmUtil,
    },
  ],
  [
    'node cjs',
    {
      root: require('@sovereignbase/bytecodec'),
      base45: require('@sovereignbase/bytecodec/base45'),
      base64: require('@sovereignbase/bytecodec/base64'),
      gzip: require('@sovereignbase/bytecodec/gzip'),
      utf8: require('@sovereignbase/bytecodec/utf8'),
      util: require('@sovereignbase/bytecodec/util'),
    },
  ],
]

for (const [label, api] of apis) {
  const results = await runBytecodecSuite(api, { label })
  printResults(results)
  ensurePassing(results)
}
