# Presence Feature - Frontend Implementation

## Overview
This document describes the frontend implementation of the presence feature for the QuoteVote application.

## Components

### 1. BuddyListPanel Component
**Location**: `client/src/components/Chat/BuddyListPanel.jsx`

A React component that displays a list of online users with their presence status.

**Features**:
- Displays user avatars with status indicators (online/away/offline)
- Shows user display names and custom status text
- Real-time updates via GraphQL subscriptions
- Automatic presence management (online on mount, offline on unmount)
- Heartbeat every 45 seconds to keep presence alive
- Responsive design with Material-UI styling

**Usage**:
```jsx
import { BuddyListPanel } from '../components/Chat';

function MyComponent() {
  return (
    <div>
      <BuddyListPanel />
    </div>
  );
}
```

### 2. usePresence Hook
**Location**: `client/src/hooks/usePresence.js`

A custom React hook that manages user presence automatically.

**Features**:
- Sets presence to "online" when component mounts
- Sets presence to "offline" when component unmounts
- Sends heartbeat every 45 seconds to keep presence alive
- Handles errors gracefully

**Usage**:
```jsx
import { usePresence } from '../hooks/usePresence';

function MyComponent() {
  // Automatically manages presence
  usePresence();
  
  return <div>Your component content</div>;
}
```

## GraphQL Integration

### Queries
**File**: `client/src/graphql/presence.js`

- `GET_ONLINE_USERS`: Fetches all online users
- `GET_USER_PRESENCE`: Fetches presence for a specific user

### Mutations
- `SET_PRESENCE`: Sets the current user's presence status

### Subscriptions
- `PRESENCE_UPDATES_SUBSCRIPTION`: Subscribes to all presence updates
- `PRESENCE_STREAM_SUBSCRIPTION`: Subscribes to presence updates for specific users

## Styling

The component uses Material-UI's `makeStyles` API and follows the existing design patterns in the application:

- **Header**: Gradient background matching the chat interface
- **Status Indicators**: Color-coded dots (green=online, orange=away, gray=offline)
- **Scrollable List**: Max height of 400px with custom scrollbar styling
- **Hover Effects**: Subtle background change on list item hover

## Integration Example

To integrate the BuddyListPanel into your application:

```jsx
import React from 'react';
import { BuddyListPanel } from './components/Chat';

function ChatPage() {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Your existing chat content */}
      <div style={{ flex: 1 }}>
        {/* Chat messages, etc. */}
      </div>
      
      {/* Buddy list panel */}
      <div style={{ width: '360px' }}>
        <BuddyListPanel />
      </div>
    </div>
  );
}

export default ChatPage;
```

## Features

### Automatic Presence Management
The component automatically:
1. Sets user presence to "online" when mounted
2. Sends heartbeat every 45 seconds to maintain online status
3. Sets user presence to "offline" when unmounted

### Real-time Updates
- Uses GraphQL subscriptions for instant presence updates
- Falls back to polling every 60 seconds as backup
- Merges subscription data with query data for seamless updates

### User Display
- Shows user avatars using the existing Avatar component
- Displays user display names or fallback to user ID
- Shows custom status text if available
- Shows "last seen" time for users without custom status

### Status Indicators
- **Green dot**: User is online
- **Orange dot**: User is away
- **Gray dot**: User is offline

## Dependencies

- `@apollo/client`: GraphQL client for queries, mutations, and subscriptions
- `@material-ui/core`: UI components and styling
- `avataaars`: Avatar generation library (existing in the project)

## Notes

- The component requires authentication to work properly
- All GraphQL operations require a valid JWT token
- The presence data automatically expires after 2 minutes of inactivity on the server
- The component is fully responsive and works on mobile devices

## Future Enhancements

Potential improvements:
1. Click on user to open direct message
2. Filter users by status (online/away/offline)
3. Search functionality for large user lists
4. Custom status text input
5. User profile preview on hover
6. Typing indicators
7. Last active time for offline users
