// Minimal ESM shim for @emotion/serialize used during build to avoid
// deep-import ENOENTs in CI where the package's specific ESM file isn't present.
// This intentionally provides a lightweight serializeStyles implementation
// sufficient for static analysis and bundling.
export function serializeStyles(styles) {
  if (typeof styles === 'string') return { name: 'shim', styles }
  try {
    return { name: 'shim', styles: JSON.stringify(styles) }
  } catch (e) {
    return { name: 'shim', styles: String(styles) }
  }
}

export default { serializeStyles }
