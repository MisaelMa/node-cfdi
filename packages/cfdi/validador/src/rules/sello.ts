import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const NO_CERTIFICADO_REGEX = /^\d{20}$/;
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;

function isBase64Valido(val: string): boolean {
  if (!val || val.trim() === '') return true; // empty is ok — not present
  return BASE64_REGEX.test(val) && val.length % 4 === 0;
}

function checkNoCertificado(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const noCert = data.comprobante['NoCertificado'];

  if (noCert === undefined || noCert === null) {
    issues.push({
      code: 'CFDI801',
      message: 'NoCertificado es requerido en el Comprobante',
      field: 'NoCertificado',
      rule: 'sello.noCertificado',
    });
    return issues;
  }

  if (noCert !== '' && !NO_CERTIFICADO_REGEX.test(noCert)) {
    issues.push({
      code: 'CFDI802',
      message: `NoCertificado '${noCert}' debe tener exactamente 20 digitos numericos`,
      field: 'NoCertificado',
      rule: 'sello.noCertificado',
    });
  }

  return issues;
}

function checkSello(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sello = data.comprobante['Sello'];

  if (sello === undefined || sello === null) {
    issues.push({
      code: 'CFDI803',
      message: 'Sello es requerido en el Comprobante',
      field: 'Sello',
      rule: 'sello.sello',
    });
    return issues;
  }

  if (sello !== '' && !isBase64Valido(sello)) {
    issues.push({
      code: 'CFDI804',
      message: 'Sello no es una cadena base64 valida',
      field: 'Sello',
      rule: 'sello.sello',
    });
  }

  return issues;
}

function checkCertificado(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const certificado = data.comprobante['Certificado'];

  if (certificado === undefined || certificado === null) {
    issues.push({
      code: 'CFDI805',
      message: 'Certificado es requerido en el Comprobante',
      field: 'Certificado',
      rule: 'sello.certificado',
    });
    return issues;
  }

  if (certificado !== '' && !isBase64Valido(certificado)) {
    issues.push({
      code: 'CFDI806',
      message: 'Certificado no es una cadena base64 valida',
      field: 'Certificado',
      rule: 'sello.certificado',
    });
  }

  return issues;
}

export const selloRules: ValidationRule[] = [
  checkNoCertificado,
  checkSello,
  checkCertificado,
];
