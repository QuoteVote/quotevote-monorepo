import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import ProfileBadge, { ProfileBadgeContainer } from './ProfileBadge'

describe('ProfileBadge', () => {
  it('renders contributor badge with correct label', () => {
    const { container } = render(<ProfileBadge type="contributor" />)
    const badge = container.querySelector('[aria-label*="Founder Badge"]')
    expect(badge).toBeTruthy()
  })

  it('renders verified badge with Material-UI icon', () => {
    render(<ProfileBadge type="verified" />)
    const badge = screen.getByRole('img', { name: /Verified User/i })
    expect(badge).toBeTruthy()
  })

  it('renders moderator badge', () => {
    render(<ProfileBadge type="moderator" />)
    const badge = screen.getByRole('img', { name: /Moderator/i })
    expect(badge).toBeTruthy()
  })

  it('renders top contributor badge', () => {
    render(<ProfileBadge type="topContributor" />)
    const badge = screen.getByRole('img', { name: /Top Contributor/i })
    expect(badge).toBeTruthy()
  })

  it('renders early adopter badge', () => {
    render(<ProfileBadge type="earlyAdopter" />)
    const badge = screen.getByRole('img', { name: /Early Adopter/i })
    expect(badge).toBeTruthy()
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
    expect(badge).toBeTruthy()
  })

  it('is keyboard accessible with tabIndex', () => {
    const { container } = render(<ProfileBadge type="contributor" />)
    const badge = container.querySelector('[role="img"]')
    expect(badge.getAttribute('tabIndex')).toBe('0')
  })

  it('has proper ARIA label', () => {
    const { container } = render(<ProfileBadge type="verified" />)
    const badge = container.querySelector('[role="img"]')
    expect(badge.getAttribute('aria-label')).toBeTruthy()
    expect(badge.getAttribute('aria-label')).toContain('Verified User')
  })
})

describe('ProfileBadgeContainer', () => {
  it('renders multiple badges', () => {
    const { container } = render(
      <ProfileBadgeContainer>
        <ProfileBadge type="contributor" />
        <ProfileBadge type="verified" />
        <ProfileBadge type="moderator" />
      </ProfileBadgeContainer>
    )
    
    expect(container.querySelector('[aria-label*="Founder Badge"]')).toBeTruthy()
    expect(container.querySelector('[aria-label*="Verified User"]')).toBeTruthy()
    expect(container.querySelector('[aria-label*="Moderator"]')).toBeTruthy()
  })

  it('has proper ARIA role for list', () => {
    const { container } = render(
      <ProfileBadgeContainer>
        <ProfileBadge type="contributor" />
      </ProfileBadgeContainer>
    )
    
    const list = container.querySelector('[role="list"]')
    expect(list).toBeTruthy()
    expect(list.getAttribute('aria-label')).toBe('User badges')
  })
})
