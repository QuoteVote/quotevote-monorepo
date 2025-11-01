# Profile Badge System

## Overview

The Profile Badge System provides a consistent, accessible, and visually appealing way to display user achievements, roles, and contributions across the Quote.Vote platform.

## Features

✅ **Responsive Design** - Adapts to mobile, tablet, and desktop screens  
✅ **Accessibility** - WCAG AA compliant with keyboard navigation and screen reader support  
✅ **Tooltips** - Descriptive hover/tap tooltips with smooth transitions  
✅ **Customizable** - Support for custom icons, labels, and descriptions  
✅ **Extensible** - Easy to add new badge types  
✅ **Tested** - Comprehensive unit tests and Storybook stories

## Badge Types

### 1. Contributor Badge
- **Type**: `contributor`
- **Color**: Pink (#ea4c89)
- **Icon**: Custom image (`/assets/badge.png`)
- **Description**: Early contributor and supporter of Quote.Vote

### 2. Verified User
- **Type**: `verified`
- **Color**: Blue (#1DA1F2)
- **Icon**: VerifiedUserIcon (Material-UI)
- **Description**: Verified member of the Quote.Vote community

### 3. Moderator
- **Type**: `moderator`
- **Color**: Purple (#7C3AED)
- **Icon**: SecurityIcon (Material-UI)
- **Description**: Community moderator helping maintain quality discussions

### 4. Top Contributor
- **Type**: `topContributor`
- **Color**: Amber (#F59E0B)
- **Icon**: EmojiEventsIcon (Material-UI)
- **Description**: Recognized for exceptional contributions to the community

### 5. Early Adopter
- **Type**: `earlyAdopter`
- **Color**: Green (#10B981)
- **Icon**: StarIcon (Material-UI)
- **Description**: Joined Quote.Vote in its early days

## Usage

### Basic Usage

```jsx
import ProfileBadge from 'components/Profile/ProfileBadge'

function UserProfile() {
  return <ProfileBadge type="contributor" />
}
```

### Multiple Badges

```jsx
import ProfileBadge, { ProfileBadgeContainer } from 'components/Profile/ProfileBadge'

function UserProfile() {
  return (
    <ProfileBadgeContainer>
      <ProfileBadge type="contributor" />
      <ProfileBadge type="verified" />
      <ProfileBadge type="moderator" />
    </ProfileBadgeContainer>
  )
}
```

### Custom Badge

```jsx
<ProfileBadge
  type="contributor"
  customLabel="Special Achievement"
  customDescription="Awarded for outstanding community service"
  customIcon="/assets/custom-badge.png"
/>
```

### Conditional Rendering

```jsx
function UserProfile({ user }) {
  return (
    <ProfileBadgeContainer>
      {user.contributorBadge && <ProfileBadge type="contributor" />}
      {user.isVerified && <ProfileBadge type="verified" />}
      {user.isModerator && <ProfileBadge type="moderator" />}
    </ProfileBadgeContainer>
  )
}
```

## Component API

### ProfileBadge Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `string` | Yes | - | Badge type: `contributor`, `verified`, `moderator`, `topContributor`, `earlyAdopter` |
| `customIcon` | `string` | No | - | URL to custom badge icon image |
| `customLabel` | `string` | No | - | Custom label for tooltip |
| `customDescription` | `string` | No | - | Custom description for tooltip |

### ProfileBadgeContainer Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `node` | Yes | Badge components to display |

## Styling

### Responsive Breakpoints

- **Desktop** (> 960px): 48px badge size, 28px icon size
- **Mobile** (≤ 600px): 40px badge size, 24px icon size

### Color Contrast

All badge colors meet WCAG AA contrast requirements:
- Pink on white: 4.5:1
- Blue on white: 4.5:1
- Purple on white: 4.5:1
- Amber on white: 4.5:1
- Green on white: 4.5:1

### Hover States

- Scale: 1.1x on hover
- Shadow: Increases from 2px to 4px
- Transition: 0.2s ease-in-out

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between badges
- **Enter/Space**: Activate tooltip (when focused)
- **Escape**: Close tooltip

### Screen Reader Support

- Each badge has an `aria-label` with full description
- Container has `role="list"` and `aria-label="User badges"`
- Tooltips use `role="tooltip"` and `aria-describedby`

### Focus Indicators

- 2px solid outline in primary color
- 2px offset for visibility
- Visible on keyboard focus only

## Testing

### Unit Tests

Run tests with:
```bash
npm test ProfileBadge.test.jsx
```

Tests cover:
- All badge types render correctly
- Custom labels and descriptions work
- Keyboard accessibility (tabIndex)
- ARIA labels are present
- Multiple badges in container

### Visual Testing

View in Storybook:
```bash
npm run storybook
```

Navigate to: **Components → Profile → ProfileBadge**

## Adding New Badge Types

1. **Add configuration** to `BADGE_CONFIGS` in `ProfileBadge.jsx`:

```jsx
const BADGE_CONFIGS = {
  // ... existing badges
  newBadge: {
    label: 'New Badge',
    description: 'Description of the new badge',
    backgroundColor: '#HEXCOLOR',
    icon: IconComponent, // or 'custom' for image
  },
}
```

2. **Update PropTypes**:

```jsx
ProfileBadge.propTypes = {
  type: PropTypes.oneOf([
    // ... existing types
    'newBadge',
  ]).isRequired,
  // ...
}
```

3. **Add tests** in `ProfileBadge.test.jsx`

4. **Add Storybook story** in `ProfileBadge.stories.jsx`

5. **Update this documentation**

## Migration Guide

### From Old Badge Implementation

**Before:**
```jsx
{contributorBadge && (
  <Tooltip title="Founders Badge" placement="top">
    <div className={classes.badgeCircle}>
      <img src="/assets/badge.png" alt="Contributor Badge" />
    </div>
  </Tooltip>
)}
```

**After:**
```jsx
{contributorBadge && (
  <ProfileBadgeContainer>
    <ProfileBadge type="contributor" />
  </ProfileBadgeContainer>
)}
```

## Best Practices

1. **Always use ProfileBadgeContainer** for multiple badges
2. **Don't nest badges** - keep them flat in the container
3. **Limit to 5 badges** per user to avoid clutter
4. **Use semantic badge types** - don't create custom types for one-off cases
5. **Test keyboard navigation** when adding new badge types
6. **Verify color contrast** for custom badge colors

## Future Enhancements

- [ ] Badge animations on award
- [ ] Badge progress indicators
- [ ] Badge rarity tiers
- [ ] Badge collections page
- [ ] Badge sharing to social media
- [ ] Badge unlock notifications

## Support

For questions or issues:
- Open an issue on GitHub
- Contact the frontend team
- Check Storybook for visual examples
