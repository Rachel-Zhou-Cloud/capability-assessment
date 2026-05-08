#!/usr/bin/env node
/**
* Vercel CLI Login Authorization Script (Cross-Platform)
*/
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

const VERCEL_BIN = '/Users/rachel/local/lib/node_modules/vercel/dist/index.js';
const LOG_FILE = path.join(process.cwd(), '.vercel-tmp', 'login.log');

function log(msg) {
  console.error(msg);
}

function checkLoginStatus() {
  log('Checking login status...');
  try {
    const result = spawnSync('node', [VERCEL_BIN, 'whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error') && !output.includes('not logged in')) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startBackgroundLogin() {
  const tmpDir = path.join(process.cwd(), '.vercel-tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('node', [VERCEL_BIN, 'login'], {
    detached: true,
    stdio: ['ignore', logStream, logStream]
  });
  child.unref();
  log(`Background login process started (PID: ${child.pid})`);
  log(`Log file: ${LOG_FILE}`);
  fs.writeFileSync(LOG_FILE + '.pid', String(child.pid));
  return child.pid;
}

function openBrowser(url) {
  try {
    spawnSync('open', [url], { stdio: 'ignore' });
    log('Browser opened automatically');
  } catch (error) {
    log('Please open the URL manually');
  }
}

async function waitForAuthUrl() {
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+/);
        if (match) return match[0];
      }
    } catch {}
  }
  return null;
}

async function main() {
  log('========================================');
  log('Vercel CLI Login Authorization');
  log('========================================');
  log('');

  if (checkLoginStatus()) {
    log('');
    log('Already logged in, no need to login again');
    console.log(JSON.stringify({ status: 'already_logged_in', message: 'Already logged in' }));
    process.exit(0);
  }

  log('Starting login authorization...');
  const loginPid = startBackgroundLogin();
  log('Waiting for authorization URL...');

  const authUrl = await waitForAuthUrl();
  if (authUrl) {
    log('');
    log('Authorization URL extracted');
    openBrowser(authUrl);
    console.log(JSON.stringify({ status: 'needs_auth', auth_url: authUrl, log_file: LOG_FILE }));
  } else {
    log('Failed to get authorization URL');
    try {
      const content = fs.readFileSync(LOG_FILE, 'utf8');
      log('Log content: ' + content);
    } catch {}
    process.exit(1);
  }
}
main();
