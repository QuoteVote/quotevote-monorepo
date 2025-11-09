# Bug Fix: Report Bot 400 Error

## Problem
When trying to report an account, you're getting:
```
Response not successful: Received status code 400
```

## Root Cause
The server needs to be restarted to load the new GraphQL mutations and models that were just added.

## Solution

### Step 1: Restart the Backend Server

**Option A: If using PM2 (Production)**
```bash
cd /home/alien/Documents/dev-projects/new/quotevote-monorepo/server
pm2 delete all
npm run build
npm start
```

**Option B: If using Dev Mode (Recommended for testing)**
```bash
cd /home/alien/Documents/dev-projects/new/quotevote-monorepo/server

# Kill existing process on port 4000
lsof -ti:4000 | xargs kill -9

# Start in dev mode
npm run dev-mac
```

**Option C: Simple Kill and Restart**
```bash
# Find and kill the process
lsof -ti:4000 | xargs kill -9

# Navigate to server directory
cd /home/alien/Documents/dev-projects/new/quotevote-monorepo/server

# Start server
npm run dev-mac
```

### Step 2: Verify Server Started Successfully

You should see output like:
```
Apollo Server on http://localhost:4000/graphql
Database
```

### Step 3: Test the Report Bot Feature

1. Go to http://localhost:3000 (or your client port)
2. Log in with a test account
3. Navigate to another user's profile
4. Click the "Report Bot" button
5. Confirm in the dialog
6. You should see a success message

### Step 4: Verify in Admin Dashboard (Admin Only)

1. Log in with an admin account
2. Go to Control Panel
3. Click "Bot Reports" tab
4. You should see the reported user listed

## Additional Verification

### Check GraphQL Playground (Optional)

1. Open http://localhost:4000/graphql
2. Run this query to verify the mutations are loaded:

```graphql
{
  __type(name: "Mutation") {
    fields {
      name
    }
  }
}
```

Look for these in the results:
- `reportBot`
- `disableUser`
- `enableUser`

3. Test the reportBot mutation:

```graphql
mutation TestReportBot {
  reportBot(
    userId: "YOUR_TARGET_USER_ID"
    reporterId: "YOUR_USER_ID"
  ) {
    code
    message
  }
}
```

## Files That Were Modified

The following files were created/modified and need to be loaded by restarting the server:

**Backend:**
- `server/app/data/resolvers/models/UserModel.js`
- `server/app/data/resolvers/models/BotReportModel.js` (new)
- `server/app/data/resolvers/mutations/user/reportBot.js` (new)
- `server/app/data/resolvers/mutations/user/disableUser.js` (new)
- `server/app/data/resolvers/mutations/user/enableUser.js` (new)
- `server/app/data/resolvers/queries/user/getBotReportedUsers.js` (new)
- `server/app/data/type_definition/mutation_definition.js`
- `server/app/data/type_definition/query_definition.js`
- `server/app/data/types/User.js`
- `server/app/data/utils/authentication.js`

## Troubleshooting

### If you still get 400 error after restart:

1. **Check server logs** for any error messages
2. **Open browser console** (F12) and check the Network tab for the exact GraphQL error
3. **Verify your user ID** - make sure you're logged in and have a valid user ID

### Common Issues:

**Issue: "Cannot find module BotReportModel"**
- Solution: The file was created, just restart the server

**Issue: "User not found"**
- Solution: Make sure you're using valid user IDs for both reporter and reported user

**Issue: "You have already reported this user"**
- Solution: This is expected if you already reported them. Try with a different user or test account

**Issue: "Authentication required"**
- Solution: Make sure you're logged in. Check that the auth token is being sent in the request headers

### Check Frontend Console:

Open browser console (F12) and look for:
- Red error messages
- Network requests to `/graphql`
- Click on the failed request to see the exact error response

### Check Backend Logs:

Look for:
- Any errors during server startup
- GraphQL errors when the mutation is called
- MongoDB connection errors

## Database Indexes

If you're using MongoDB, the new indexes will be created automatically on first use:
- UserModel: `{ botReports: -1, lastBotReportDate: -1 }`
- BotReportModel: `{ _reporterId: 1, _reportedUserId: 1 }` (unique)

## Next Steps After Fix

Once the server is restarted and working:

1. Test reporting a user
2. Check the Bot Reports admin tab
3. Test disabling a user account
4. Test that disabled users cannot log in
5. Test re-enabling a user account

## Contact

If issues persist after following these steps, please provide:
1. Server console output
2. Browser console errors
3. Network tab showing the GraphQL request/response
4. Which user IDs you're testing with

