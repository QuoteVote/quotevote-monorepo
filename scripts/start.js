#!/usr/bin/env node

/**
 * QuoteVote Monorepo Start Script
 * Cross-platform start script for Windows, macOS, and Linux (Arch & Debian)
 * 
 * This script:
 * 1. Verifies MongoDB is running
 * 2. Clears any processes on ports 4000 and 3000
 * 3. Starts both backend and frontend servers concurrently
 * 4. Handles graceful shutdown on Ctrl+C
 */

const { spawn, execSync } = require('child_process');
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

/**
 * Detect operating system
 * @returns {string} Operating system name
 */
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
 * Execute command silently
 * @param {string} command - Command to execute
 * @returns {boolean} Success status
 */
function runCommandSilent(command) {
  try {
    execSync(command, { stdio: 'ignore', shell: true });
    return true;
  } catch {
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
 * Print startup banner
 */
function printBanner() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          QuoteVote Development - Starting Servers         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
}

/**
 * Check MongoDB status and attempt to start if needed
 * @returns {Promise<boolean>} True if MongoDB is running
 */
async function checkMongoDB() {
  console.log('Checking MongoDB status...\n');
  
  const os = getOS();
  
  // Check if MongoDB is installed
  if (!commandExists('mongod') && !commandExists('mongosh') && !commandExists('mongo')) {
    console.log(`${colors.red}✗${colors.reset} MongoDB not detected`);
    console.log('  MongoDB is required to run the application');
    console.log('  See installation instructions in new-readme.md\n');
    return false;
  }
  
  if (os.startsWith('Linux')) {
    // Check if MongoDB service is running
    const isRunning = runCommandSilent('systemctl is-active --quiet mongodb') || 
                     runCommandSilent('systemctl is-active --quiet mongod');
    
    if (!isRunning) {
      console.log(`${colors.yellow}⚠${colors.reset} MongoDB not running, attempting to start...`);
      
      // Try to start MongoDB
      const started = runCommandSilent('sudo systemctl start mongodb') || 
                     runCommandSilent('sudo systemctl start mongod');
      
      if (started) {
        console.log(`${colors.green}✓${colors.reset} MongoDB started successfully`);
        // Wait for MongoDB to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`${colors.red}✗${colors.reset} Could not start MongoDB automatically`);
        console.log('  Please run: sudo systemctl start mongodb\n');
        return false;
      }
    } else {
      console.log(`${colors.green}✓${colors.reset} MongoDB is running`);
    }
  } else if (os === 'macOS') {
    const isRunning = runCommandSilent('pgrep -x mongod');
    
    if (!isRunning) {
      console.log(`${colors.yellow}⚠${colors.reset} MongoDB not running`);
      console.log('  Please run: brew services start mongodb-community\n');
      return false;
    } else {
      console.log(`${colors.green}✓${colors.reset} MongoDB is running`);
    }
  } else if (os === 'Windows') {
    try {
      const output = execSync('sc query MongoDB', { encoding: 'utf8', stdio: 'pipe' });
      if (output.includes('RUNNING')) {
        console.log(`${colors.green}✓${colors.reset} MongoDB is running`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} MongoDB not running`);
        console.log('  Please run: net start MongoDB\n');
        return false;
      }
    } catch {
      console.log(`${colors.yellow}⚠${colors.reset} Could not verify MongoDB status`);
      console.log('  Ensure MongoDB is installed and running\n');
    }
  }
  
  return true;
}

/**
 * Clear any processes running on required ports
 * Kills processes on ports 4000 and 3000
 */
async function clearPorts() {
  console.log('\nClearing ports 4000 and 3000...');
  
  const os = getOS();
  const ports = [4000, 3000];
  let killedAny = false;
  
  for (const port of ports) {
    let killed = false;
    
    if (os === 'Windows') {
      // Windows: Find and kill process
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
        const lines = output.split('\n');
        const pids = new Set();
        
        for (const line of lines) {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            pids.add(match[1]);
          }
        }
        
        for (const pid of pids) {
          try {
            execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
            killed = true;
          } catch {}
        }
      } catch {}
    } else {
      // Unix-like systems (Linux, macOS)
      try {
        const output = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
        const pids = output.trim().split('\n').filter(Boolean);
        
        for (const pid of pids) {
          try {
            process.kill(parseInt(pid, 10), 'SIGTERM');
            killed = true;
          } catch {}
        }
      } catch {}
    }
    
    if (killed) {
      console.log(`${colors.dim}  Cleared port ${port}${colors.reset}`);
      killedAny = true;
    }
  }
  
  if (!killedAny) {
    console.log(`${colors.green}✓${colors.reset} Ports are available`);
  } else {
    console.log(`${colors.green}✓${colors.reset} Ports cleared`);
  }
}

/**
 * Start both backend and frontend development servers
 * Uses npm run dev which starts servers concurrently
 */
function startServers() {
  console.log('\nStarting development servers...\n');
  
  console.log('Services will be available at:');
  console.log(`  ${colors.cyan}Backend:${colors.reset}  http://localhost:4000`);
  console.log(`  ${colors.cyan}GraphQL:${colors.reset}  http://localhost:4000/graphql`);
  console.log(`  ${colors.cyan}Frontend:${colors.reset} http://localhost:3000`);
  console.log(`\n${colors.dim}Press Ctrl+C to stop both servers${colors.reset}`);
  console.log('─'.repeat(60) + '\n');
  
  const rootDir = path.resolve(__dirname, '..');
  
  // Verify npx is available
  if (!commandExists('npx')) {
    console.error(`${colors.red}✗ npx not found${colors.reset}`);
    console.log('  Please install Node.js and npm\n');
    process.exit(1);
  }
  
  // Start both servers using npm run dev
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const devProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process exit
  devProcess.on('close', (code) => {
    console.log(`\n${colors.dim}Servers stopped${colors.reset}`);
    process.exit(code || 0);
  });
  
  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log(`\n${colors.dim}Shutting down...${colors.reset}`);
    devProcess.kill('SIGINT');
    process.exit(0);
  });
  
  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.log(`\n${colors.dim}Shutting down...${colors.reset}`);
    devProcess.kill('SIGTERM');
    process.exit(0);
  });
}

/**
 * Main startup function
 * Orchestrates MongoDB check, port clearing, and server startup
 */
async function main() {
  try {
    printBanner();
    
    // Verify MongoDB is running
    const mongoReady = await checkMongoDB();
    if (!mongoReady) {
      console.log(`${colors.red}✗ Cannot start without MongoDB${colors.reset}\n`);
      process.exit(1);
    }
    
    // Clear any processes on required ports
    await clearPorts();
    
    // Brief delay to ensure ports are freed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start both development servers
    startServers();
    
  } catch (error) {
    console.error(`\n${colors.red}✗ Startup failed:${colors.reset}`, error.message || error);
    console.log(`${colors.dim}Check the error above and try again${colors.reset}\n`);
    process.exit(1);
  }
}

// Execute startup
if (require.main === module) {
  main();
}

module.exports = { main };

