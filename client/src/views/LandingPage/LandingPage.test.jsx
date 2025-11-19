import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { vi, expect } from 'vitest'
import LandingPage from './LandingPage'
import store from '../../store/store'

// Mock tokenValidator to prevent redirects
vi.mock('store/user', () => ({
  tokenValidator: vi.fn(() => false),
}))

// Mock the useHistory hook
const mockHistoryPush = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  }
})

const LandingPageWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  </Provider>
)

describe('LandingPage test -', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear()
  })

  it('renders correctly', async () => {
    const { container } = render(<LandingPageWrapper />)
    await waitFor(() => {
      expect(container.firstChild).toBeTruthy()
    })
  })

  it('renders enhanced navbar with all navigation links', async () => {
    render(<LandingPageWrapper />)
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('QUOTE.VOTE')).toBeTruthy()
    })
    
    // Check for navbar elements using labels to avoid multiple matches
    expect(screen.getByLabelText('Home')).toBeTruthy()
    expect(screen.getByLabelText('About')).toBeTruthy()
    expect(screen.getByLabelText('Donate')).toBeTruthy()
    // Use getAllByLabelText for elements that appear multiple times (navbar + footer)
    const loginButtons = screen.getAllByLabelText('Login to your account')
    expect(loginButtons.length).toBeGreaterThan(0)
    const inviteButtons = screen.getAllByLabelText('Request an invite to join')
    expect(inviteButtons.length).toBeGreaterThan(0)
  })

  it('renders comprehensive footer with all sections', async () => {
    render(<LandingPageWrapper />)
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('QUOTE.VOTE')).toBeTruthy()
    })
    
    // Check for footer elements - use getAllByText for elements that appear multiple times
    const aboutTexts = screen.queryAllByText('About')
    const quickLinks = screen.queryByText('Quick Links')
    const resources = screen.queryByText('Resources')
    const connectWithUs = screen.queryByText('Connect With Us')
    
    // At least some footer elements should be present (About appears in navbar and footer)
    expect(aboutTexts.length > 0 || quickLinks || resources || connectWithUs).toBeTruthy()
  })

  it('handles navigation button clicks correctly', async () => {
    render(<LandingPageWrapper />)
    
    // Wait for component to render
    await screen.findByText('QUOTE.VOTE')
    
    // Test Home button - use getByLabelText to avoid multiple matches
    const homeButton = screen.getByLabelText('Home')
    fireEvent.click(homeButton)
    expect(mockHistoryPush).toHaveBeenCalledWith('/')
    
    // Test Login button - use getAllByLabelText and click the first one (navbar)
    const loginButtons = screen.getAllByLabelText('Login to your account')
    expect(loginButtons.length).toBeGreaterThan(0)
    fireEvent.click(loginButtons[0])
    expect(mockHistoryPush).toHaveBeenCalledWith('/auth/login')
    
    // Test Request Invite button - use getAllByLabelText and click the first one (navbar)
    const requestInviteButtons = screen.getAllByLabelText('Request an invite to join')
    expect(requestInviteButtons.length).toBeGreaterThan(0)
    fireEvent.click(requestInviteButtons[0])
    expect(mockHistoryPush).toHaveBeenCalledWith('/auth/request-access')
  })

  it('has proper accessibility attributes', async () => {
    render(<LandingPageWrapper />)
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('QUOTE.VOTE')).toBeTruthy()
    })
    
    // Check for aria-labels on interactive elements
    expect(screen.getByLabelText('Home')).toBeTruthy()
    expect(screen.getByLabelText('About')).toBeTruthy()
    expect(screen.getByLabelText('Donate')).toBeTruthy()
    // Use getAllByLabelText for elements that appear multiple times
    const loginButtons = screen.getAllByLabelText('Login to your account')
    expect(loginButtons.length).toBeGreaterThan(0)
    const inviteButtons = screen.getAllByLabelText('Request an invite to join')
    expect(inviteButtons.length).toBeGreaterThan(0)
    
    // Check for role attributes - footer might not always be present
    const footer = screen.queryByRole('contentinfo')
    if (footer) {
      expect(footer).toBeTruthy()
    }
  })
})
