/** @deprecated Use PrivateKey class instead */
import * as crypto from 'crypto';

import { pkcs8 } from '@clir/openssl';
import pkg from 'node-forge';
import { readFileSync } from 'fs';

const { pki, util, md } = pkg;
// import { pki, util, md } from 'node-forge';
let isKey = false;
let allowedFiles = ['.key', '.pem'];
let password = '';
let file = '';
let regex = new RegExp(
  '([a-zA-Z0-9s_\\.-:])+(' + allowedFiles.join('|') + ')$'
);
export const setFile = (keyfile: string, pass?: string) => {
  const typeFile = keyfile.match(/\.[0-9a-z]+$/i);
  if (typeFile && typeFile.length > 0) {
    if (regex.test(keyfile.toLowerCase())) {
      file = keyfile;
      if (!pass && typeFile[0] === '.key') {
        throw new Error(`contraseña requerida de el archivo ${keyfile}`);
      }
      if (typeFile[0] === '.key' && pass) {
        password = pass;
        isKey = true;
      }
    } else {
      console.log('files not suported');
    }
  }
};

export const getPem = (options = { begin: false }): string => {
  const cli = pkcs8
    .inform('DER')
    .in(file)
    .outform('PEM')
    .passin(`pass:${password}`);
  try {
    const { begin } = options;
    let pem = '';
    if (isKey) {
      pem = cli.run();
    } else {
      pem = readFileSync(file, 'ascii');
    }
    if (begin) {
      return pem.replace(/(-+[^-]+-+)/g, '').replace(/\s+/g, '');
    } else {
      return pem;
    }
  } catch (e) {
    const keyPem = cli.cli();
    throw new Error(keyPem);
  }
};

export const getData = () => {
  return pki.privateKeyFromPem(getPem());
};

export const signatureHexForge = (message: string) => {
  let messageDigest = md.sha256.create();
  messageDigest.update(message, 'utf8');
  const signature = getData().sign(messageDigest);
  return Buffer.from(util.binary.raw.decode(signature)).toString('base64');
  // const signatureHex = Buffer.from(raw.decode(signature)).toString('hex');
};

export const signatureHexCripto = (message: string) => {
  const signer = crypto.createSign('RSA-SHA256').update(message, 'utf8');
  const signature2Hex = signer.sign(getPem(),'base64');
  return signature2Hex;
};
