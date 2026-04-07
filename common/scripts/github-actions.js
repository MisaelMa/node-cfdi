
function getDependences(scope) {
  const dependencies = {
    xml: {
      xml: true,
    },
    'only-complementos':{
      complementos: true,
    },
    complementos:{
      complementos: true,
      xml: true
    },
    utils: {
      pdf: true,
      utils: true,
    },
    csd: {
      csd: true,
      xml: true,
    },
    csf: {
      csf: true,
    },
    openssl: {
      openssl: true,
      csd: true,
      xml: true,
    },
    saxon: {
      saxon: true,
      xml: true,
    },
    catalogs: {
      catalogs: true,
      xml: true,
    },
    curp: {
      curp: true,
    },
    pdf: {
      pdf: true,
    },
    rfc: {
      rfc: true,
    },
    xsd: {
      xsd: true,
      xml: true,
      complementos: true,
    },
    transform: {
      transform: true,
      xml: true
    },
    types: {
      types: true,
      xml: true,
      complementos: true
    },
    elements: {
      elements: true,
      xml: true,
      complementos: true,
      transform: true
    },
    expresiones: {
      expresiones: true
    },
    '2json': {
      '2json': true
    },
    designs: {
      designs: true
    },
    sat: {
      sat: true
    },
    estado: {
      estado: true
    },
    validador: {
      validador: true
    },
    cleaner: {
      cleaner: true
    },
    auth: {
      auth: true
    },
    descarga: {
      descarga: true
    },
    cancelacion: {
      cancelacion: true
    },
    recursos: {
      recursos: true
    },
    scraper: {
      scraper: true
    },
    opinion: {
      opinion: true
    },
    contabilidad: {
      contabilidad: true
    },
    captcha: {
      captcha: true
    },
    retenciones: {
      retenciones: true
    },
    pacs: {
      pacs: true
    },
    banxico: {
      banxico: true
    },
    diot: {
      diot: true
    }
  };
  return dependencies[scope] || {};
}

function getScopes(commits = []) {
  const list = ['catalogs','csd','csf','curp','pdf','rfc','utils','xml','complementos','openssl','saxon','xsd','2json','designs','sat','estado','validador','cleaner','auth','transform','expresiones','elements','types','descarga','cancelacion','recursos','scraper','opinion','contabilidad','captcha','retenciones','pacs','banxico','diot']
  const onlys = {
    'only-complementos': 'complementos'
  }
  let scopes = {};
  for (var i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const message = commit.message;
    const [type, msg] = message.split(':');
    const findScope = type.match(/\(([^)]+)\)/g);
    if (findScope) {
      const scope = findScope.pop().replace(/[{()}]/g, '');
      const onlyScope =  onlys[scope] || scope
      if (list.includes(onlyScope)) {
        scopes = {
          ...scopes,
          ...getDependences(scope)
        }
      }
    }
  }
  return Object.keys(scopes);
}
async function getCommitsPR(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error get list prices');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`ERROR => ${url}`, error);
    return [];
  }

}
module.exports = async ({ github, context, core }) => {
  // For pull_request events, use the target branch (base_ref), not the PR ref
  const branch = context.payload.pull_request
    ? context.payload.pull_request.base.ref
    : context.ref.split('/').slice(2).join('/');

  console.log("branch:", branch);
  console.log("eventName:", context.eventName);

  const eventName = context.eventName
  let commits = context.payload.commits || [];

  if(eventName==='pull_request'){
    const { owner, repo } = context.repo;
    const pull_number = context.payload.pull_request.number;
    console.log(`Fetching commits for PR #${pull_number}...`);
    const { data: commits_local } = await github.rest.pulls.listCommits({
      owner,
      repo,
      pull_number,
      per_page: 100,
    });
    console.log(`Found ${commits_local.length} commits in PR`);
    commits = commits_local.map(({commit})=>commit)
  }
  const scopes =  getScopes(commits);
  console.log("scopes from commits", scopes);

  // Filtrar scopes que no tienen shouldPublish: true
  const rushJson = JSON.parse(require('fs').readFileSync('./rush.json', 'utf8'));
  const publishablePolicies = new Set(
    rushJson.projects
      .filter(p => p.shouldPublish && p.versionPolicyName)
      .map(p => p.versionPolicyName)
  );
  const filteredScopes = scopes.filter(s => publishablePolicies.has(s));
  console.log("publishable scopes", filteredScopes);

  core.setOutput('scopes', JSON.stringify(filteredScopes));
  core.setOutput('branch', branch);
};
