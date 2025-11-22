# Fix: Add "Request Invite" Button to Mobile Nav (Pre-Login)

## Description
This PR addresses Issue #251 by adding a visible "Request Invite" button to the mobile navigation header for unauthenticated users. It also introduces a cleaner `/invite` route and ensures consistent behavior across the application.

## Changes
- **Added `/invite` Route**: Created a new route in `mui-routes.jsx` that maps to the `RequestAccessPage`.
- **Mobile Header Update**: Added a "Request Invite" button to the `MainNavBar` toolbar, visible only on mobile screens (`Hidden mdUp`) when the user is not logged in.
- **Route Updates**: Updated existing "Request Invite" buttons (desktop and mobile drawer) to use the new `/invite` route.
- **Auth Redirect**: Updated `requireAuth` in `auth.js` to redirect to `/invite` instead of `/auth/request-access`.
- **UX Improvements**: The "Request Invite" button is hidden if the user is already on the `/invite` page to prevent redundant navigation.

## Verification
- **Mobile View**: Confirmed that the "Request Invite" button appears in the header on mobile screens for unauthenticated users.
- **Navigation**: Verified that clicking the button navigates to `/invite`.
- **Visibility Logic**: Confirmed the button is hidden when logged in or when already on the `/invite` page.
- **Backward Compatibility**: The old `/auth/request-access` route remains functional (via the component mapping), but the app now prefers `/invite`.

## Related Issue
Fixes #251
