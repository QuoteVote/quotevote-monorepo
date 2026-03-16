import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react'
import {
  vi, describe, it, beforeEach, expect,
} from 'vitest'
import { USER_LOGIN_SUCCESS } from 'store/user'
import MagicLoginPage from './MagicLoginPage'

let mockSearch = ''
const mockPush = vi.fn()
const mockDispatch = vi.fn()
const mockQuery = vi.fn()

vi.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
  useLocation: () => ({ search: mockSearch }),
}))

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

vi.mock('@apollo/react-hooks', () => ({
  useApolloClient: () => ({ query: mockQuery }),
}))

describe('MagicLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearch = ''
  })

  it('shows error when token is missing', async () => {
    render(<MagicLoginPage />)

    expect(await screen.findByText('No login token provided.')).toBeTruthy()
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('shows invalid token error when verification returns no user', async () => {
    mockSearch = '?token=bad-token'
    mockQuery.mockResolvedValueOnce({
      data: { verifyUserPasswordResetToken: null },
    })

    render(<MagicLoginPage />)

    await waitFor(() => {
      expect(screen.getByText('Invalid or expired login link.')).toBeTruthy()
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'bad-token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })

  it('dispatches login success and redirects on valid token', async () => {
    mockSearch = '?token=good-token'
    const user = { _id: 'u-1', username: 'tester' }
    mockQuery.mockResolvedValueOnce({
      data: { verifyUserPasswordResetToken: user },
    })

    render(<MagicLoginPage />)

    await waitFor(() => {
      expect(screen.getByText("You're in! Redirecting...")).toBeTruthy()
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'good-token')
    expect(mockDispatch).toHaveBeenCalledWith(
      USER_LOGIN_SUCCESS({ data: user, loading: false, loginError: null }),
    )

    await new Promise((resolve) => {
      setTimeout(resolve, 1100)
    })

    expect(mockPush).toHaveBeenCalledWith('/search')
  })

  it('shows expired message when query rejects with expired error', async () => {
    mockSearch = '?token=expired-token'
    mockQuery.mockRejectedValueOnce(new Error('token expired'))

    render(<MagicLoginPage />)

    await waitFor(() => {
      expect(
        screen.getByText(
          'This login link has expired. Please request a new one.',
        ),
      ).toBeTruthy()
    })

    fireEvent.click(screen.getByText('Go to Login'))
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })
})
