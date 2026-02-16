import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: !!error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.log('Something went wrong!', { error, errorInfo })
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props
    const { hasError } = this.state
    if (hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            This page could not be loaded. It may have been removed or does not exist.
          </p>
          <a href="/" style={{ color: '#00bcd4' }}>Go to homepage</a>
        </div>
      )
    }

    // eslint-disable-next-line react/prop-types
    return children
  }
}

export default ErrorBoundary
