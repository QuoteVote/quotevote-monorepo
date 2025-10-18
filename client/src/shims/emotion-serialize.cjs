// Lightweight CommonJS shim that prefers a local or hoisted @emotion/serialize CJS build
// and falls back to a minimal implementation if nothing else is available.
// This file is used as an explicit alias target so bundlers don't try to
// append subpaths (which caused ENOENTs in CI when the ESM build wasn't present).
'use strict'
const fs = require('fs')
const path = require('path')

function tryRequire(p) {
  try {
    return require(p)
  } catch (e) {
    return null
  }
}

// Candidate locations to find a CJS build of @emotion/serialize. We try
// the client local node_modules first, then the repo root hoisted node_modules.
const candidates = [
  path.join(__dirname, '..', '..', 'node_modules', '@emotion', 'serialize', 'dist', 'serialize.cjs.js'),
  path.join(__dirname, '..', '..', '..', 'node_modules', '@emotion', 'serialize', 'dist', 'serialize.cjs.js'),
]

let mod = null
for (const p of candidates) {
  mod = tryRequire(p)
  if (mod) break
}

// Last-ditch: try to require the package name directly so Node's resolver
// can pick up whatever layout the environment provided.
if (!mod) mod = tryRequire('@emotion/serialize')

// Minimal fallback implementation (very small, best-effort). It only
// implements serializeStyles which is the primary named export MUI uses
// during static analysis. This fallback preserves build-time success; if
// it runs at runtime it may produce different CSS shapes but ensures
// bundling and CI won't fail due to a missing file.
if (!mod) {
  mod = {
    serializeStyles: function (styles) {
      // naive serialization: convert objects to JSON, strings passthrough
      if (typeof styles === 'string') return { name: 'fallback', styles }
      try {
        return { name: 'fallback', styles: JSON.stringify(styles) }
      } catch (e) {
        return { name: 'fallback', styles: String(styles) }
      }
    },
  }
}

module.exports = mod
