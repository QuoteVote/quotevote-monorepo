# Bot Reporting & Admin Controls - Implementation Summary

## Overview

This document describes the implementation of the bot reporting and admin controls feature for the QuoteVote platform. Users can now report suspicious accounts as bots, and administrators can disable/re-enable flagged accounts.

## ✅ Implemented Features

### Backend Changes

#### 1. Database Schema Updates

**User Model** (`server/app/data/resolvers/models/UserModel.js`):
- Added `botReports` field (Number, default: 0) - tracks total bot reports
- Added `accountStatus` field (Enum: 'active' | 'disabled', default: 'active')
- Added `lastBotReportDate` field (Date) - tracks most recent report
- Added database indexes for efficient querying

**New BotReport Model** (`server/app/data/resolvers/models/BotReportModel.js`):
- Tracks individual bot reports with reporter and reported user
- Prevents duplicate reports via unique compound index
- Includes timestamp for audit trail

**GraphQL Type Definition** (`server/app/data/types/User.js`):
- Exposed new fields in User type: `botReports`, `accountStatus`, `lastBotReportDate`

#### 2. GraphQL Mutations

**reportBot** (`server/app/data/resolvers/mutations/user/reportBot.js`):
- Allows authenticated users to report another user as a bot
- Prevents duplicate reports from the same user
- Prevents self-reporting
- Increments `botReports` counter and updates `lastBotReportDate`
- Returns success/error response

**disableUser** (`server/app/data/resolvers/mutations/user/disableUser.js`):
- Admin-only mutation to disable user accounts
- Prevents disabling admin accounts
- Sets `accountStatus` to 'disabled'

**enableUser** (`server/app/data/resolvers/mutations/user/enableUser.js`):
- Admin-only mutation to re-enable disabled accounts
- Sets `accountStatus` to 'active'

#### 3. GraphQL Queries

**getBotReportedUsers** (`server/app/data/resolvers/queries/user/getBotReportedUsers.js`):
- Admin-only query to fetch users with bot reports
- Supports sorting by:
  - Most reports (`sortBy: "botReports"`)
  - Most recent report (`sortBy: "lastReportDate"`)
- Configurable limit (default: 100)
- Returns full user details including report counts and status

#### 4. Authentication Enhancement

**Login Check** (`server/app/data/utils/authentication.js`):
- Added account status validation during login
- Disabled accounts receive 403 status with clear message:
  > "Your account has been flagged as a bot and temporarily disabled. If you believe this is a mistake, please email admin@quote.vote to appeal."
- Prevents any interaction until account is re-enabled

### Frontend Changes

#### 1. GraphQL Client Updates

**Mutations** (`client/src/graphql/mutations.jsx`):
- `REPORT_BOT` - Report a user as a bot
- `DISABLE_USER` - Disable a user account (admin only)
- `ENABLE_USER` - Enable a user account (admin only)

**Queries** (`client/src/graphql/query.jsx`):
- `GET_BOT_REPORTED_USERS` - Fetch all users with bot reports (admin only)

#### 2. User Profile Enhancement

**ProfileHeader Component** (`client/src/components/Navbars/ProfileHeader.jsx`):
- Added "🤖 Report Bot" button (visible only when viewing another user's profile)
- Confirmation dialog before submitting report
- Shows success/error messages via snackbar
- Prevents duplicate reports (handled by backend)
- Clean, Material-UI integrated design

#### 3. Admin Dashboard Enhancement

**BotListTab Component** (`client/src/components/Admin/BotListTab.jsx`):
- New tab in the Control Panel showing all reported users
- Features:
  - Sortable table (by report count or date)
  - User avatars and profile information
  - Report count badges (highlighted if ≥5 reports)
  - Account status indicators (Active/Disabled)
  - Action buttons to disable/enable accounts
  - Responsive Material-UI table design
  - Loading states and error handling

**Control Panel Integration** (`client/src/views/ControlPanel/ControlPanel.jsx`):
- Added "Bot Reports" tab to admin dashboard
- Accessible only to admin users
- Integrated alongside existing admin tools

## File Structure

### Backend Files Created/Modified

```
server/app/data/
├── resolvers/
│   ├── models/
│   │   ├── UserModel.js (modified)
│   │   └── BotReportModel.js (new)
│   ├── mutations/
│   │   └── user/
│   │       ├── reportBot.js (new)
│   │       ├── disableUser.js (new)
│   │       ├── enableUser.js (new)
│   │       └── index.js (modified)
│   ├── queries/
│   │   └── user/
│   │       ├── getBotReportedUsers.js (new)
│   │       └── index.js (modified)
│   ├── mutations.js (modified)
│   └── queries.js (modified)
├── types/
│   └── User.js (modified)
├── type_definition/
│   ├── mutation_definition.js (modified)
│   └── query_definition.js (modified)
└── utils/
    └── authentication.js (modified)
```

### Frontend Files Created/Modified

```
client/src/
├── graphql/
│   ├── mutations.jsx (modified)
│   └── query.jsx (modified)
├── components/
│   ├── Navbars/
│   │   └── ProfileHeader.jsx (modified)
│   └── Admin/
│       └── BotListTab.jsx (new)
└── views/
    └── ControlPanel/
        └── ControlPanel.jsx (modified)
```

## Usage Guide

### For Regular Users

1. **Reporting a Bot:**
   - Navigate to any user's profile
   - Click the "Report Bot" button (next to Message button)
   - Confirm in the dialog that appears
   - Receive confirmation message

2. **If Your Account is Flagged:**
   - You'll see an error message on login
   - Contact admin@quote.vote to appeal
   - Provide evidence that you're a legitimate user

### For Administrators

1. **Viewing Bot Reports:**
   - Go to Control Panel
   - Click "Bot Reports" tab
   - View all users with at least one report

2. **Sorting Reports:**
   - Use dropdown to sort by:
     - Most Reports (default)
     - Most Recent Report

3. **Taking Action:**
   - **Disable Account:** Click "Disable" button for suspicious accounts
   - **Enable Account:** Click "Enable" button to restore access
   - Monitor report counts (5+ reports highlighted in red)

4. **Account Status:**
   - **Active** (blue badge): User can log in and interact
   - **Disabled** (gray badge): User blocked from platform

## Security Features

1. **Duplicate Prevention:** Users can only report another user once
2. **Self-Report Protection:** Users cannot report themselves
3. **Admin Protection:** Admin accounts cannot be disabled
4. **Authentication Required:** All actions require valid login
5. **Authorization Checks:** Admin-only actions verified server-side
6. **Audit Trail:** All reports timestamped and tracked

## Database Indexes

For optimal performance:
- `botReports` and `lastBotReportDate` indexed together
- `_reporterId` and `_reportedUserId` compound unique index on BotReportModel
- Ensures fast queries and duplicate detection

## Error Handling

- **Frontend:** User-friendly error messages via snackbar
- **Backend:** Proper GraphQL errors (AuthenticationError, UserInputError)
- **Network Issues:** Loading states and graceful degradation
- **Permission Errors:** Clear messages about authorization requirements

## Testing Checklist

### User Reporting
- ✅ Report button visible only on other users' profiles
- ✅ Confirmation dialog appears before reporting
- ✅ Duplicate reports prevented
- ✅ Success message shown after reporting
- ✅ Cannot report yourself

### Admin Dashboard
- ✅ Bot Reports tab visible to admins only
- ✅ Sorting works correctly
- ✅ Report counts display accurately
- ✅ Status badges show correct state
- ✅ Disable/Enable actions work
- ✅ UI updates after actions

### Account Disabling
- ✅ Disabled users cannot log in
- ✅ Appropriate error message shown
- ✅ Admin accounts cannot be disabled
- ✅ Re-enabled users can log in again

### Edge Cases
- ✅ Non-existent users handled gracefully
- ✅ Network errors handled
- ✅ Unauthorized access blocked
- ✅ Empty report list handled

## Future Enhancements

Potential improvements for future iterations:

1. **Automated Detection:**
   - Auto-flag accounts with 10+ reports
   - Machine learning for bot pattern detection
   - Suspicious activity monitoring

2. **Appeal System:**
   - Built-in appeal form
   - Admin review queue
   - Appeal history tracking

3. **Notification System:**
   - Email admins when reports exceed threshold
   - Notify users when their account is flagged
   - Alert on appeal submissions

4. **Analytics:**
   - Bot report trends over time
   - Most reported user patterns
   - False positive rate tracking

5. **Report Details:**
   - Add reason/comment field to reports
   - View who reported each user
   - Report categories (spam, fake, etc.)

## API Examples

### Report a User as Bot

```graphql
mutation ReportBot {
  reportBot(
    userId: "507f1f77bcf86cd799439011"
    reporterId: "507f191e810c19729de860ea"
  ) {
    code
    message
  }
}
```

### Get Bot Reported Users (Admin)

```graphql
query GetBotReports {
  getBotReportedUsers(sortBy: "botReports", limit: 50) {
    _id
    username
    email
    botReports
    accountStatus
    lastBotReportDate
  }
}
```

### Disable User Account (Admin)

```graphql
mutation DisableUser {
  disableUser(userId: "507f1f77bcf86cd799439011") {
    _id
    accountStatus
  }
}
```

### Enable User Account (Admin)

```graphql
mutation EnableUser {
  enableUser(userId: "507f1f77bcf86cd799439011") {
    _id
    accountStatus
  }
}
```

## Support

For questions or issues:
- Email: admin@quote.vote
- Check application logs for detailed error messages
- Review GraphQL playground for API testing

## Changelog

### Version 1.0.0 (Initial Release)
- Implemented bot reporting system
- Added admin controls for account management
- Created Bot Reports dashboard
- Added account status checks during authentication
- Full documentation and testing

---

**Last Updated:** November 9, 2025
**Author:** QuoteVote Development Team

