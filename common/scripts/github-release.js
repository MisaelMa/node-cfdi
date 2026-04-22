/**
 * Creates GitHub Releases for packages that were bumped by rush publish.
 *
 * Usage (in GitHub Actions):
 *   node common/scripts/github-release.js
 *
 * Detects which packages changed by comparing git diff on package.json files,
 * then creates a git tag and GitHub Release for each bumped package.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function getChangedPackages() {
  // Find package.json files that were modified (version bumped by rush publish)
  const diff = exec('git diff --name-only HEAD -- "*/package.json"');
  if (!diff) return [];

  const changed = [];
  for (const file of diff.split('\n')) {
    if (!file || file.includes('node_modules') || file.includes('common/')) continue;

    const fullPath = path.resolve(file);
    if (!fs.existsSync(fullPath)) continue;

    const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    if (!pkg.name || !pkg.version) continue;

    // Read CHANGELOG.json if exists for release notes
    const changelogPath = path.join(path.dirname(fullPath), 'CHANGELOG.json');
    let releaseNotes = '';
    if (fs.existsSync(changelogPath)) {
      const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
      const entry = changelog.entries.find(e => e.version === pkg.version);
      if (entry && entry.comments) {
        const sections = [];
        for (const [type, items] of Object.entries(entry.comments)) {
          if (items.length > 0) {
            sections.push(`### ${type}`);
            for (const item of items) {
              sections.push(`- ${item.comment}`);
            }
          }
        }
        releaseNotes = sections.join('\n');
      }
    }

    changed.push({
      name: pkg.name,
      version: pkg.version,
      tag: `${pkg.name}@${pkg.version}`,
      releaseNotes,
    });
  }

  return changed;
}

function createRelease(pkg) {
  const tagExists = (() => {
    try {
      exec(`git rev-parse "${pkg.tag}" 2>/dev/null`);
      return true;
    } catch {
      return false;
    }
  })();

  if (tagExists) {
    console.log(`  Tag ${pkg.tag} already exists, skipping`);
    return;
  }

  // Create annotated tag
  exec(`git tag -a "${pkg.tag}" -m "Release ${pkg.tag}"`);
  console.log(`  Created tag: ${pkg.tag}`);

  // Create GitHub Release via gh CLI
  const title = `${pkg.name} v${pkg.version}`;
  const body = pkg.releaseNotes || `Release ${pkg.name} v${pkg.version}`;
  const isPrerelease = pkg.version.includes('-') ? '--prerelease' : '';

  const bodyFile = path.join('/tmp', `release-body-${Date.now()}.md`);
  fs.writeFileSync(bodyFile, body);

  try {
    exec(`gh release create "${pkg.tag}" --title "${title}" --notes-file "${bodyFile}" ${isPrerelease}`);
    console.log(`  Created release: ${title}`);
  } finally {
    fs.unlinkSync(bodyFile);
  }
}

async function main() {
  const packages = getChangedPackages();

  if (packages.length === 0) {
    console.log('No packages were bumped, skipping releases');
    return;
  }

  console.log(`Found ${packages.length} bumped package(s):`);
  for (const pkg of packages) {
    console.log(`\n${pkg.name}@${pkg.version}`);
    createRelease(pkg);
  }

  // Push all tags at once
  exec('git push --tags');
  console.log('\nAll tags pushed');
}

main().catch(err => {
  console.error('Error creating releases:', err.message);
  process.exit(1);
});
