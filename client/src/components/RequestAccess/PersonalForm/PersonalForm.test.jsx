import { vi } from 'vitest'
import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import PersonalForm from './PersonalForm'
import store from '../../../store/store'

// PersonalForm composes PaymentMethod which triggers async updates and
// requires several props. Mock it to a simple stub for this unit test so
// we avoid PropTypes warnings and act() timing issues.
vi.mock('../PaymentMethod/PaymentMethod', () => {
  return {
    __esModule: true,
    default: (props) => <div data-testid="mock-payment-method" {...props} />,
  }
})

const props = {
  handleSubmit: vi.fn(),
  register: vi.fn(),
  errors: {
    fullName: '',
  },
  requestInviteSuccessful: false,
}

const PersonalFormWrapper = () => (
  <Provider store={store}>
    <PersonalForm {...props} />
  </Provider>
)

describe('PersonalForm test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(<PersonalFormWrapper />)
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
