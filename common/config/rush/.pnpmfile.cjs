'use strict';

/**
 * When using the PNPM package manager, you can use pnpmfile.js to workaround
 * dependencies that have mistakes in their package.json file.  (This feature is
 * functionally similar to Yarn's "resolutions".)
 *
 * For details, see the PNPM documentation:
 * https://pnpm.js.org/docs/en/hooks.html
 *
 * IMPORTANT: SINCE THIS FILE CONTAINS EXECUTABLE CODE, MODIFYING IT IS LIKELY TO INVALIDATE
 * ANY CACHED DEPENDENCY ANALYSIS.  After any modification to pnpmfile.js, it's recommended to run
 * "rush update --full" so that PNPM will recalculate all version selections.
 */
module.exports = {
  hooks: {
    readPackage
  }
};

/**
 * This hook is invoked during installation before a package's dependencies
 * are selected.
 * The `packageJson` parameter is the deserialized package.json
 * contents for the package that is about to be installed.
 * The `context` parameter provides a log() function.
 * The return value is the updated object.
 */
function readPackage(packageJson, context) {
  const overrides = {
    'minimatch': '>=9.0.5',
    'picomatch': '>=4.0.2',
    'rollup': '>=4.30.1',
    'serialize-javascript': '>=6.0.2',
    'flatted': '>=3.3.3',
    'brace-expansion': '>=2.0.1',
    'yaml': '>=2.7.1',
    'immutable': '>=5.1.2',
  };

  for (const [pkg, version] of Object.entries(overrides)) {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      packageJson.dependencies[pkg] = version;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[pkg]) {
      packageJson.devDependencies[pkg] = version;
    }
  }

  return packageJson;
}
