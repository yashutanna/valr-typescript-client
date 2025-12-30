#!/usr/bin/env node

/**
 * Checksum Verification Script (Cross-platform Node.js version)
 * Verifies the integrity of the installed package against CHECKSUMS.txt
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const CHECKSUM_FILE = 'CHECKSUMS.txt';

function sha256File(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function parseChecksums(content) {
  const lines = content.split('\n');
  const checksums = { dist: [], src: [] };
  let currentSection = null;

  for (const line of lines) {
    if (line.includes('## Distribution Files')) {
      currentSection = 'dist';
    } else if (line.includes('## Source Files')) {
      currentSection = 'src';
    } else if (currentSection && line.match(/^[a-f0-9]{64}\s+/)) {
      const [hash, ...pathParts] = line.trim().split(/\s+/);
      const filePath = pathParts.join(' ');
      checksums[currentSection].push({ hash, path: filePath });
    } else if (line.startsWith('Git commit:')) {
      checksums.gitCommit = line.split(':')[1].trim();
    } else if (line.startsWith('Version:')) {
      checksums.version = line.split(':')[1].trim();
    }
  }

  return checksums;
}

function main() {
  console.log('🔍 Verifying package checksums...\n');

  // Check if CHECKSUMS.txt exists
  if (!fs.existsSync(CHECKSUM_FILE)) {
    console.error('❌ CHECKSUMS.txt not found!');
    console.error('   This package may not have been built with checksum verification.');
    process.exit(1);
  }

  // Read and parse checksums
  const checksumContent = fs.readFileSync(CHECKSUM_FILE, 'utf8');
  const checksums = parseChecksums(checksumContent);

  console.log(`📦 Package version: ${checksums.version}`);
  console.log(`🔖 Git commit: ${checksums.gitCommit}`);
  console.log('');

  let failed = 0;
  let verified = 0;
  let missing = 0;

  console.log('Verifying distribution files...');

  // Verify dist files
  for (const { hash: expectedHash, path: filePath } of checksums.dist) {
    const normalizedPath = path.normalize(filePath);

    if (fs.existsSync(normalizedPath)) {
      const actualHash = sha256File(normalizedPath);
      if (expectedHash === actualHash) {
        console.log(`  ✅ ${filePath}`);
        verified++;
      } else {
        console.log(`  ❌ ${filePath} (checksum mismatch!)`);
        console.log(`     Expected: ${expectedHash}`);
        console.log(`     Got:      ${actualHash}`);
        failed++;
      }
    } else {
      console.log(`  ⚠️  ${filePath} (file missing)`);
      missing++;
    }
  }

  console.log('');

  // Check if we have source files (only in repo, not in npm package)
  const hasSrcDir = fs.existsSync('src');
  if (hasSrcDir && checksums.src && checksums.src.length > 0) {
    console.log('Verifying source files...');

    let srcVerified = 0;
    let srcFailed = 0;
    let srcMissing = 0;

    for (const { hash: expectedHash, path: filePath } of checksums.src) {
      const normalizedPath = path.normalize(filePath);

      if (fs.existsSync(normalizedPath)) {
        const actualHash = sha256File(normalizedPath);
        if (expectedHash === actualHash) {
          console.log(`  ✅ ${filePath}`);
          srcVerified++;
        } else {
          console.log(`  ❌ ${filePath} (checksum mismatch!)`);
          console.log(`     Expected: ${expectedHash}`);
          console.log(`     Got:      ${actualHash}`);
          srcFailed++;
        }
      } else {
        console.log(`  ⚠️  ${filePath} (file missing)`);
        srcMissing++;
      }
    }

    verified += srcVerified;
    failed += srcFailed;
    missing += srcMissing;

    console.log('');
  }

  console.log('');

  if (failed === 0 && missing === 0) {
    console.log('✅ All checksums verified successfully!');
    console.log(`   ${verified} file(s) verified`);
    console.log(`   This package matches the official build from commit ${checksums.gitCommit}`);
    process.exit(0);
  } else {
    console.error('❌ Checksum verification failed!');
    if (failed > 0) {
      console.error(`   ${failed} file(s) failed verification`);
    }
    if (missing > 0) {
      console.error(`   ${missing} file(s) missing`);
    }
    console.error('   This package may have been tampered with or corrupted.');
    process.exit(1);
  }
}

main();
