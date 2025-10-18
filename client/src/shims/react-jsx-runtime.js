// ESM re-export shim which forwards named exports to the hoisted React ESM runtime
// Use an explicit .js path so Rollup/Vite and Node can statically resolve the module.
export * from '../../../node_modules/react/jsx-runtime.js'
export { default } from '../../../node_modules/react/jsx-runtime.js'
