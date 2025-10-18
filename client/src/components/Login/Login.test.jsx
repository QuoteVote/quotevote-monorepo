import React from 'react'
import { render, act } from '@testing-library/react'
import { vi } from 'vitest'
import { Provider } from 'react-redux'
import store from 'store/store'

// Mock react-hook-form to avoid internal async updates during mount which
// can trigger act() warnings. Use a minimal stub for useForm so tests are
// deterministic.
vi.mock('react-hook-form', () => {
  return {
    useForm: () => ({
      register: () => {},
      handleSubmit: (fn) => (e) => {
        e && e.preventDefault && e.preventDefault()
        return fn()
      },
      errors: {},
      setError: vi.fn(),
      watch: () => true,
    }),
  }
})

// Component being tested
import Login from './Login'

describe('Login test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <Provider store={store}>
          <Login />
        </Provider>,
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })

  it.todo('validate email')
  it.todo('validate password')
  it.todo('submits upon button press')
})
