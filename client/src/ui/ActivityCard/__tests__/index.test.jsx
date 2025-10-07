import React from 'react'
import { render } from '@testing-library/react'

import { ActivityCard } from '..'

describe('<ActivityCard  />', () => {
  it('renders date and time tokens', () => {
    // Provide a deterministic ISO date so moment output is stable
    const isoDate = new Date('2023-01-02T22:54:00Z').toISOString()
    const { container } = render(<ActivityCard date={isoDate} />)
    const text = container.textContent || ''
    // Expect a month token and an @ time separator to be present
    expect(text).toContain('Jan')
    expect(text).toContain('@')
  })
})
