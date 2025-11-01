#!/usr/bin/env node

/**
 * QuoteVote Admin Account Creation Script
 * Creates admin account with static credentials
 * 
 * This script:
 * 1. Loads environment configuration
 * 2. Connects to local MongoDB
 * 3. Creates or updates admin user account (non-interactive)
 * 4. Provides login credentials
 */

const path = require('path');
const fs = require('fs');

// ANSI color codes - minimal usage for better readability
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Static admin account credentials
const ADMIN_ACCOUNT = {
  email: 'admin@quotevote.local',
  username: 'admin',
  name: 'Admin User',
  password: 'admin123',
  status: 2, // Active/Approved
  admin: true,
};

/**
 * Print startup banner
 */
function printBanner() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║            QuoteVote - Admin Account Creator              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
}

/**
 * Load environment variables from server/.env file
 * @returns {Object} Parsed environment variables
 */
function loadEnvVariables() {
  const rootDir = path.resolve(__dirname, '..');
  const envPath = path.join(rootDir, 'server', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error(`${colors.red}✗${colors.reset} Server .env file not found`);
    console.log('  Run setup first: npm run setup\n');
    process.exit(1);
  }
  
  // Parse .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      envVars[key] = value;
    }
  }
  
  return envVars;
}

/**
 * Create or update admin account in MongoDB
 * Creates account with static credentials (non-interactive)
 */
async function createAdminAccount() {
  try {
    // Load mongoose and bcrypt
    let mongoose, bcrypt;
    
    try {
      // Try to require from server node_modules first
      const serverDir = path.resolve(__dirname, '..', 'server');
      try {
        mongoose = require(path.join(serverDir, 'node_modules', 'mongoose'));
        bcrypt = require(path.join(serverDir, 'node_modules', 'bcryptjs'));
      } catch (e) {
        // Fallback to workspace root node_modules
        const rootDir = path.resolve(__dirname, '..');
        mongoose = require(path.join(rootDir, 'node_modules', 'mongoose'));
        bcrypt = require(path.join(rootDir, 'node_modules', 'bcryptjs'));
      }
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} Could not load required dependencies`);
      console.log('  Ensure dependencies are installed: npm run setup\n');
      throw error;
    }
    
    // Load environment variables
    const envVars = loadEnvVariables();
    const dbUrl = envVars.DATABASE_URL || 'mongodb://localhost:27017/quotevote-dev';
    
    console.log('Connecting to MongoDB...');
    console.log(`${colors.dim}Database: ${dbUrl}${colors.reset}\n`);
    
    // Connect to MongoDB
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`${colors.green}✓${colors.reset} Connected to MongoDB\n`);
    
    // Define User schema
    const userSchema = new mongoose.Schema({
      username: { type: String, unique: true, lowercase: true, trim: true, required: true },
      name: { type: String },
      companyName: { type: String },
      email: { type: String, unique: true, lowercase: true, trim: true, required: true },
      status: { type: Number, required: true },
      plan: { type: String, trim: true, default: 'personal' },
      hash_password: { type: String },
      tokens: { type: Number, default: 0 },
      avatar: { type: Object },
      _followersId: { type: [mongoose.Schema.Types.ObjectId] },
      _followingId: { type: [mongoose.Schema.Types.ObjectId] },
      favorited: { type: Array },
      joined: { type: Date, default: Date.now },
      admin: { type: Boolean, required: true, default: false },
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      contributorBadge: { type: Boolean, default: false },
    });
    
    const UserModel = mongoose.model('users', userSchema);
    
    console.log('Creating admin account...');
    console.log(`${colors.dim}Email: ${ADMIN_ACCOUNT.email}${colors.reset}`);
    console.log(`${colors.dim}Username: ${ADMIN_ACCOUNT.username}${colors.reset}\n`);
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: ADMIN_ACCOUNT.email }, { username: ADMIN_ACCOUNT.username }]
    });
    
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(ADMIN_ACCOUNT.password, salt);
    
    if (existingUser) {
      // Update existing user to admin
      await UserModel.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            admin: true,
            status: ADMIN_ACCOUNT.status,
            hash_password,
            name: ADMIN_ACCOUNT.name,
          }
        }
      );
      
      console.log(`${colors.green}✓${colors.reset} Admin account updated\n`);
      
    } else {
      // Create new admin user
      const adminUser = new UserModel({
        email: ADMIN_ACCOUNT.email,
        username: ADMIN_ACCOUNT.username,
        name: ADMIN_ACCOUNT.name,
        hash_password,
        status: ADMIN_ACCOUNT.status,
        admin: ADMIN_ACCOUNT.admin,
        joined: new Date(),
        tokens: 0,
        upvotes: 0,
        downvotes: 0,
        favorited: [],
        _followersId: [],
        _followingId: [],
      });
      
      await adminUser.save();
      
      console.log(`${colors.green}✓${colors.reset} Admin account created\n`);
    }
    
    // Display credentials
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                 Admin Account Ready                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Login Credentials:

  ${colors.cyan}Email:${colors.reset}    ${ADMIN_ACCOUNT.email}
  ${colors.cyan}Username:${colors.reset} ${ADMIN_ACCOUNT.username}
  ${colors.cyan}Password:${colors.reset} ${ADMIN_ACCOUNT.password}
  ${colors.cyan}Role:${colors.reset}     Administrator

Quick Start:

  1. Start the servers
     ${colors.dim}npm run start-dev${colors.reset}

  2. Open the application
     ${colors.dim}http://localhost:3000${colors.reset}

  3. Login with the credentials above

${colors.yellow}Note:${colors.reset}
${colors.dim}This is a development admin account with static credentials.
For production, change the password after first login.${colors.reset}
`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    
  } catch (error) {
    console.error(`\n${colors.red}✗ Failed to create admin account:${colors.reset}`, error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log(`\n${colors.yellow}MongoDB connection failed${colors.reset}`);
      console.log('Ensure MongoDB is installed and running');
      console.log('Check DATABASE_URL in server/.env\n');
      console.log('Start MongoDB:');
      console.log(`  ${colors.dim}Linux:   sudo systemctl start mongodb${colors.reset}`);
      console.log(`  ${colors.dim}macOS:   brew services start mongodb-community${colors.reset}`);
      console.log(`  ${colors.dim}Windows: net start MongoDB${colors.reset}`);
    }
    
    process.exit(1);
  }
}

/**
 * Main entry point
 * Displays banner and initiates admin account creation
 */
async function main() {
  printBanner();
  await createAdminAccount();
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { createAdminAccount, ADMIN_ACCOUNT };

