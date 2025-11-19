import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Plans from './Plans'
import store from '../../../store/store'

// Mock tokenValidator to avoid localStorage issues and prevent redirect
vi.mock('../../../store/user', () => ({
  tokenValidator: () => false, // Return false so it doesn't redirect
}))

const PlansWrapper = () => (
  <BrowserRouter>
    <Provider store={store}>
      <Plans />
    </Provider>
  </BrowserRouter>
)

describe('Plans test -', () => {
  it('renders correctly', () => {
    const { container } = render(<PlansWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
