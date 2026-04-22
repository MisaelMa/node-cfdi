// Test plano, corre con: node common/scripts/github-actions.test.js
// Filtro opcional: node common/scripts/github-actions.test.js "dev → beta"
// No depende de vitest ni jest — usa node:assert y un runner mínimo.

const assert = require('node:assert/strict');
const script = require('./github-actions.js');

// ---------- Helpers ----------

function makeContext({ head, base, eventName = 'pull_request' }) {
  return {
    eventName,
    ref: `refs/heads/${base}`,
    repo: { owner: 'MisaelMa', repo: 'node-cfdi' },
    payload: {
      pull_request: {
        number: 1,
        head: { ref: head },
        base: { ref: base },
      },
    },
  };
}

function makeGithub(commitMessages) {
  return {
    rest: {
      pulls: {
        listCommits: async () => ({
          data: commitMessages.map(message => ({ commit: { message } })),
        }),
      },
    },
  };
}

function makeExecaSpy() {
  const calls = [];
  const execa = async (command, params) => {
    calls.push({ command, params: [...params] });
    return '';
  };
  return { execa, calls };
}

function getPoliciesCalled(calls) {
  return calls.map(c => {
    const i = c.params.indexOf('--version-policy');
    return c.params[i + 1];
  });
}

// Simula lo que haría `rush version` sobre un estado de versiones.
function makeRushSimulator(initialVersions) {
  const versions = { ...initialVersions };
  const transitions = [];

  function parseVersion(v) {
    const [base, pre] = v.split('-');
    if (!pre) return { base, tag: null, n: null };
    const [tag, nStr] = pre.split('.');
    return { base, tag, n: Number(nStr) };
  }

  function bumpBase(base, kind) {
    const [maj, min, pat] = base.split('.').map(Number);
    if (kind === 'patch') return `${maj}.${min}.${pat + 1}`;
    if (kind === 'minor') return `${maj}.${min + 1}.0`;
    if (kind === 'major') return `${maj + 1}.0.0`;
    return base;
  }

  function compute(current, params) {
    const overrideBumpIdx = params.indexOf('--override-bump');
    const overrideBump = overrideBumpIdx >= 0 ? params[overrideBumpIdx + 1] : null;
    const overrideIdIdx = params.indexOf('--override-prerelease-id');
    const overrideId = overrideIdIdx >= 0 ? params[overrideIdIdx + 1] : null;

    const cur = parseVersion(current);

    if (!overrideBump) {
      if (cur.tag) return cur.base;
      return bumpBase(cur.base, 'patch');
    }

    if (overrideBump === 'prerelease' && overrideId) {
      if (cur.tag === overrideId) {
        return `${cur.base}-${cur.tag}.${cur.n + 1}`;
      }
      return `${cur.base}-${overrideId}.0`;
    }

    if (overrideBump === 'patch') {
      return `${bumpBase(cur.base, 'patch')}-${cur.tag || 'dev'}.0`;
    }

    return current;
  }

  const execa = async (command, params) => {
    if (command !== 'rush') return '';
    const scopeIdx = params.indexOf('--version-policy');
    const scope = params[scopeIdx + 1];
    const from = versions[scope];
    if (!from) return '';

    const to = compute(from, params);

    // Rush real valida: target no puede ser menor que source (SemVer).
    const fromP = parseVersion(from);
    const toP = parseVersion(to);
    if (fromP.base === toP.base && fromP.tag && toP.tag) {
      if (fromP.tag > toP.tag) {
        throw new Error(
          `subprocess error exit 1, \nERROR: Version ${from} in package @cfdi/${scope} is higher than locked\nversion ${to}.\n`
        );
      }
    }

    versions[scope] = to;
    transitions.push({ policy: scope, from, to, params: [...params] });
    return '';
  };

  return { execa, versions, transitions };
}

// ---------- Runner mínimo ----------

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

async function run() {
  const filter = process.argv[2];
  const selected = filter
    ? tests.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    : tests;

  if (filter && selected.length === 0) {
    console.log(`No tests match filter: "${filter}"`);
    console.log(`\nAvailable tests:`);
    for (const t of tests) console.log(`  - ${t.name}`);
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  for (const { name, fn } of selected) {
    try {
      await fn();
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
      passed++;
    } catch (err) {
      console.log(`  \x1b[31m✗\x1b[0m ${name}`);
      console.log(`    ${err.message}`);
      failed++;
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

// ---------- Tests ----------

test('feature/X → dev: bumpea prerelease con id alpha (rama dev publica tag alpha)', async () => {
  const { execa, calls } = makeExecaSpy();
  await script({
    github: makeGithub(['feat(transform): nueva cosa']),
    context: makeContext({ head: 'feature/X', base: 'dev' }),
    core: {},
    execa,
  });

  const transformCall = calls.find(c => c.params.includes('transform'));
  assert.ok(transformCall);
  assert.deepEqual(transformCall.params, [
    'version',
    '--version-policy', 'transform',
    '--bump',
    '--override-bump', 'prerelease',
    '--override-prerelease-id', 'alpha',
  ]);
});

test('fix/Y → beta: bumpea prerelease con id beta', async () => {
  const { execa, calls } = makeExecaSpy();
  await script({
    github: makeGithub(['fix(transform): bug']),
    context: makeContext({ head: 'fix/Y', base: 'beta' }),
    core: {},
    execa,
  });

  const transformCall = calls.find(c => c.params.includes('transform'));
  assert.ok(transformCall);
  assert.ok(transformCall.params.includes('beta'));
  assert.ok(transformCall.params.includes('--override-prerelease-id'));
});

test('hotfix/Z → main: bump sin prerelease id', async () => {
  const { execa, calls } = makeExecaSpy();
  await script({
    github: makeGithub(['fix(transform): urgente']),
    context: makeContext({ head: 'hotfix/Z', base: 'main' }),
    core: {},
    execa,
  });

  const transformCall = calls.find(c => c.params.includes('transform'));
  assert.ok(transformCall);
  assert.ok(!transformCall.params.includes('--override-prerelease-id'));
});

test('scope elements arrastra dependencias xml, complementos, transform', async () => {
  const { execa, calls } = makeExecaSpy();
  await script({
    github: makeGithub(['feat(elements): nuevo']),
    context: makeContext({ head: 'feature/X', base: 'dev' }),
    core: {},
    execa,
  });

  const policies = getPoliciesCalled(calls);
  for (const expected of ['elements', 'xml', 'complementos', 'transform']) {
    assert.ok(policies.includes(expected), `falta ${expected}`);
  }
});

test('commits sin scope reconocido no disparan ningún rush version', async () => {
  const { execa, calls } = makeExecaSpy();
  await script({
    github: makeGithub(['chore: bump', 'docs: readme']),
    context: makeContext({ head: 'feature/X', base: 'dev' }),
    core: {},
    execa,
  });

  assert.equal(calls.length, 0);
});

// ---------- Tests con simulador (números y tags visibles) ----------

test('SIMULACIÓN dev → beta: transform 4.0.14-alpha.5 → 4.0.14-beta.0 (FIX aplicado)', async () => {
  const sim = makeRushSimulator({
    transform: '4.0.14-alpha.5',
  });

  await script({
    github: makeGithub(['feat(transform): cambio']),
    context: makeContext({ head: 'dev', base: 'beta' }),
    core: {},
    execa: sim.execa,
  });

  const t = sim.transitions.find(tr => tr.policy === 'transform');
  console.log('\n    ┌─ Simulación dev → beta (FIX) ───────────────────┐');
  console.log(`    │ transform: ${t.from}  →  ${t.to}     │`);
  console.log(`    │ tag: alpha  →  beta  (beta > alpha, OK)         │`);
  console.log('    └─────────────────────────────────────────────────┘');

  assert.equal(t.from, '4.0.14-alpha.5');
  assert.equal(t.to, '4.0.14-beta.0');
});

test('SIMULACIÓN feature/X → dev: transform 4.0.14-alpha.5 → 4.0.14-alpha.6', async () => {
  const sim = makeRushSimulator({
    transform: '4.0.14-alpha.5',
  });

  await script({
    github: makeGithub(['feat(transform): nueva cosa']),
    context: makeContext({ head: 'feature/X', base: 'dev' }),
    core: {},
    execa: sim.execa,
  });

  const t = sim.transitions.find(tr => tr.policy === 'transform');
  console.log('\n    ┌─ Simulación feature/X → dev ────────────────────┐');
  console.log(`    │ transform: ${t.from}  →  ${t.to}   │`);
  console.log(`    │ tag: alpha  →  alpha  (mismo tag, ++contador)   │`);
  console.log('    └─────────────────────────────────────────────────┘');

  assert.equal(t.from, '4.0.14-alpha.5');
  assert.equal(t.to, '4.0.14-alpha.6');
});

test('SIMULACIÓN fix/Y → beta: transform 4.0.14-beta.2 → 4.0.14-beta.3', async () => {
  const sim = makeRushSimulator({
    transform: '4.0.14-beta.2',
  });

  await script({
    github: makeGithub(['fix(transform): bug']),
    context: makeContext({ head: 'fix/Y', base: 'beta' }),
    core: {},
    execa: sim.execa,
  });

  const t = sim.transitions.find(tr => tr.policy === 'transform');
  console.log('\n    ┌─ Simulación fix/Y → beta ───────────────────────┐');
  console.log(`    │ transform: ${t.from}  →  ${t.to}      │`);
  console.log(`    │ tag: beta  →  beta  (mismo tag, ++contador)     │`);
  console.log('    └─────────────────────────────────────────────────┘');

  assert.equal(t.from, '4.0.14-beta.2');
  assert.equal(t.to, '4.0.14-beta.3');
});

test('SIMULACIÓN beta → main: transform 4.0.14-beta.3 → 4.0.14 (estabiliza)', async () => {
  const sim = makeRushSimulator({
    transform: '4.0.14-beta.3',
  });

  await script({
    github: makeGithub(['feat(transform): estable']),
    context: makeContext({ head: 'beta', base: 'main' }),
    core: {},
    execa: sim.execa,
  });

  const t = sim.transitions.find(tr => tr.policy === 'transform');
  console.log('\n    ┌─ Simulación beta → main ────────────────────────┐');
  console.log(`    │ transform: ${t.from}  →  ${t.to}            │`);
  console.log(`    │ tag: beta  →  (ninguno, versión estable)        │`);
  console.log('    └─────────────────────────────────────────────────┘');

  assert.equal(t.from, '4.0.14-beta.3');
  assert.equal(t.to, '4.0.14');
});

run();
