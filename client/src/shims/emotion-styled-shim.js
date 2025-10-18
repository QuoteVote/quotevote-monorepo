// Re-export the package specifier so Vite's resolver rewrites imports to the
// hoisted ESM build via aliases defined in vite/vitest configs. Avoid using
// a relative deep-path here (like '../../../node_modules/.../dist/...') because
// Vite may accidentally append subpaths to this file's path and cause ENOENT.
export * from '@emotion/styled'
export { default } from '@emotion/styled'
