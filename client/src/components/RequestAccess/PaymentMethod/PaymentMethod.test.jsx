import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import PaymentMethod from './PaymentMethod'
import store from '../../../store/store'

const props = {
  cardDetails: { brand: 'visa', last4: '4242' },
  setCardDetails: () => {},
  isContinued: false,
  onSubmit: () => {},
}

const PaymentMethodWrapper = () => (
  <Provider store={store}>
    <PaymentMethod {...props} />
  </Provider>
)

describe('PaymentMethod test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(<PaymentMethodWrapper />)
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
