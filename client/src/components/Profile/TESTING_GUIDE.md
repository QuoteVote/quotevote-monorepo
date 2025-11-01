# Profile Badge Testing Guide

## Manual Testing Checklist

### Visual Testing

#### Desktop (> 960px)
- [ ] Badges display at 48px size
- [ ] Icons display at 28px size
- [ ] Hover effect scales badge to 1.1x
- [ ] Shadow increases on hover
- [ ] Tooltips appear on hover after 200ms delay
- [ ] Multiple badges align horizontally with proper spacing
- [ ] Badges don't overlap with username or follower counts

#### Tablet (600px - 960px)
- [ ] Badges maintain proper sizing
- [ ] Layout adjusts smoothly
- [ ] Touch targets are adequate (minimum 44x44px)
- [ ] Tooltips work on tap

#### Mobile (< 600px)
- [ ] Badges display at 40px size
- [ ] Icons display at 24px size
- [ ] Badges center below username
- [ ] Badges wrap to multiple rows if needed
- [ ] Touch targets are adequate
- [ ] Tooltips work on tap and dismiss properly

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab key navigates to each badge
- [ ] Focus indicator is visible (2px outline)
- [ ] Enter/Space key shows tooltip when focused
- [ ] Escape key dismisses tooltip
- [ ] Tab order is logical (left to right, top to bottom)

#### Screen Reader Testing
Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac):
- [ ] Badge announces label and description
- [ ] Container announces as "User badges list"
- [ ] Badge count is announced
- [ ] Tooltip content is read when activated

#### Color Contrast
Use a contrast checker tool:
- [ ] Contributor badge: Pink (#ea4c89) on white ≥ 4.5:1
- [ ] Verified badge: Blue (#1DA1F2) on white ≥ 4.5:1
- [ ] Moderator badge: Purple (#7C3AED) on white ≥ 4.5:1
- [ ] Top Contributor badge: Amber (#F59E0B) on white ≥ 4.5:1
- [ ] Early Adopter badge: Green (#10B981) on white ≥ 4.5:1
- [ ] White icon on colored background ≥ 4.5:1

### Functional Testing

#### Single Badge
- [ ] Contributor badge displays custom image
- [ ] Verified badge displays Material-UI icon
- [ ] Moderator badge displays Material-UI icon
- [ ] Top Contributor badge displays Material-UI icon
- [ ] Early Adopter badge displays Material-UI icon
- [ ] Tooltip shows correct label and description

#### Multiple Badges
- [ ] All badges display in container
- [ ] Badges have consistent spacing (8px gap)
- [ ] Badges wrap on small screens
- [ ] Each badge has independent tooltip
- [ ] Hover/focus on one badge doesn't affect others

#### Custom Badges
- [ ] Custom label overrides default
- [ ] Custom description overrides default
- [ ] Custom icon URL loads correctly
- [ ] Fallback to default if custom icon fails

### Performance Testing
- [ ] Badges load without delay
- [ ] Hover animations are smooth (60fps)
- [ ] No layout shift when badges load
- [ ] Tooltips don't cause reflow
- [ ] Multiple badges don't impact page performance

### Browser Compatibility
Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Automated Testing

### Running Unit Tests
```bash
cd client
npm test ProfileBadge.test.jsx
```

Expected output:
```
PASS  src/components/Profile/ProfileBadge.test.jsx
  ProfileBadge
    ✓ renders contributor badge with correct label
    ✓ renders verified badge with Material-UI icon
    ✓ renders moderator badge
    ✓ renders top contributor badge
    ✓ renders early adopter badge
    ✓ accepts custom label and description
    ✓ is keyboard accessible with tabIndex
    ✓ has proper ARIA label
  ProfileBadgeContainer
    ✓ renders multiple badges
    ✓ has proper ARIA role for list

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

### Running Storybook
```bash
cd client
npm run storybook
```

Navigate to: **Components → Profile → ProfileBadge**

Test all stories:
- [ ] Contributor
- [ ] Verified
- [ ] Moderator
- [ ] TopContributor
- [ ] EarlyAdopter
- [ ] CustomBadge
- [ ] MultipleBadges
- [ ] AllBadgeTypes
- [ ] ResponsiveLayout
- [ ] AccessibilityFeatures

## Screenshot Capture Guide

### Required Screenshots

#### 1. Desktop View (1920x1080)
**File**: `screenshots/badges-desktop.png`
- Full profile header with badges
- Show hover state on one badge
- Capture tooltip

#### 2. Tablet View (768x1024)
**File**: `screenshots/badges-tablet.png`
- Profile header with badges
- Show responsive layout

#### 3. Mobile View (375x667)
**File**: `screenshots/badges-mobile.png`
- Profile header with badges centered
- Show badge wrapping if multiple

#### 4. Multiple Badges (Desktop)
**File**: `screenshots/badges-multiple.png`
- User with 3-5 badges
- Show all badge types

#### 5. Accessibility Features (Desktop)
**File**: `screenshots/badges-accessibility.png`
- Show focus indicator on badge
- Show tooltip with keyboard focus

#### 6. Badge Showcase Component
**File**: `screenshots/badge-showcase.png`
- BadgeShowcase component with grid layout
- Multiple badges with labels

### Capture Instructions

1. **Start the development server**:
   ```bash
   cd client
   npm run dev
   ```

2. **Navigate to a profile** with badges (or use Storybook)

3. **Open DevTools** (F12)

4. **Set device dimensions**:
   - Desktop: 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x667

5. **Capture screenshots**:
   - Windows: Win+Shift+S
   - Mac: Cmd+Shift+4
   - DevTools: Cmd/Ctrl+Shift+P → "Capture screenshot"

6. **Save to** `screenshots/` directory

7. **Optimize images**:
   ```bash
   # Using ImageOptim or similar
   imageoptim screenshots/*.png
   ```

## Regression Testing

After any changes to badge system, verify:
- [ ] Existing badges still display correctly
- [ ] No visual regressions in ProfileHeader
- [ ] Tooltips still work
- [ ] Accessibility features intact
- [ ] Unit tests pass
- [ ] Storybook stories render correctly

## Known Issues

None currently. Report issues to the frontend team.

## Testing Checklist for PR

Before submitting PR:
- [ ] All unit tests pass
- [ ] Storybook stories render correctly
- [ ] Manual testing completed on 3 screen sizes
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (at least one)
- [ ] Color contrast verified
- [ ] Screenshots captured and optimized
- [ ] Documentation updated
- [ ] No console errors or warnings
