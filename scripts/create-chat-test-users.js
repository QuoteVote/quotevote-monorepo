#!/usr/bin/env node

/**
 * Create Two Test Users for Chat System Testing
 * Creates Alice and Bob with pre-approved accounts
 */

const path = require('path');
const fs = require('fs');

// Test user accounts
const TEST_USERS = [
  {
    email: 'alice@test.com',
    username: 'alice',
    name: 'Alice Smith',
    password: 'test123',
    status: 2, // Active/Approved
    admin: false,
  },
  {
    email: 'bob@test.com',
    username: 'bob',
    name: 'Bob Johnson',
    password: 'test123',
    status: 2, // Active/Approved
    admin: false,
  },
];

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function loadEnvVariables() {
  const rootDir = path.resolve(__dirname, '..');
  const envPath = path.join(rootDir, 'server', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error(`${colors.red}✗${colors.reset} Server .env file not found`);
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      envVars[key] = value;
    }
  }
  
  return envVars;
}

async function createTestUsers() {
  try {
    let mongoose, bcrypt;
    
    try {
      const serverDir = path.resolve(__dirname, '..', 'server');
      try {
        mongoose = require(path.join(serverDir, 'node_modules', 'mongoose'));
        bcrypt = require(path.join(serverDir, 'node_modules', 'bcryptjs'));
      } catch (e) {
        const rootDir = path.resolve(__dirname, '..');
        mongoose = require(path.join(rootDir, 'node_modules', 'mongoose'));
        bcrypt = require(path.join(rootDir, 'node_modules', 'bcryptjs'));
      }
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} Could not load dependencies`);
      throw error;
    }
    
    const envVars = loadEnvVariables();
    const dbUrl = envVars.DATABASE_URL || 'mongodb://localhost:27017/quotevote-dev';
    
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║         Create Chat Test Users (Alice & Bob)              ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('Connecting to MongoDB...');
    console.log(`Database: ${dbUrl}\n`);
    
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`${colors.green}✓${colors.reset} Connected to MongoDB\n`);
    
    const userSchema = new mongoose.Schema({
      username: { type: String, unique: true, lowercase: true, trim: true, required: true },
      name: { type: String },
      email: { type: String, unique: true, lowercase: true, trim: true, required: true },
      status: { type: Number, required: true },
      hash_password: { type: String },
      avatar: { type: Object },
      _followersId: { type: [mongoose.Schema.Types.ObjectId] },
      _followingId: { type: [mongoose.Schema.Types.ObjectId] },
      favorited: { type: Array },
      joined: { type: Date, default: Date.now },
      admin: { type: Boolean, default: false },
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      contributorBadge: { type: Boolean, default: false },
    });
    
    const UserModel = mongoose.model('users', userSchema);
    
    const createdUsers = [];
    
    for (const userData of TEST_USERS) {
      console.log(`Creating user: ${colors.cyan}${userData.name}${colors.reset} (${userData.username})`);
      
      const existingUser = await UserModel.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });
      
      const salt = bcrypt.genSaltSync(10);
      const hash_password = bcrypt.hashSync(userData.password, salt);
      
      let user;
      
      if (existingUser) {
        await UserModel.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              status: userData.status,
              hash_password,
              name: userData.name,
              admin: userData.admin,
            }
          }
        );
        user = await UserModel.findById(existingUser._id);
        console.log(`  ${colors.green}✓${colors.reset} Updated existing user\n`);
      } else {
        const newUser = new UserModel({
          email: userData.email,
          username: userData.username,
          name: userData.name,
          hash_password,
          status: userData.status,
          admin: userData.admin,
          joined: new Date(),
          tokens: 0,
          upvotes: 0,
          downvotes: 0,
          favorited: [],
          _followersId: [],
          _followingId: [],
        });
        
        user = await newUser.save();
        console.log(`  ${colors.green}✓${colors.reset} Created new user\n`);
      }
      
      createdUsers.push({ ...userData, _id: user._id });
    }
    
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║              Test Users Created Successfully!              ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log(`${colors.cyan}User 1 - Alice:${colors.reset}`);
    console.log(`  Email:    ${TEST_USERS[0].email}`);
    console.log(`  Username: ${TEST_USERS[0].username}`);
    console.log(`  Password: ${TEST_USERS[0].password}`);
    console.log(`  ID:       ${createdUsers[0]._id}\n`);
    
    console.log(`${colors.cyan}User 2 - Bob:${colors.reset}`);
    console.log(`  Email:    ${TEST_USERS[1].email}`);
    console.log(`  Username: ${TEST_USERS[1].username}`);
    console.log(`  Password: ${TEST_USERS[1].password}`);
    console.log(`  ID:       ${createdUsers[1]._id}\n`);
    
    console.log(`${colors.yellow}Testing Instructions:${colors.reset}\n`);
    console.log('1. Open two browser windows (or use incognito mode)');
    console.log('2. In Window 1: Login as Alice (alice@test.com / test123)');
    console.log('3. In Window 2: Login as Bob (bob@test.com / test123)');
    console.log('4. Test the chat features:\n');
    console.log('   • Alice adds Bob as a buddy');
    console.log('   • Bob accepts the buddy request');
    console.log('   • Both users should see each other online');
    console.log('   • Send messages and watch typing indicators');
    console.log('   • Set status messages (Away, DND, etc.)');
    console.log('   • Test blocking/unblocking\n');
    
    await mongoose.disconnect();
    console.log(`${colors.green}✓${colors.reset} Complete!\n`);
    
  } catch (error) {
    console.error(`\n${colors.red}✗ Failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

createTestUsers();

