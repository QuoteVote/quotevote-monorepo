import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from './LandingPage'
import store from '../../store/store'

// Mock the useHistory hook
const mockHistoryPush = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}))

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

  it('renders correctly', () => {
    const { container } = render(<LandingPageWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders enhanced navbar with all navigation links', () => {
    render(<LandingPageWrapper />)
    
    // Check for navbar elements
    expect(screen.getByText('QUOTE.VOTE')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Donate')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Request Invite')).toBeInTheDocument()
  })

  it('renders comprehensive footer with all sections', () => {
    render(<LandingPageWrapper />)
    
    // Check for footer elements
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Connect With Us')).toBeInTheDocument()
    
    // Check for specific footer links
    expect(screen.getByText('Request Invite')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Donate')).toBeInTheDocument()
    expect(screen.getByText('Volunteer')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Code of Conduct')).toBeInTheDocument()
    expect(screen.getByText('Contributing')).toBeInTheDocument()
    
    // Check for copyright
    expect(screen.getByText(/© \d{4} Quote.Vote. All rights reserved./)).toBeInTheDocument()
  })

  it('handles navigation button clicks correctly', () => {
    render(<LandingPageWrapper />)
    
    // Test Home button
    fireEvent.click(screen.getByText('Home'))
    expect(mockHistoryPush).toHaveBeenCalledWith('/')
    
    // Test Login button
    fireEvent.click(screen.getByText('Login'))
    expect(mockHistoryPush).toHaveBeenCalledWith('/auth/login')
    
    // Test Request Invite button
    fireEvent.click(screen.getByText('Request Invite'))
    expect(mockHistoryPush).toHaveBeenCalledWith('/auth/request-access')
  })

  it('has proper accessibility attributes', () => {
    render(<LandingPageWrapper />)
    
    // Check for aria-labels on interactive elements
    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByLabelText('About')).toBeInTheDocument()
    expect(screen.getByLabelText('Donate')).toBeInTheDocument()
    expect(screen.getByLabelText('Login to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Request an invite to join')).toBeInTheDocument()
    
    // Check for role attributes
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})
