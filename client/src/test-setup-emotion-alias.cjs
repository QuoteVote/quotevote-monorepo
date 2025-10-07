const path = require('path')

// Try to force Node's require cache to map any client-local @emotion
// imports to the hoisted monorepo copy when available. This makes
// require('@emotion/styled') and require('@emotion/react') return the
// same module instance as the repo-root installation during tests.
// It's intentionally defensive: if hoisted packages aren't present we'll
// silently skip the re-mapping.

function mapToHoisted(pkgName) {
  try {
    // Resolve the hoisted package from the repository root (two levels up from client/src)
    const repoRoot = path.resolve(__dirname, '..', '..')
    const hoistedPath = require.resolve(pkgName, { paths: [repoRoot] })
    // Resolve what Node would pick up normally from this client package
    const localPath = require.resolve(pkgName)

    if (hoistedPath && localPath && hoistedPath !== localPath) {
      // Ensure the hoisted module is loaded into cache
      require(hoistedPath)
      // Overwrite the local cache entry so subsequent requires use hoisted module
      const hoistedEntry = require.cache[hoistedPath]
      if (hoistedEntry) {
        require.cache[localPath] = hoistedEntry
      }
    }
  } catch (e) {
    // Ignore resolution errors; leave default Node resolution intact
  }
}

mapToHoisted('@emotion/styled')
mapToHoisted('@emotion/react')

module.exports = {}
