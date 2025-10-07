import React from 'react'

// Lightweight mock icon used for tests. Render a simple span with a
// data-testid so it matches existing snapshots that expect a span.
// Forward className and other props so makeStyles-generated classes
// are preserved in snapshots.
export default function MockIcon(props) {
  const { children } = props
  const attrs = { ...props, 'data-testid': props['data-testid'] || 'mui-icon' }
  return React.createElement('span', attrs, children || null)
}
