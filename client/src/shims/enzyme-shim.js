import * as enzyme from 'enzyme'

// Export configure directly
export const configure = enzyme.configure

// Export wrapped mount/shallow/render which will use the ThemeProvider-wrapped
// implementations when the test setup installs them on global.__WRAPPED_ENZYME.
export const mount = (...args) => ((global.__WRAPPED_ENZYME && global.__WRAPPED_ENZYME.mount) ? global.__WRAPPED_ENZYME.mount(...args) : enzyme.mount(...args))
export const shallow = (...args) => ((global.__WRAPPED_ENZYME && global.__WRAPPED_ENZYME.shallow) ? global.__WRAPPED_ENZYME.shallow(...args) : enzyme.shallow(...args))
export const render = (...args) => ((global.__WRAPPED_ENZYME && global.__WRAPPED_ENZYME.render) ? global.__WRAPPED_ENZYME.render(...args) : enzyme.render(...args))

// Re-export everything else to preserve expected API surface
export * from 'enzyme'

export default enzyme
