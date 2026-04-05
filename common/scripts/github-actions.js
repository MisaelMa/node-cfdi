
async function execa(command, params) {
  const { spawn } = require('child_process');
  const child = spawn(command, params);

  let data = '';
  for await (const chunk of child.stdout) {
    //console.log('stdout chunk: ' + chunk);
    data += chunk;
  }
  let error = '';
  for await (const chunk of child.stderr) {
    //console.error('stderr chunk: ' + chunk);
    error += chunk;
  }
  const exitCode = await new Promise((resolve, reject) => {
    child.on('close', resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
  }
  return data;
}
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
  const branch = context.ref.split('/').slice(2).join('/')

  const branchs =  ['next','beta', 'alpha','dev']
  const eventName = context.eventName
  let commits = context.payload.commits || [];

  if(eventName==='pull_request'){
    const commits_url = context.payload.pull_request.commits_url
    const commits_local = await getCommitsPR(commits_url)
    commits = commits_local.map(({commit})=>commit)
  }
  const scopes =  getScopes(commits);
  console.log("commits", scopes);

  for (var i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const comands = [
      'version',
      '--version-policy',
      scope,
      '--bump',
    ]
    if (branchs.includes(branch)) {
      comands.push('--override-bump');
      comands.push('prerelease');
      comands.push('--override-prerelease-id');
      comands.push(branch);
    }
    console.log(comands);
    const data = await execa('rush', comands);
    console.log(data);
  }
};
