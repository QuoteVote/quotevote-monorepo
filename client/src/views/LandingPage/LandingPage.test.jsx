import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import LandingPage from './LandingPage'
import store from '../../store/store'

const LandingPageWrapper = () => (
  <Provider store={store}>
    <LandingPage />
  </Provider>
)

describe('LandingPage test -', () => {
  it('renders correctly', () => {
    const { container } = render(<LandingPageWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
