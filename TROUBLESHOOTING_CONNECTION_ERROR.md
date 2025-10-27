# Troubleshooting Connection Refused Error

## Issue
Server fails to start with "connection refused" error after recent merges.

## Quick Diagnosis

### 1. Check MongoDB Status
```bash
# Check if MongoDB is running
mongod --version

# Or if using Docker
docker ps | grep mongo
```

### 2. Verify Environment Variables
```bash
# Check if .env exists
ls -la server/.env

# Verify DATABASE_URL is set
cat server/.env | grep DATABASE_URL
```

### 3. Check Port Availability
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Or on Linux/Mac
lsof -i :3000
```

## Common Solutions

### Solution 1: Start MongoDB
```bash
# If MongoDB is not running
mongod

# Or with Docker
docker-compose up -d mongodb
```

### Solution 2: Fix Environment Variables
```bash
# Copy example env if missing
cp server/.env.example server/.env

# Edit and add your DATABASE_URL
# Example: DATABASE_URL=mongodb://localhost:27017/quotevote
```

### Solution 3: Reinstall Dependencies
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Solution 4: Check Docker Setup (PR #210)
```bash
# If using Docker from PR #210
docker-compose down
docker-compose up --build
```

### Solution 5: Clear Port Conflicts
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

## Verification Steps

After applying solutions, verify:

1. **MongoDB is accessible:**
   ```bash
   mongo --eval "db.version()"
   ```

2. **Server starts successfully:**
   ```bash
   cd server
   npm run dev
   ```

3. **GraphQL endpoint responds:**
   ```bash
   curl http://localhost:3000/graphql
   ```

## Related Issues

- Issue #194: Cannot Login (same connection error)
- PR #198: Previous fix for DB connection (f8f764a)
- PR #210: Docker setup changes

## Need More Help?

If none of these solutions work:
1. Check server logs for specific error messages
2. Verify MongoDB version compatibility
3. Check firewall/network settings
4. Review recent changes in PR #190 (reputation system) and PR #210 (Docker)

## Contact

If you need assistance, please provide:
- Error message from server logs
- MongoDB version
- Node.js version
- Operating system
- Output of `docker ps` (if using Docker)
