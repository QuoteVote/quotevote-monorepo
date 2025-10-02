import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { AuthModalProvider, useAuthModal } from './AuthModalContext'

// Helper component to test the hook
function TestComponent({ onRender }) {
  const authModal = useAuthModal()
  onRender(authModal)
  return null
}

describe('AuthModalContext', () => {
  it('provides modal state and control functions', () => {
    let hookValue
    
    render(
      <AuthModalProvider>
        <TestComponent onRender={(value) => { hookValue = value }} />
      </AuthModalProvider>
    )

    expect(hookValue.isModalOpen).toBe(false)
    expect(typeof hookValue.openAuthModal).toBe('function')
    expect(typeof hookValue.closeAuthModal).toBe('function')
  })

  it('opens modal when openAuthModal is called', () => {
    let hookValue
    
    const { rerender } = render(
      <AuthModalProvider>
        <TestComponent onRender={(value) => { hookValue = value }} />
      </AuthModalProvider>
    )

    hookValue.openAuthModal()
    
    // Force re-render to get updated value
    rerender(
      <AuthModalProvider>
        <TestComponent onRender={(value) => { hookValue = value }} />
      </AuthModalProvider>
    )

    expect(hookValue.isModalOpen).toBe(true)
  })

  it('closes modal when closeAuthModal is called', () => {
    let hookValue
    
    const { rerender } = render(
      <AuthModalProvider>
        <TestComponent onRender={(value) => { hookValue = value }} />
      </AuthModalProvider>
    )

    // First open the modal
    hookValue.openAuthModal()
    rerender(
      <AuthModalProvider>
        <TestComponent onRender={(value) => { hookValue = value }} />
      </AuthModalProvider>
    )
    expect(hookValue.isModalOpen).toBe(true)

    // Then close it
    hookValue.closeAuthModal()
    rerender(
      <AuthModalProvider>
        <TestComponent onRender={(value) => { hookValue = value }} />
      </AuthModalProvider>
    )
    expect(hookValue.isModalOpen).toBe(false)
  })

  it('throws error when useAuthModal is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = vi.fn()

    expect(() => {
      render(<TestComponent onRender={() => {}} />)
    }).toThrow('useAuthModal must be used within an AuthModalProvider')

    console.error = originalError
  })
})
