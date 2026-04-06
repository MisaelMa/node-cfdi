/**
 * Custom publish script that uses `npm publish` instead of `pnpm publish`.
 * This enables npm's built-in OIDC Trusted Publishing support.
 *
 * Usage:
 *   node common/scripts/npm-publish.js [--tag <tag>] [--dry-run]
 *
 * Reads rush.json to find all packages with shouldPublish: true,
 * checks if the local version differs from the published version,
 * and publishes using `npm publish --provenance --access public`.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function exec(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf-8', cwd: ROOT, ...opts }).trim();
}

function getPublishedVersion(packageName) {
  try {
    return exec(`npm view ${packageName} version 2>/dev/null`);
  } catch {
    return null;
  }
}

function getLocalVersion(packageJsonPath) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return pkg.version;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { tag: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tag' && args[i + 1]) {
      result.tag = args[++i];
    }
    if (args[i] === '--dry-run') {
      result.dryRun = true;
    }
  }
  return result;
}

async function main() {
  const { tag, dryRun } = parseArgs();
  const rushJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'rush.json'), 'utf-8'));

  const publishable = rushJson.projects.filter(p => p.shouldPublish === true);

  // Debug info
  console.log('='.repeat(60));
  console.log('  npm-publish.js - Debug Info');
  console.log('='.repeat(60));
  console.log(`npm version: ${exec('npm --version')}`);
  console.log(`node version: ${exec('node --version')}`);
  console.log(`tag: ${tag || 'latest'}`);
  console.log(`dry-run: ${dryRun}`);
  console.log(`publishable packages: ${publishable.length}`);
  console.log('');

  // Check npm auth
  console.log('--- npm auth check ---');
  try {
    const whoami = exec('npm whoami 2>&1');
    console.log(`npm whoami: ${whoami}`);
  } catch (err) {
    console.log(`npm whoami: FAILED - ${err.stderr || err.message}`);
    console.log('WARNING: npm is not authenticated. Trusted Publishing OIDC will be used during publish.');
  }
  console.log('');

  // Check .npmrc
  console.log('--- .npmrc files ---');
  const homeNpmrc = path.join(process.env.HOME || '~', '.npmrc');
  if (fs.existsSync(homeNpmrc)) {
    const content = fs.readFileSync(homeNpmrc, 'utf-8');
    console.log(`~/.npmrc exists (${content.split('\n').length} lines)`);
    content.split('\n').forEach(line => {
      if (line.includes('authToken') || line.includes('_auth')) {
        console.log(`  ${line.replace(/=.*/, '=***')}`);
      } else if (line.trim()) {
        console.log(`  ${line}`);
      }
    });
  } else {
    console.log('~/.npmrc: not found');
  }
  console.log('');

  // Check env
  console.log('--- Environment ---');
  console.log(`ACTIONS_ID_TOKEN_REQUEST_URL: ${process.env.ACTIONS_ID_TOKEN_REQUEST_URL ? 'SET' : 'NOT SET'}`);
  console.log(`ACTIONS_ID_TOKEN_REQUEST_TOKEN: ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN ? 'SET' : 'NOT SET'}`);
  console.log(`NPM_AUTH_TOKEN: ${process.env.NPM_AUTH_TOKEN ? 'SET' : 'NOT SET'}`);
  console.log(`NODE_AUTH_TOKEN: ${process.env.NODE_AUTH_TOKEN ? 'SET' : 'NOT SET'}`);
  console.log(`NPM_CONFIG_PROVENANCE: ${process.env.NPM_CONFIG_PROVENANCE || 'NOT SET'}`);
  console.log('');
  console.log('='.repeat(60));
  console.log('  Starting publish');
  console.log('='.repeat(60));
  console.log('');

  let published = 0;
  let skipped = 0;
  let failed = 0;

  for (const project of publishable) {
    const pkgJsonPath = path.join(ROOT, project.projectFolder, 'package.json');
    const localVersion = getLocalVersion(pkgJsonPath);
    const publishedVersion = getPublishedVersion(project.packageName);

    if (localVersion === publishedVersion) {
      console.log(`SKIP ${project.packageName}@${localVersion} (already published)`);
      skipped++;
      continue;
    }

    console.log(`PUBLISH ${project.packageName}@${localVersion} (npm: ${publishedVersion || 'not found'})`);

    const distPath = path.join(ROOT, project.projectFolder, 'dist');
    if (!fs.existsSync(distPath)) {
      console.log(`  WARN: dist/ folder not found at ${distPath}`);
    } else {
      const files = fs.readdirSync(distPath);
      console.log(`  dist/ contains: ${files.join(', ')}`);
    }

    const publishCmd = [
      'npm publish',
      '--provenance',
      '--access public',
      tag ? `--tag ${tag}` : '',
      dryRun ? '--dry-run' : '',
    ].filter(Boolean).join(' ');

    console.log(`  CMD: ${publishCmd}`);
    console.log(`  CWD: ${project.projectFolder}`);

    try {
      const output = exec(publishCmd, {
        cwd: path.join(ROOT, project.projectFolder),
      });
      console.log(`  OUTPUT: ${output}`);
      console.log(`  OK ${project.packageName}@${localVersion}`);
      published++;
    } catch (err) {
      console.error(`  FAIL ${project.packageName}@${localVersion}`);
      if (err.stdout) console.error(`  STDOUT: ${err.stdout}`);
      if (err.stderr) console.error(`  STDERR: ${err.stderr}`);
      if (!err.stdout && !err.stderr) console.error(`  ERROR: ${err.message}`);
      failed++;
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log(`  Results`);
  console.log('='.repeat(60));
  console.log(`Published: ${published}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

function getPublishedVersionWithTag(packageName, tag) {
  try {
    return exec(`npm view ${packageName}@${tag} version 2>/dev/null`);
  } catch {
    return null;
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
