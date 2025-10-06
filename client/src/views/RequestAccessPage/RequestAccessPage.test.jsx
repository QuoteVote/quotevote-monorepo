import React from 'react'
import { render } from '@testing-library/react'
import RequestAccessPage from './RequestAccessPage'

describe('RequestAccessPage', () => {
  it('renders correctly', () => {
    const { container } = render(<RequestAccessPage />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import RequestAccessPage from './RequestAccessPage'
import store from '../../store/store'

const RequestAccessPageWrapper = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <RequestAccessPage />
    </Provider>
  </ApolloProvider>
)

describe('Request Access Page test -', () => {
  it('renders correctly', () => {
    const { container } = render(<RequestAccessPageWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
