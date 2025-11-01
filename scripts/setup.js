#!/usr/bin/env node

/**
 * QuoteVote Monorepo Setup Script
 * Cross-platform setup for Windows, macOS, and Linux (Arch & Debian)
 * 
 * This script:
 * 1. Checks system prerequisites (Node.js, npm, MongoDB)
 * 2. Installs all dependencies for client and server
 * 3. Creates environment configuration files
 * 4. Provides platform-specific MongoDB setup instructions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes - minimal usage for better readability
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Helper function to detect OS
function getOS() {
  const platform = process.platform;
  if (platform === 'win32') return 'Windows';
  if (platform === 'darwin') return 'macOS';
  if (platform === 'linux') {
    try {
      const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
      if (osRelease.includes('arch')) return 'Linux-Arch';
      if (osRelease.includes('debian') || osRelease.includes('ubuntu')) return 'Linux-Debian';
      return 'Linux';
    } catch {
      return 'Linux';
    }
  }
  return 'Unknown';
}

/**
 * Execute a command with proper error handling
 * @param {string} command - Command to execute
 * @param {string} cwd - Working directory
 * @returns {boolean} Success status
 */
function runCommand(command, cwd = process.cwd()) {
  console.log(`${colors.dim}→ ${command}${colors.reset}`);
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      shell: true
    });
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Command failed: ${command}${colors.reset}`);
    return false;
  }
}

/**
 * Check if a command exists on the system
 * @param {string} command - Command to check
 * @returns {boolean} True if command exists
 */
function commandExists(command) {
  try {
    const checkCmd = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${checkCmd} ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Print setup banner
 */
function printBanner() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          QuoteVote Monorepo - Setup Installer             ║
║                                                            ║
║          Windows • macOS • Linux (Arch & Debian)          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
}

/**
 * Check system prerequisites
 * Verifies Node.js, npm, and MongoDB installation
 */
async function checkPrerequisites() {
  console.log('\n[1/4] Checking Prerequisites\n');
  
  const os = getOS();
  console.log(`${colors.green}✓${colors.reset} Operating System: ${os}`);
  
  // Check Node.js
  if (!commandExists('node')) {
    console.error(`${colors.red}✗ Node.js is not installed${colors.reset}`);
    console.log('  Please install Node.js v18+ from: https://nodejs.org/');
    process.exit(1);
  }
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✓${colors.reset} Node.js: ${nodeVersion}`);
  } catch (error) {
    console.error(`${colors.red}✗ Could not verify Node.js version${colors.reset}`);
    process.exit(1);
  }
  
  // Check npm
  if (!commandExists('npm')) {
    console.error(`${colors.red}✗ npm is not installed${colors.reset}`);
    process.exit(1);
  }
  
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✓${colors.reset} npm: v${npmVersion}`);
  } catch (error) {
    console.error(`${colors.red}✗ Could not verify npm version${colors.reset}`);
    process.exit(1);
  }
  
  // Check MongoDB (optional but recommended)
  const mongoInstalled = commandExists('mongod') || commandExists('mongo') || commandExists('mongosh');
  if (mongoInstalled) {
    console.log(`${colors.green}✓${colors.reset} MongoDB: Installed`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} MongoDB: Not detected (required to run application)`);
    console.log(`  Install: https://www.mongodb.com/docs/manual/installation/`);
  }
  
  console.log(`\n${colors.green}✓${colors.reset} Prerequisites verified\n`);
}

/**
 * Install project dependencies
 * Installs npm packages for root workspace, server, and client
 */
async function installDependencies() {
  console.log('[2/4] Installing Dependencies\n');
  
  const rootDir = path.resolve(__dirname, '..');
  
  // Install root workspace dependencies
  console.log('Installing root workspace...');
  const rootSuccess = runCommand('npm install --legacy-peer-deps', rootDir);
  if (!rootSuccess) {
    console.error(`${colors.red}✗ Failed to install root dependencies${colors.reset}`);
    process.exit(1);
  }
  
  // Install server dependencies
  console.log('\nInstalling server dependencies...');
  const serverSuccess = runCommand('npm install --legacy-peer-deps', path.join(rootDir, 'server'));
  if (!serverSuccess) {
    console.error(`${colors.red}✗ Failed to install server dependencies${colors.reset}`);
    process.exit(1);
  }
  
  // Install client dependencies
  console.log('\nInstalling client dependencies...');
  const clientSuccess = runCommand('npm install --legacy-peer-deps', path.join(rootDir, 'client'));
  if (!clientSuccess) {
    console.error(`${colors.red}✗ Failed to install client dependencies${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`\n${colors.green}✓${colors.reset} Dependencies installed successfully\n`);
}

/**
 * Setup environment configuration files
 * Creates .env files for server and client if they don't exist
 */
async function setupEnvironmentFiles() {
  console.log('[3/4] Setting up Environment Files\n');
  
  const rootDir = path.resolve(__dirname, '..');
  const serverEnvPath = path.join(rootDir, 'server', '.env');
  const clientEnvPath = path.join(rootDir, 'client', '.env');
  
  // Server .env template
  const serverEnvTemplate = `# Server Environment Variables
NODE_ENV=development
# GraphQL Port
PORT=4000

# Database Configuration (Local MongoDB - no authentication)
DATABASE_URL=mongodb://localhost:27017/quotevote-dev

# Authentication - change-in-production
JWT_SECRET=ufh8wefiuhsajkjsdnc9e3uhjdskfaskdf9238yuihdhfasjkfjsakljfh7jskahfs-something-random;

# SendGrid Email Service (REQUIRED for user invitations)
# Get free API key from: https://app.sendgrid.com/settings/api_keys
# Free tier: 100 emails/day
SENDGRID_API_KEY=
SENDGRID_SENDER_EMAIL=noreply@localhost-quote.vote

# SMTP Configuration (for password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Email Service (fallback)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
REQUEST_ACCESS_URL=http://localhost:3000/request-access

# WebSocket
WS_PORT=4000
WS_PATH=/graphql

# Session Secret
SECRET=your-session-secret-change-in-production


`;

  // Client .env template
  const clientEnvTemplate = `# Client Environment Variables
NODE_ENV=development

# API Endpoints
REACT_APP_SERVER=http://localhost:4000
REACT_APP_SERVER_WS=ws://localhost:4000
REACT_APP_API_URL=http://localhost:4000/graphql
REACT_APP_WS_URL=ws://localhost:4000/graphql

# Application Domain
REACT_APP_DOMAIN=http://localhost:3000

# Optional: Stripe Public Key
# REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
`;

  // Check if server .env exists
  if (fs.existsSync(serverEnvPath)) {
    console.log(`${colors.yellow}⚠${colors.reset} server/.env already exists (skipping)`);
  } else {
    fs.writeFileSync(serverEnvPath, serverEnvTemplate, 'utf8');
    console.log(`${colors.green}✓${colors.reset} Created server/.env`);
  }
  
  // Check if client .env exists
  if (fs.existsSync(clientEnvPath)) {
    console.log(`${colors.yellow}⚠${colors.reset} client/.env already exists (skipping)`);
  } else {
    fs.writeFileSync(clientEnvPath, clientEnvTemplate, 'utf8');
    console.log(`${colors.green}✓${colors.reset} Created client/.env`);
  }
  
  console.log(`\n${colors.green}✓${colors.reset} Environment configuration complete`);
  console.log(`${colors.dim}  Review .env files and update with your credentials${colors.reset}\n`);
}

/**
 * Display MongoDB setup instructions
 * Shows platform-specific commands for installing and starting MongoDB
 */
function showMongoDBInstructions() {
  console.log('[4/4] MongoDB Setup\n');
  
  const os = getOS();
  const mongoInstalled = commandExists('mongod') || commandExists('mongosh');
  
  if (mongoInstalled) {
    console.log(`${colors.green}✓${colors.reset} MongoDB is installed\n`);
    console.log('To start MongoDB:');
    
    if (os.startsWith('Linux')) {
      console.log('  sudo systemctl start mongodb');
      console.log('  sudo systemctl enable mongodb  # Start on boot');
    } else if (os === 'macOS') {
      console.log('  brew services start mongodb-community');
    } else if (os === 'Windows') {
      console.log('  net start MongoDB');
    }
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} MongoDB not detected\n`);
    console.log('Installation instructions:');
    
    if (os === 'Linux-Arch') {
      console.log('  sudo pacman -S mongodb');
      console.log('  sudo systemctl start mongodb && sudo systemctl enable mongodb');
    } else if (os === 'Linux-Debian') {
      console.log('  sudo apt-get update && sudo apt-get install mongodb');
      console.log('  sudo systemctl start mongodb && sudo systemctl enable mongodb');
    } else if (os === 'macOS') {
      console.log('  brew tap mongodb/brew && brew install mongodb-community');
      console.log('  brew services start mongodb-community');
    } else if (os === 'Windows') {
      console.log('  Download: https://www.mongodb.com/try/download/community');
      console.log('  Select "Install MongoDB as a Service" during installation');
    }
  }
  
  console.log();
}

/**
 * Display final setup instructions
 * Shows next steps for starting development
 */
function showFinalInstructions() {
  console.log(`
${colors.green}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              Setup Completed Successfully                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}

Next Steps:

1. ${colors.cyan}Review environment files${colors.reset}
   • server/.env - Database, email, API keys
   • client/.env - API endpoints

2. ${colors.cyan}Start MongoDB${colors.reset} (if not running)
   Run the appropriate command for your system (see above)

3. ${colors.cyan}Create admin account${colors.reset} (optional)
   npm run create-admin

4. ${colors.cyan}Start development servers${colors.reset}
   npm run start-dev

5. ${colors.cyan}Access application${colors.reset}
   • Frontend: http://localhost:3000
   • GraphQL: http://localhost:4000/graphql

${colors.dim}For detailed documentation, see README.md and new-readme.md${colors.reset}
`);
}

/**
 * Main setup function
 * Orchestrates the entire setup process
 */
async function main() {
  try {
    printBanner();
    await checkPrerequisites();
    await installDependencies();
    await setupEnvironmentFiles();
    showMongoDBInstructions();
    showFinalInstructions();
    
    process.exit(0);
  } catch (error) {
    console.error(`\n${colors.red}✗ Setup failed:${colors.reset}`, error.message || error);
    console.log(`${colors.dim}\nFor help, check the documentation or create an issue.${colors.reset}`);
    process.exit(1);
  }
}

// Execute setup
if (require.main === module) {
  main();
}

module.exports = { main };
