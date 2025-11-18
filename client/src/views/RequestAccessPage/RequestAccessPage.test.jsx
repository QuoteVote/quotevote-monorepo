import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'
import RequestAccessPage from './RequestAccessPage'
import store from '../../store/store'

const RequestAccessPageWrapper = () => (
  <MockedProvider mocks={[]} addTypename={false}>
    <Provider store={store}>
      <BrowserRouter>
        <RequestAccessPage />
      </BrowserRouter>
    </Provider>
  </MockedProvider>
)

describe('Request Access Page test -', () => {
  it('renders correctly', () => {
    const { container } = render(<RequestAccessPageWrapper />)
    expect(container.firstChild).toBeTruthy()
  })
})
