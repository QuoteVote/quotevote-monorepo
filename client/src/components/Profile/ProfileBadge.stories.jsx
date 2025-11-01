import React from 'react'
import ProfileBadge, { ProfileBadgeContainer } from './ProfileBadge'

export default {
  title: 'Components/Profile/ProfileBadge',
  component: ProfileBadge,
  parameters: {
    docs: {
      description: {
        component: 'Profile badges display user achievements, roles, and contributions with accessible tooltips.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['contributor', 'verified', 'moderator', 'topContributor', 'earlyAdopter'],
      description: 'The type of badge to display',
    },
    customLabel: {
      control: 'text',
      description: 'Custom label for the badge tooltip',
    },
    customDescription: {
      control: 'text',
      description: 'Custom description for the badge tooltip',
    },
  },
}

// Template for single badge
const Template = (args) => <ProfileBadge {...args} />

// Individual badge stories
export const Contributor = Template.bind({})
Contributor.args = {
  type: 'contributor',
}
Contributor.parameters = {
  docs: {
    description: {
      story: 'Founder badge for early contributors and supporters',
    },
  },
}

export const Verified = Template.bind({})
Verified.args = {
  type: 'verified',
}
Verified.parameters = {
  docs: {
    description: {
      story: 'Verified user badge for authenticated community members',
    },
  },
}

export const Moderator = Template.bind({})
Moderator.args = {
  type: 'moderator',
}
Moderator.parameters = {
  docs: {
    description: {
      story: 'Moderator badge for community moderators',
    },
  },
}

export const TopContributor = Template.bind({})
TopContributor.args = {
  type: 'topContributor',
}
TopContributor.parameters = {
  docs: {
    description: {
      story: 'Top contributor badge for exceptional community members',
    },
  },
}

export const EarlyAdopter = Template.bind({})
EarlyAdopter.args = {
  type: 'earlyAdopter',
}
EarlyAdopter.parameters = {
  docs: {
    description: {
      story: 'Early adopter badge for users who joined in the early days',
    },
  },
}

export const CustomBadge = Template.bind({})
CustomBadge.args = {
  type: 'contributor',
  customLabel: 'Custom Achievement',
  customDescription: 'This is a custom badge with a custom description',
}
CustomBadge.parameters = {
  docs: {
    description: {
      story: 'Badge with custom label and description',
    },
  },
}

// Multiple badges story
export const MultipleBadges = () => (
  <ProfileBadgeContainer>
    <ProfileBadge type="contributor" />
    <ProfileBadge type="verified" />
    <ProfileBadge type="moderator" />
  </ProfileBadgeContainer>
)
MultipleBadges.parameters = {
  docs: {
    description: {
      story: 'Multiple badges displayed together in a container',
    },
  },
}

// All badge types
export const AllBadgeTypes = () => (
  <ProfileBadgeContainer>
    <ProfileBadge type="contributor" />
    <ProfileBadge type="verified" />
    <ProfileBadge type="moderator" />
    <ProfileBadge type="topContributor" />
    <ProfileBadge type="earlyAdopter" />
  </ProfileBadgeContainer>
)
AllBadgeTypes.parameters = {
  docs: {
    description: {
      story: 'All available badge types displayed together',
    },
  },
}

// Responsive layout story
export const ResponsiveLayout = () => (
  <div style={{ maxWidth: '400px', padding: '20px', border: '1px solid #ccc' }}>
    <h3>Mobile View (400px)</h3>
    <ProfileBadgeContainer>
      <ProfileBadge type="contributor" />
      <ProfileBadge type="verified" />
      <ProfileBadge type="moderator" />
      <ProfileBadge type="topContributor" />
    </ProfileBadgeContainer>
  </div>
)
ResponsiveLayout.parameters = {
  docs: {
    description: {
      story: 'Badges adapt to smaller screen sizes with responsive layout',
    },
  },
}

// Accessibility demonstration
export const AccessibilityFeatures = () => (
  <div>
    <h3>Keyboard Navigation</h3>
    <p>Tab through the badges below and press Enter to see tooltips:</p>
    <ProfileBadgeContainer>
      <ProfileBadge type="contributor" />
      <ProfileBadge type="verified" />
      <ProfileBadge type="moderator" />
    </ProfileBadgeContainer>
    <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
      <strong>Accessibility features:</strong>
      <ul>
        <li>Keyboard accessible (Tab navigation)</li>
        <li>ARIA labels for screen readers</li>
        <li>Focus indicators</li>
        <li>Descriptive tooltips</li>
        <li>High contrast colors (WCAG AA compliant)</li>
      </ul>
    </p>
  </div>
)
AccessibilityFeatures.parameters = {
  docs: {
    description: {
      story: 'Demonstrates accessibility features including keyboard navigation and ARIA labels',
    },
  },
}
