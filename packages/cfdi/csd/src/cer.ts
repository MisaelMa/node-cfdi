/** @deprecated Use Certificate class instead */
import console from 'console';
import pkg from 'node-forge';
import { readFileSync } from 'fs';
import { x509 } from '@clir/openssl';

const formatDate = (date: Date, format: string): string => {
  const pad = (n: number, size: number) => String(n).padStart(size, '0');
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const H = date.getHours();
  const mi = date.getMinutes();
  const s = date.getSeconds();
  const ms = date.getMilliseconds();
  const tokens: Record<string, string> = {
    YYYY: pad(Y, 4),
    YY: pad(Y % 100, 2),
    MM: pad(M, 2),
    M: String(M),
    DD: pad(D, 2),
    D: String(D),
    HH: pad(H, 2),
    H: String(H),
    mm: pad(mi, 2),
    m: String(mi),
    ss: pad(s, 2),
    s: String(s),
    SSS: pad(ms, 3),
    SS: pad(Math.floor(ms / 10), 2),
    S: String(Math.floor(ms / 100)),
  };
  return format.replace(
    /YYYY|YY|SSS|SS|MM|DD|HH|mm|ss|M|D|H|m|s|S/g,
    t => tokens[t]
  );
};

const { pki } = pkg;
// @ts-ignore
// import * as rfc from "validate-rfc"
// import { AnyKey } from '../interface/certificate.interface';
// import { readFileSync } from '../utils';

let isCert = false;
let allowedFiles = ['.cer', '.pem'];
let file = '';
let regex = new RegExp(
  '([a-zA-Z0-9s_\\.-:])+(' + allowedFiles.join('|') + ')$'
);
export const setFile = (filePath: string) => {
  const typeFile = filePath.match(/\.[0-9a-z]+$/i);
  if (typeFile && typeFile.length > 0) {
    if (regex.test(filePath.toLowerCase())) {
      file = filePath;
      console.log('typeFile', typeFile[0]);
      if (typeFile[0] === '.cer') {
        isCert = true;
      }
    } else {
      console.log('files not suported');
    }
  }
};

export const getPem = (options = { begin: false }) => {
  const cli = x509.inform('DER').in(file).outform('PEM');
  try {
    const { begin } = options;
    let pem = '';
    if (isCert) {
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
    // console.log(e)
    const cerPem = cli.cli();
    throw new Error('CLI: ' + cerPem);
  }
};

export const getData = (): any => {
  return pki.certificateFromPem(getPem());
};

export const version = (): number => {
  return getData().version;
};

/**
 *getNoCer
 */
export const getNoCer = (): string => {
  const { serialNumber = '' } = getData();
  const nom = serialNumber.match(/.{1,2}/g) as string[];
  return nom
    .map((v: string) => {
      return String.fromCharCode(parseInt(v, 16));
    })
    .join('');
};
/**
 *text
 *
 * @param cerFile
 * string
 */
export const text = (): string => {
  const cli = x509.inform('DER').in(file).noout().text();
  try {
    return cli.run();
  } catch (e) {
    throw new Error(cli.cli());
  }
};

/**
 *pubkey
 *
 * @param cerFile
 * string
 */
export const pubkey = (options = { begin: false }): string => {
  const { begin = false } = options;

  try {
    // const cli = x509.inform('DER').in(file).noout().pubkey();
    // const result = commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -pubkey`).stdout;
    // const data = cli.run();
    const data = pki.publicKeyToPem(getData().publicKey);
    return data
    // return begin ? data.replace(/(-+[^-]+-+)/g, '').replace(/\s+/g, '') : data;
  } catch (error) {
    console.log(error)
    throw new Error();
  }
};

/**
 *
 * @param cerFile
 */
export const modulu = (): string => {
  // const cli = x509.inform('DER').in(file).noout().modulus();
  try {
    // const result = commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -modulus`).stdout
    // const data = cli.run();
    let data = '';
    return data
      .replace('Modulus=', '')
      .replace(/^\s+/g, '')
      .replace(/\s+$/g, '');
  } catch (e) {
    return ""
   // throw new Error(cli.cli());
  }
};

/**
 *
 * @param cerFile
 */
export const serial = (): string => {
  try {
    return getData().serialNumber;
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const subjectHash = (): string => {
  const cli = x509.inform('DER').in(file).noout().subject_hash();
  try {
    return cli.run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -subject_hash`).stdout
  } catch (e) {
    throw new Error(cli.cli());
  }
};

/**
 *
 * @param cerFile
 */
export const issuerHash = (): string => {
  const cli = x509.inform('DER').in(file).noout().issuer_hash();
  try {
    return cli.run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -issuer_hash`).stdout
  } catch (e) {
    throw new Error(cli.cli());
  }
};

/**
 *
 * @param cerFile
 */
export const ocspid = () => {
  try {
    return x509.inform('DER').in(file).noout().ocspid().run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -ocspid`).stdout
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const hash = (): string => {
  try {
    return x509.inform('DER').in(file).noout().hash().run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -hash`).stdout
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const subjectHashOld = (): string => {
  try {
    return x509.inform('DER').in(file).noout().subject_hash_old().run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -subject_hash_old`).stdout
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const issuerHashOld = (): string => {
  try {
    return x509.inform('DER').in(file).noout().issuer_hash_old().run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -issuer_hash_old`).stdout
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const issuer = () => {
  const obj: any = {};

  const attributes = getData().issuer.attributes;
  for (const attr of attributes) {
    // @ts-ignore
    obj[attr.name] = attr.value;
  }
  return obj;
};

export const subject = () => {
  const obj: any = {};

  const attributes = getData().subject.attributes;
  for (const attr of attributes) {
    const validate = '';
    const nameField = attr.name || validate;
    if (attr.name) {
      // @ts-ignore
      obj[attr.name] = attr.value;
    }
    //else {
    // if (rfc(attr.value)) {
    //   // @ts-ignore
    //   obj["rfc"] = attr.value
    // } else {
    //   console.log(attr)

    // }
    //}
  }

  return obj;
};

/**
 *
 * @param file
 * @param format
 */
export const date = (
  format = 'DD/MM/YYYY HH:mm:ss.SSS'
): { startDate: string; endDate: string } => {
  try {
    // let startDateCer = commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -startdate`).stdout
    /// const DateCer = //x509.inform('DER').in(file).noout().startdate().enddate().run();
    let sDate = getData().validity.notBefore; // data[0].replace('notBefore=', '').replace('  ', '');
    let eDate = getData().validity.notAfter; // data[1].replace('notAfter=', '').replace('  ', '');

    let startDate = formatDate(new Date(sDate), format);
    let endDate = formatDate(new Date(eDate), format);

    return {
      startDate,
      endDate,
    };
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 * @param seconds
 */
export const checkend = (seconds: string | number) => {
  try {
    // Certificate will expire El certificado caducará
    // Certificate will not expire El certificado no caducará
    // const check = commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -checkend ${seconds}`).stdout
    const check = x509.inform('DER').in(file).noout().checkend(seconds).run();
    return check;
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const ocspUri = (): string => {
  try {
    return x509.inform('DER').in(file).noout().ocsp_uri().run();
    // return commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -ocsp_uri`).stdout
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const validity = (): {
  notBefore: Date;
  notAfter: Date;
} => {
  return getData().validity;
};

/**
 *
 * @param cerFile
 */
export const fingerPrint = (): string => {
  try {
    // const check = commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -fingerprint`).stdout
    return x509.inform('DER').in(file).noout().fingerprint().run();
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};

/**
 *
 * @param cerFile
 */
export const C = (): string => {
  try {
    // Certificate will expire El certificado caducará
    // Certificate will not expire El certificado no caducará
    // const check = commandSync(`${getOsComandBin()} x509 -inform der -in ${cer} -noout -C`).stdout
    return x509.inform('DER').in(file).noout().C().run();
  } catch (e) {
    // @ts-ignore
    throw new Error(e.message);
  }
};
// /**
//  *agetCerPem
//  *
//  * @param cerpempath
//  * string
//  */
// public agetCerPem(cerpempath: string): string {
//   return cerpempath;
// }

// /**
//  *getCerFile
//  *
//  * @param cerfile
//  * string
//  */
// public getCerFile(cerfile: string): string {
//   return cerfile;
// }
// /**
//  *
//  */
// public async getFechaVigencia() {
//   return 1;
// }

// /**
//  *
//  */
// public async validarCertificado() {
//   return 1;
// }

// /**
//  *
//  */
// public async generaPFX() {
//   return 1;
// }

// /**
//  *
//  */
// public async pareja() {
//   return 1;
// }

// /**
//  *
//  * @param nombreCer
//  */
// public async certificadoBase64(nombreCer: any) {
//   return 1;
// }

//
