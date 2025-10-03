import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import RequestInviteDialog from './RequestInviteDialog'

vi.mock('./RequestAccess/RequestAccessForm', () => ({
  default: ({ onSuccess }) => (
    <div data-testid="request-access-form">
      <button onClick={onSuccess}>Submit</button>
    </div>
  ),
}))

describe('RequestInviteDialog', () => {
  it('renders the dialog when open is true', () => {
    const mockOnClose = vi.fn()
    
    render(
      <RequestInviteDialog open={true} onClose={mockOnClose} />
    )
    
    expect(screen.getByTestId('request-access-form')).toBeTruthy()
  })

  it('does not render form when open is false', () => {
    const mockOnClose = vi.fn()
    
    render(
      <RequestInviteDialog open={false} onClose={mockOnClose} />
    )
    
    expect(screen.queryByTestId('request-access-form')).toBeNull()
  })

  it('calls onClose after successful form submission', async () => {
    vi.useFakeTimers()
    const mockOnClose = vi.fn()
    
    render(
      <RequestInviteDialog open={true} onClose={mockOnClose} />
    )
    
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)
    
    vi.advanceTimersByTime(3000)
    
    expect(mockOnClose).toHaveBeenCalled()
    
    vi.useRealTimers()
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn()
    
    render(
      <RequestInviteDialog open={true} onClose={mockOnClose} />
    )
    
    const closeButton = screen.getByLabelText('close')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })
})
