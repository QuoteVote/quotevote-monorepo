#!/usr/bin/env node

/**
 * Migration: Backfill `status` field on existing posts
 *
 * - Posts with `deleted: true` → status: 'SOFT_DELETED_BY_AUTHOR', deletedAt: now
 * - Posts with `deleted: false` or unset → status: 'ACTIVE'
 *
 * Idempotent — only updates posts that do not yet have a `status` field.
 *
 * Usage:
 *   node scripts/migrate-post-status.js
 */

const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
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
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  }

  return envVars;
}

async function migrate() {
  let mongoose;
  try {
    const serverDir = path.resolve(__dirname, '..', 'server');
    try {
      mongoose = require(path.join(serverDir, 'node_modules', 'mongoose'));
    } catch (e) {
      const rootDir = path.resolve(__dirname, '..');
      mongoose = require(path.join(rootDir, 'node_modules', 'mongoose'));
    }
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Could not load mongoose`);
    process.exit(1);
  }

  const envVars = loadEnvVariables();
  const dbUrl = envVars.DATABASE_URL || 'mongodb://localhost:27017/quotevote-dev';

  console.log('Connecting to MongoDB...');
  console.log(`${colors.dim}Database: ${dbUrl}${colors.reset}\n`);

  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`${colors.green}✓${colors.reset} Connected\n`);

  const db = mongoose.connection.db;
  const posts = db.collection('posts');

  // Only update posts without a status field (idempotent)
  const withoutStatus = { status: { $exists: false } };

  const total = await posts.countDocuments(withoutStatus);
  console.log(`Found ${total} posts without a status field.\n`);

  if (total === 0) {
    console.log(`${colors.green}✓${colors.reset} Nothing to migrate — all posts already have a status.`);
    await mongoose.disconnect();
    return;
  }

  // Backfill deleted posts → SOFT_DELETED_BY_AUTHOR
  const deletedResult = await posts.updateMany(
    { ...withoutStatus, deleted: true },
    {
      $set: {
        status: 'SOFT_DELETED_BY_AUTHOR',
        deletedAt: new Date(),
      },
    },
  );
  console.log(
    `${colors.green}✓${colors.reset} Set ${deletedResult.modifiedCount} deleted posts → SOFT_DELETED_BY_AUTHOR`,
  );

  // Backfill active posts → ACTIVE
  const activeResult = await posts.updateMany(
    { ...withoutStatus },
    {
      $set: {
        status: 'ACTIVE',
      },
    },
  );
  console.log(
    `${colors.green}✓${colors.reset} Set ${activeResult.modifiedCount} active posts → ACTIVE`,
  );

  console.log(`\n${colors.green}✓${colors.reset} Migration complete.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error(`${colors.red}✗ Migration failed:${colors.reset}`, err.message);
  process.exit(1);
});
