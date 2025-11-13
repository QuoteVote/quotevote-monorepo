# 🚀 Deployment Fix for PR #255

## Issue Description
The Netlify deploy preview for PR #255 shows "Connection Refused" error because the frontend cannot connect to the backend API.

**Deploy Preview URL**: https://deploy-preview-255--quotevote.netlify.app
**Expected Backend**: Railway PR deployment

## Root Cause Analysis
1. **Frontend Configuration**: The app tries to connect to Railway backend for PR deployments
2. **Backend Availability**: The Railway backend for PR #255 might not be deployed or accessible
3. **URL Pattern Mismatch**: The Railway URL pattern might be different than expected

## Fixes Applied

### 1. Updated Netlify Configuration (`netlify.toml`)
```toml
[build]
  base = "client"
  command = "rm -rf node_modules && npm ci --legacy-peer-deps && npm run build:ci"
  publish = "build"

[build.environment]
  NODE_VERSION = "22"
  ROLLUP_SKIP_NATIVE = "true"
  NODE_ENV = "production"
  # Railway backend URLs for production deployment
  REACT_APP_SERVER = "https://quotevote-backend.railway.app/graphql"
  REACT_APP_SERVER_WS = "wss://quotevote-backend.railway.app/graphql"
  REACT_APP_DOMAIN = "https://quotevote.netlify.app"
```

### 2. Enhanced Backend URL Detection (`client/src/utils/getServerUrl.js`)
- Added multiple Railway URL patterns to try
- Improved debugging with console logs
- Added fallback system for when PR backend is not available

### 3. Created Fallback Configuration (`client/src/config/fallback.js`)
- Centralized backend URL management
- Multiple Railway URL patterns
- Fallback backend options

## Railway Backend URL Patterns Tried
For PR #255, the system will try these URLs in order:
1. `https://quotevote-backend-pr-255.up.railway.app`
2. `https://quotevote-api-pr-255.up.railway.app`
3. `https://quotevote-monorepo-pr-255.up.railway.app`
4. `https://quotevote-server-pr-255.up.railway.app`

**Fallbacks**:
- `https://quotevote-backend.railway.app` (main backend)
- `https://api.quote.vote` (production API)

## Testing the Fix

### 1. Check Console Logs
Open browser dev tools on the deploy preview and look for:
```
🚀 Detected Netlify preview deploy: https://deploy-preview-255--quotevote.netlify.app
📋 PR Number: 255
🔍 Trying Railway backends for PR: [array of URLs]
```

### 2. Manual Backend Testing
Test if any of these URLs work:
```bash
# Test Railway PR backend
curl -X POST https://quotevote-backend-pr-255.up.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Test main Railway backend
curl -X POST https://quotevote-backend.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Test production backend
curl -X POST https://api.quote.vote/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### 3. Network Tab Analysis
1. Open browser dev tools → Network tab
2. Reload the deploy preview
3. Look for GraphQL requests
4. Check if they're going to the correct backend URL
5. Check response status (should be 200, not connection refused)

## Next Steps

### If Railway PR Backend Exists
1. Verify the correct Railway URL pattern
2. Update `FALLBACK_CONFIG.RAILWAY_PATTERNS` if needed
3. Ensure Railway backend is deployed for PR #255

### If Railway PR Backend Doesn't Exist
1. Deploy Railway backend for PR #255
2. Or update configuration to use main Railway backend
3. Or fallback to production API

### Immediate Fix (Recommended)
Update Netlify environment variables to use the main Railway backend:
```
REACT_APP_SERVER=https://quotevote-backend.railway.app/graphql
REACT_APP_SERVER_WS=wss://quotevote-backend.railway.app/graphql
```

## Deployment Commands

```bash
# Commit the fixes
git add .
git commit -m "fix: resolve Netlify deployment connection issues

- Update Netlify build configuration with Railway backend URLs
- Enhance backend URL detection with multiple Railway patterns
- Add fallback system for when PR backend is unavailable
- Improve debugging with detailed console logging

Fixes connection refused error in deploy preview for PR #255"

# Push to update the PR
git push origin feature/dark-mode-toggle
```

## Verification Checklist
- [ ] Netlify build completes successfully
- [ ] Deploy preview loads without connection errors
- [ ] Console shows correct backend URL detection
- [ ] GraphQL requests succeed (check Network tab)
- [ ] Dark mode toggle works in deploy preview
- [ ] All app functionality works as expected

## Contact Information
If the issue persists:
1. Check Railway dashboard for PR #255 backend deployment
2. Verify Railway backend URL patterns
3. Test backend connectivity manually
4. Update environment variables in Netlify dashboard if needed
