import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfileBadge, { ProfileBadgeContainer } from './ProfileBadge'

describe('ProfileBadge', () => {
  it('renders contributor badge with correct label', () => {
    render(<ProfileBadge type="contributor" />)
    const badge = screen.getByRole('img', { name: /Founder Badge/i })
    expect(badge).toBeInTheDocument()
  })

  it('renders verified badge with Material-UI icon', () => {
    render(<ProfileBadge type="verified" />)
    const badge = screen.getByRole('img', { name: /Verified User/i })
    expect(badge).toBeInTheDocument()
  })

  it('renders moderator badge', () => {
    render(<ProfileBadge type="moderator" />)
    const badge = screen.getByRole('img', { name: /Moderator/i })
    expect(badge).toBeInTheDocument()
  })

  it('renders top contributor badge', () => {
    render(<ProfileBadge type="topContributor" />)
    const badge = screen.getByRole('img', { name: /Top Contributor/i })
    expect(badge).toBeInTheDocument()
  })

  it('renders early adopter badge', () => {
    render(<ProfileBadge type="earlyAdopter" />)
    const badge = screen.getByRole('img', { name: /Early Adopter/i })
    expect(badge).toBeInTheDocument()
  })

  it('accepts custom label and description', () => {
    render(
      <ProfileBadge
        type="contributor"
        customLabel="Custom Badge"
        customDescription="Custom description text"
      />
    )
    const badge = screen.getByRole('img', { name: /Custom Badge.*Custom description text/i })
    expect(badge).toBeInTheDocument()
  })

  it('is keyboard accessible with tabIndex', () => {
    render(<ProfileBadge type="contributor" />)
    const badge = screen.getByRole('img')
    expect(badge).toHaveAttribute('tabIndex', '0')
  })

  it('has proper ARIA label', () => {
    render(<ProfileBadge type="verified" />)
    const badge = screen.getByRole('img')
    expect(badge).toHaveAttribute('aria-label')
    expect(badge.getAttribute('aria-label')).toContain('Verified User')
  })
})

describe('ProfileBadgeContainer', () => {
  it('renders multiple badges', () => {
    render(
      <ProfileBadgeContainer>
        <ProfileBadge type="contributor" />
        <ProfileBadge type="verified" />
        <ProfileBadge type="moderator" />
      </ProfileBadgeContainer>
    )
    
    expect(screen.getByRole('img', { name: /Founder Badge/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Verified User/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Moderator/i })).toBeInTheDocument()
  })

  it('has proper ARIA role for list', () => {
    const { container } = render(
      <ProfileBadgeContainer>
        <ProfileBadge type="contributor" />
      </ProfileBadgeContainer>
    )
    
    const list = container.querySelector('[role="list"]')
    expect(list).toBeInTheDocument()
    expect(list).toHaveAttribute('aria-label', 'User badges')
  })
})
