import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react'
import {
  vi, beforeEach, describe, it, expect,
} from 'vitest'
import EyebrowBar from './EyebrowBar'

const mockPush = vi.fn()
const mockQuery = vi.fn()
const mockRequestUserAccess = vi.fn()
const mockSendMagicLink = vi.fn()
const mockSendOnboardingLink = vi.fn()
const mockUseSelector = vi.fn()

vi.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
}))

vi.mock('react-redux', () => ({
  useSelector: (selector) => mockUseSelector(selector),
}))

vi.mock('@apollo/react-hooks', () => ({
  useApolloClient: () => ({ query: mockQuery }),
  useMutation: (mutation) => {
    const source = String(mutation?.loc?.source?.body || '')
    if (source.includes('sendMagicLoginLink')) {
      return [mockSendMagicLink]
    }
    if (source.includes('sendOnboardingCompletionLink')) {
      return [mockSendOnboardingLink]
    }
    return [mockRequestUserAccess]
  },
}))

describe('EyebrowBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSelector.mockImplementation((selector) => selector({ user: { data: {} } }),)
    mockQuery.mockResolvedValue({
      data: { checkEmailStatus: { status: 'not_requested' } },
    })
    mockRequestUserAccess.mockResolvedValue({ data: {} })
    mockSendMagicLink.mockResolvedValue({
      data: {
        sendMagicLoginLink: {
          success: true,
          message: 'Login link sent! Check your email.',
        },
      },
    })
    mockSendOnboardingLink.mockResolvedValue({
      data: {
        sendOnboardingCompletionLink: {
          success: true,
          message: 'Onboarding link sent! Check your email.',
        },
      },
    })
  })

  it('does not render for authenticated users', () => {
    mockUseSelector.mockImplementation((selector) => selector({ user: { data: { _id: 'user-1' } } }),)
    const { container } = render(<EyebrowBar />)
    expect(container.firstChild).toBeNull()
  })

  it('shows validation error for invalid email', async () => {
    render(<EyebrowBar />)

    fireEvent.click(screen.getByText('Continue'))

    expect(
      await screen.findByText('Please enter a valid email address.'),
    ).toBeTruthy()
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('shows not requested feedback after requesting invite', async () => {
    render(<EyebrowBar />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'newuser@example.com' },
    })
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(mockRequestUserAccess).toHaveBeenCalledWith({
        variables: { requestUserAccessInput: { email: 'newuser@example.com' } },
      })
    })

    expect(
      await screen.findByText(
        "Your request has been received! You'll be notified once approved.",
      ),
    ).toBeTruthy()
  })

  it('shows registered flow and sends magic link', async () => {
    mockQuery.mockResolvedValueOnce({
      data: { checkEmailStatus: { status: 'registered' } },
    })
    render(<EyebrowBar />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'existing@example.com' },
    })
    fireEvent.click(screen.getByText('Continue'))

    expect(await screen.findByText('We recognize this email.')).toBeTruthy()

    fireEvent.click(screen.getByText('Send me a login link'))

    await waitFor(() => {
      expect(mockSendMagicLink).toHaveBeenCalledWith({
        variables: { email: 'existing@example.com' },
      })
    })

    expect(
      await screen.findByText('Login link sent! Check your email.'),
    ).toBeTruthy()
  })

  it('falls back to onboarding when magic link mutation reports incomplete signup', async () => {
    mockQuery.mockResolvedValueOnce({
      data: { checkEmailStatus: { status: 'registered' } },
    })
    mockSendMagicLink.mockResolvedValueOnce({
      data: {
        sendMagicLoginLink: {
          success: false,
          message: 'This account has not completed signup yet.',
        },
      },
    })

    render(<EyebrowBar />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'existing@example.com' },
    })
    fireEvent.click(screen.getByText('Continue'))

    expect(await screen.findByText('We recognize this email.')).toBeTruthy()

    fireEvent.click(screen.getByText('Send me a login link'))

    expect(await screen.findByText('Your invite is approved!')).toBeTruthy()
  })

  it("opens onboarding modal when user is 'approved_no_password'", async () => {
    mockQuery.mockResolvedValueOnce({
      data: { checkEmailStatus: { status: 'approved_no_password' } },
    })
    render(<EyebrowBar />)

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'approved@example.com' },
    })
    fireEvent.click(screen.getByText('Continue'))

    expect(await screen.findByText('Your invite is approved!')).toBeTruthy()
    expect(screen.getByText('Send me a link to finish onboarding')).toBeTruthy()

    fireEvent.click(screen.getByText('Send me a link to finish onboarding'))

    await waitFor(() => {
      expect(mockSendOnboardingLink).toHaveBeenCalledWith({
        variables: { email: 'approved@example.com' },
      })
    })

    expect(
      await screen.findByText('Onboarding link sent! Check your email.'),
    ).toBeTruthy()
  })

  it('dismisses the eyebrow bar', async () => {
    render(<EyebrowBar />)

    fireEvent.click(screen.getByLabelText('Close banner'))

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter your email')).toBeNull()
    })
  })
})
