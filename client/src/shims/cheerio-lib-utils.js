// ESM shim that re-exports cheerio's compatibility CJS utils bundle.
// This forwards imports like 'cheerio/lib/utils' to the packed commonjs build
// and avoids Node package export errors when resolving package subpaths.
// Prefer the ESM build so Vite can statically analyze and bundle it.
export * from '../../../node_modules/cheerio/dist/esm/utils.js'
export { default } from '../../../node_modules/cheerio/dist/esm/utils.js'
