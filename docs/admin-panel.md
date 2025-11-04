# Admin Panel Documentation

## Overview

The Admin Panel (formerly "Invite Control Panel") is a comprehensive administrative interface for Quote.Vote that provides tools for managing user invitations, featured posts, user management, and platform statistics. The panel has been redesigned with a focus on mobile responsiveness and improved user experience.

## Accessing the Admin Panel

### Requirements
- User must have `admin: true` role in their user profile
- Authentication required

### Access Methods

#### 1. Via Settings Page
For users with admin privileges, an **Admin Panel** button with a Security shield icon appears in the Settings page footer.

**Location**: Settings → Bottom navigation bar → "Admin" button

#### 2. Direct URL
Navigate directly to: `/ControlPanel`

**Note**: Non-admin users attempting to access this route will see an "Unauthorized" message.

## Features

### 1. User Invitation Requests

Manage user invitation requests with full CRUD operations.

**Features:**
- View all pending, accepted, and declined invitation requests
- Sort by email, joined date, or status
- Search/filter by email address
- Accept, decline, or reset invitation status
- Resend invitations to accepted users

**Mobile Optimizations:**
- Shortened email display (truncated to 20 characters on mobile)
- Compact date format (MM/DD/YY on mobile vs MMM DD, YYYY on desktop)
- Stacked action buttons on small screens
- Horizontal scrolling for table overflow

### 2. Statistics

Visual analytics dashboard showing platform growth and user metrics.

**Metrics Displayed:**
- Total users count
- Pending invitation requests count
- Active users today (placeholder)
- Monthly user growth chart (line graph)

**Mobile Optimizations:**
- Responsive chart sizing
- Smaller font sizes for labels
- Adjusted padding and margins

### 3. Featured Posts

Manage which posts appear in featured slots across the platform.

**Features:**
- View top posts with filtering capability
- Assign posts to featured slots (1-12)
- Update or remove featured assignments
- Visual highlighting of currently featured posts
- Prevent slot conflicts (one post per slot)

**Mobile Optimizations:**
- Hide Post ID column on mobile
- Truncate post titles (30 characters on mobile)
- Hide summary column on mobile
- Smaller select dropdowns
- Compact action buttons

### 4. User Management

Manage user roles and badges.

**Features:**
- View all registered users
- Toggle contributor badge status
- View user ID, username, and name

**Mobile Optimizations:**
- Hide User ID column on mobile
- Shortened column header ("Badge" vs "Contributor Badge")
- Compact table cells with ellipsis for overflow

## UI/UX Improvements

### Responsive Design

#### Desktop (≥960px)
- Full-width tabs
- All table columns visible
- Larger buttons and text
- Spacious padding

#### Tablet (600px - 959px)
- Scrollable tabs
- Reduced padding
- Medium-sized elements

#### Mobile (<600px)
- Scrollable tabs with shortened labels
  - "Invites" instead of "User Invitation Requests"
  - "Featured" instead of "Featured Posts"
  - "Users" instead of "User Management"
- Hidden non-essential columns
- Truncated text with ellipsis
- Stacked button layouts
- Full-width filter inputs
- Compact spacing

### Navigation

#### Breadcrumb Navigation
Located at the top of the admin panel:
```
Home > Admin Panel
```

**Mobile**: Shows only home icon without text

#### Tab Navigation
Four main tabs with smooth transitions:
1. User Invitation Requests (Invites on mobile)
2. Statistics
3. Featured Posts (Featured on mobile)
4. User Management (Users on mobile)

### Visual Consistency

- **Colors**: Matches Quote.Vote brand palette
  - Primary green: `#52b274`
  - Danger red: `#f44336` / `#ff6060`
  - Pending gray: `#d8d8d8`
  - Featured highlight: `#fff8e1`

- **Typography**: 
  - Headers: Montserrat, bold
  - Body: Roboto
  - Responsive font scaling

- **Spacing**: Material-UI theme spacing units
- **Shadows**: Consistent elevation levels
- **Borders**: Subtle dividers and borders

## Technical Implementation

### Components

#### Main Components
- `ControlPanel.jsx` - Main container component
- `ControlPanelContainer` - Layout wrapper with tabs
- `UserInvitationRequestsTab` - Invitation management
- `StatisticsTab` - Analytics dashboard
- `FeaturedPostsTable` - Featured post management
- `UserManagementTab` - User administration

#### Supporting Components
- `ActionButtons` - Dynamic action buttons based on status
- `TabPanel` - Tab content wrapper
- `AdminPanelButton` - Settings page navigation button

### Styling

**File**: `controlPanelStyles.js`

**Key Features:**
- Theme-based responsive breakpoints
- Mobile-first approach
- Consistent spacing and sizing
- Sticky table headers
- Overflow handling

### State Management

- Local component state for tabs, filters, and selections
- Apollo Client for GraphQL queries and mutations
- Redux for user authentication state

### GraphQL Operations

**Queries:**
- `USER_INVITE_REQUESTS` - Fetch invitation data
- `GET_TOP_POSTS` - Fetch posts for featuring
- `GET_USERS` - Fetch user list

**Mutations:**
- `UPDATE_USER_INVITE_STATUS` - Modify invitation status
- `UPDATE_FEATURED_SLOT` - Assign/update featured slots
- `UPDATE_USER` - Toggle contributor badges

## Security

### Route Protection
- Admin routes check for `admin: true` in user state
- Unauthorized component displayed for non-admin access
- GraphQL resolvers enforce server-side authorization

### Best Practices
- No hardcoded admin credentials
- Role-based access control (RBAC)
- Secure token-based authentication
- Input validation on all forms

## Mobile Testing

### Recommended Testing Devices
- **iOS**: iPhone 12/13/14 (Safari)
- **Android**: Pixel 5/6, Samsung Galaxy (Chrome)
- **Tablet**: iPad, Android tablets

### Key Test Scenarios
1. Tab navigation and scrolling
2. Table horizontal scrolling
3. Filter input functionality
4. Button interactions (accept/decline/reset)
5. Featured slot selection
6. Breadcrumb navigation
7. Safe area insets (iOS notch)

### Known Considerations
- Tables use horizontal scroll on small screens
- Some text truncation is intentional for mobile UX
- Touch targets meet minimum 44x44px accessibility standards

## Future Enhancements

### Potential Improvements
- [ ] Bulk invitation operations
- [ ] Advanced filtering and search
- [ ] Export data to CSV
- [ ] Real-time updates via subscriptions
- [ ] Activity logs and audit trail
- [ ] Email notification settings
- [ ] Custom featured slot layouts
- [ ] User role management beyond contributor badge
- [ ] Dark mode support

## Troubleshooting

### Common Issues

**Issue**: Admin button not visible in Settings
- **Solution**: Verify user has `admin: true` in their profile

**Issue**: Table content cut off on mobile
- **Solution**: Use horizontal scroll gesture on table

**Issue**: Tabs not scrolling on mobile
- **Solution**: Swipe left/right on tab bar

**Issue**: Unauthorized access error
- **Solution**: Ensure user is logged in with admin privileges

## Support

For issues or questions regarding the Admin Panel:
1. Check this documentation
2. Review GitHub issues: [QuoteVote Issues](https://github.com/QuoteVote/quotevote-monorepo/issues)
3. Contact the development team

---

**Last Updated**: November 2025
**Version**: 2.0 (Mobile-Responsive Redesign)
