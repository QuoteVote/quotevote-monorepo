# QuoteVote Management Scripts

Cross-platform Node.js scripts for automated project setup, account management, and development workflow.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Video Tutorials](#video-tutorials)
- [Scripts](#scripts)
  - [setup.js](#setupjs)
  - [start.js](#startjs)
  - [create-admin.js](#create-adminjs)
  - [create-dev.js](#create-devjs)
- [Quick Start](#quick-start)
- [Platform Support](#platform-support)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)

---

## Overview

All scripts are:
- ✅ **Cross-platform** - Windows, macOS, Linux
- ✅ **Non-interactive** - Automated execution (except setup)
- ✅ **Optimized** - Professional output, minimal colors
- ✅ **Documented** - Complete JSDoc coverage
- ✅ **Tested** - Validated and production-ready

---

## Video Tutorials

Visual step-by-step guides for setting up and using QuoteVote scripts.

### Available Videos

#### QuoteVote - Linux Setup

**Platform:** Linux (Arch, Ubuntu, Debian, Fedora compatible)

<video src="../docs/videos/mp4/QuoteVote - linux.mp4" autoplay loop muted playsinline width="600" aria-label="QuoteVote Linux setup demonstration video"></video>

A complete walkthrough demonstrating:
- Initial project setup using `setup.js`
- Creating admin and developer accounts
- Starting development servers with `start.js`
- Navigating the QuoteVote application
- Common workflows and tips for Linux users

**Duration:** Full setup demonstration from clone to running application

---

#### QuoteVote - Windows Setup

**Platform:** Windows 10, 11 (PowerShell, CMD, Git Bash compatible)

<video src="../docs/videos/mp4/QuoteVote - Windows.mp4" autoplay loop muted playsinline width="600"></video>

A complete walkthrough demonstrating:
- Initial project setup using `setup.js`
- Creating admin and developer accounts
- Starting development servers with `start.js`
- Navigating the QuoteVote application
- Common workflows and tips for Windows users

**Duration:** Full setup demonstration from clone to running application

---

## Scripts

### setup.js

**Complete project setup and configuration**

```bash
npm run setup
```

#### Purpose
Automated first-time setup that installs dependencies, creates environment files, and verifies system requirements.

#### What It Does
1. Checks prerequisites (Node.js, npm, MongoDB)
2. Installs root dependencies
3. Installs server dependencies
4. Installs client dependencies
5. Creates `server/.env` with template
6. Creates `client/.env` with template
7. Provides MongoDB setup instructions

#### Output
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          QuoteVote Monorepo - Setup Installer             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

[1/4] Checking Prerequisites
✓ Node.js v18.x.x detected
✓ npm v8.x.x detected
✓ MongoDB detected

[2/4] Installing Dependencies
→ npm install --legacy-peer-deps
✓ Root dependencies installed
→ npm install --workspace=server
✓ Server dependencies installed
→ npm install --legacy-peer-deps --workspace=client
✓ Client dependencies installed

[3/4] Setting Up Environment
✓ server/.env created
✓ client/.env created

[4/4] MongoDB Setup
...
```

#### Environment Files Created

**server/.env:**
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=mongodb://localhost:27017/quotevote-dev
JWT_SECRET=your-secret-key-change-this
STRIPE_SECRET_KEY=your-stripe-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
```

**client/.env:**
```env
VITE_API_URL=http://localhost:4000/graphql
VITE_WS_URL=ws://localhost:4000/graphql
```

#### When to Use
- First time cloning the repository
- After pulling major changes
- When dependencies are out of sync
- Environment files are missing or corrupted

#### Time
~2-3 minutes (depending on network speed)

---

### start.js

**Start both development servers**

```bash
npm run start-dev
```

#### Purpose
Automated server startup with MongoDB verification and port management.

#### What It Does
1. Verifies MongoDB is running
2. Attempts to start MongoDB (Linux only)
3. Clears processes on ports 4000 and 5173
4. Starts backend (GraphQL) server
5. Starts frontend (React) server
6. Displays access URLs

#### Output
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          QuoteVote Development - Starting Servers         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Checking MongoDB status...

✓ MongoDB is running

Clearing ports 4000 and 5173...
✓ Ports are available

Starting development servers...

Services will be available at:
  Backend:  http://localhost:4000
  GraphQL:  http://localhost:4000/graphql
  Frontend: http://localhost:3000

Press Ctrl+C to stop both servers
────────────────────────────────────────────────────────────
```

#### Access Points
- **Frontend**: http://localhost:3000
- **GraphQL API**: http://localhost:4000/graphql
- **Backend**: http://localhost:4000

#### When to Use
- Daily development work
- After running setup
- When servers crash or hang
- To restart with clean ports

#### Time
~5 seconds

#### Notes
- Automatically kills existing processes on required ports
- Runs both servers concurrently using npm workspaces
- Handles graceful shutdown on Ctrl+C

---

### create-admin.js

**Create administrator account (non-interactive)**

```bash
npm run create-admin
```

#### Purpose
Instantly creates an admin account with static credentials for development.

#### What It Does
1. Loads environment configuration
2. Connects to MongoDB
3. Creates or updates admin user
4. Sets admin privileges
5. Displays login credentials

#### Output
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║            QuoteVote - Admin Account Creator              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Connecting to MongoDB...
Database: mongodb://localhost:27017/quotevote-dev

✓ Connected to MongoDB

Creating admin account...
Email: admin@quotevote.local
Username: admin

✓ Admin account created

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                 Admin Account Ready                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Login Credentials:

  Email:    admin@quotevote.local
  Username: admin
  Password: admin123
  Role:     Administrator

Quick Start:

  1. Start the servers
     npm run start-dev

  2. Open the application
     http://localhost:3000

  3. Login with the credentials above
```

#### Static Credentials
```
Email:    admin@quotevote.local
Username: admin
Password: admin123
Role:     Administrator
Status:   Active (approved)
```

#### When to Use
- Need admin access for testing
- Setting up local development
- CI/CD pipelines
- Resetting admin account

#### Time
~2 seconds

#### Notes
- Non-interactive (no prompts)
- Idempotent (safe to run multiple times)
- Updates existing account if found
- Hashes password with bcrypt

---

### create-dev.js

**Create developer test account (non-interactive)**

```bash
npm run create-dev
```

#### Purpose
Instantly creates a pre-approved test account with static credentials.

#### What It Does
1. Loads environment configuration
2. Connects to MongoDB
3. Creates or updates developer user
4. Sets approved status (non-admin)
5. Displays login credentials

#### Output
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          QuoteVote - Developer Account Creator            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Connecting to MongoDB...
Database: mongodb://localhost:27017/quotevote-dev

✓ Connected to MongoDB

Creating developer account...
Email: dev@quotevote.local
Username: developer

✓ Developer account created

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              Developer Account Ready                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Login Credentials:

  Email:    dev@quotevote.local
  Username: developer
  Password: dev123
  Status:   Approved (Ready to use)

Quick Start:

  1. Start the servers
     npm run start-dev

  2. Open the application
     http://localhost:3000

  3. Login with the credentials above
```

#### Static Credentials
```
Email:    dev@quotevote.local
Username: developer
Password: dev123
Role:     Regular User
Status:   Active (approved)
```

#### When to Use
- Quick testing without admin privileges
- CI/CD test pipelines
- Automated integration tests
- Fast iteration during development

#### Time
~2 seconds

#### Notes
- Non-interactive (no prompts)
- Non-admin account
- Idempotent (safe to run multiple times)
- Updates existing account if found
- Hashes password with bcrypt

---

## Quick Start

> 🎥 **New to QuoteVote?** Watch the [video tutorial](#video-tutorials) for a complete visual walkthrough!

### First Time Setup
```bash
# 1. Install and configure
npm run setup

# 2. Create admin account
npm run create-admin

# 3. Create test account
npm run create-dev

# 4. Start servers
npm run start-dev
```

### Daily Development
```bash
# Just start the servers
npm run start-dev

# Login with:
# Admin: admin@quotevote.local / admin123
# Dev:   dev@quotevote.local / dev123
```

### CI/CD Pipeline
```bash
npm run setup
npm run create-admin
npm run create-dev
npm test
```

---

## Platform Support

### Windows
- ✅ Windows 10, 11
- ✅ PowerShell, CMD, Git Bash
- ✅ Automatic process management

### macOS
- ✅ Intel and Apple Silicon
- ✅ All macOS versions with Node.js 18+
- ✅ Homebrew MongoDB detection

### Linux
- ✅ Arch, Debian, Ubuntu, Fedora
- ✅ systemd service management
- ✅ Automatic MongoDB startup

---

## Requirements

### System Requirements
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **MongoDB**: >= 4.4 (local or Docker)

### Checking Requirements
```bash
node --version   # Should be v18.x.x or higher
npm --version    # Should be v8.x.x or higher
mongod --version # Should be v4.4.x or higher
```

### Installing Requirements

**Node.js & npm:**
- Windows: https://nodejs.org/
- macOS: `brew install node`
- Linux: `nvm install 18` or package manager

**MongoDB:**
- Windows: https://www.mongodb.com/try/download/community
- macOS: `brew install mongodb-community`
- Linux: `sudo apt install mongodb` or `sudo pacman -S mongodb`
- Docker: `npm run docker -- start` (if docker.js exists)

---

## Troubleshooting

### Setup Script Issues

**Dependencies won't install:**
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run setup
```

**Peer dependency conflicts:**
```bash
# Use legacy peer deps (already handled by setup)
npm install --legacy-peer-deps
```

**Babel installation issues:**
```bash
# If you encounter Babel runtime installation errors
npm install @babel/runtime --legacy-peer-deps
```

**Permission errors (Linux/macOS):**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
```

---

### Start Script Issues

**MongoDB not running:**
```bash
# Linux
sudo systemctl start mongodb

# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Check status
sudo systemctl status mongodb  # Linux
brew services list | grep mongo  # macOS
sc query MongoDB  # Windows
```

**Port already in use:**
```bash
# The script automatically clears ports
# If it fails, manually kill processes:

# Linux/macOS
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Servers won't start:**
```bash
# Check environment files exist
ls -la server/.env
ls -la client/.env

# Recreate if missing
npm run setup
```

---

### Account Creation Issues

**MongoDB connection refused:**
```bash
# Ensure MongoDB is running
# See "MongoDB not running" above

# Check DATABASE_URL in server/.env
cat server/.env | grep DATABASE_URL
```

**Dependencies not found:**
```bash
# Reinstall dependencies
npm run setup
```

**User already exists:**
- Scripts automatically update existing users
- Run the script again to reset credentials

---

### General Issues

**Environment variables not loading:**
```bash
# Verify .env files
cat server/.env
cat client/.env

# Recreate with setup
npm run setup
```

**Scripts not executable:**
```bash
# Make scripts executable (Linux/macOS)
chmod +x scripts/*.js
```

**Wrong Node.js version:**
```bash
# Check version
node --version

# Install correct version
nvm install 18
nvm use 18
```

---


### Running Individual Scripts

```bash
# Direct execution
node scripts/setup.js
node scripts/start.js
node scripts/create-admin.js
node scripts/create-dev.js

# Or use npm
npm run setup
npm run start-dev
npm run create-admin
npm run create-dev
```

---

## Best Practices

### Development Workflow
1. Run `setup` once after cloning
2. Run `create-admin` and `create-dev` once
3. Use `start-dev` for daily development
4. Re-run `setup` after pulling major changes

### CI/CD Workflow
```yaml
steps:
  - npm run setup
  - npm run create-admin
  - npm run create-dev
  - npm test
```

### Security
- ⚠️ **Never use these credentials in production**
- Change passwords after first login
- Use environment-specific credentials
- Keep `.env` files out of version control

### Performance
- Scripts use minimal colors for faster output
- Non-interactive design for automation
- Concurrent operations where possible
- Efficient dependency installation

---

## Support

### Documentation
- Main README: `../README.md`
- Package scripts: `../package.json`
- Video Tutorials: `../docs/videos/` - Visual setup guides

### Common Commands
```bash
npm run setup          # Setup project
npm run start-dev      # Start servers
npm run create-admin   # Create admin
npm run create-dev     # Create developer
npm test              # Run tests
npm run build         # Build for production
```
