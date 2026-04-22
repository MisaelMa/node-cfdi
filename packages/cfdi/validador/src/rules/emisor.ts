import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const RFC_REGEX_PM = /^[A-Z&Ñ]{3}[0-9]{6}[A-Z0-9]{3}$/;
const RFC_REGEX_PF = /^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$/;
const RFC_GENERICO = /^(XAXX010101000|XEXX010101000)$/;

function isRfcValido(rfc: string): boolean {
  if (!rfc) return false;
  if (RFC_GENERICO.test(rfc)) return true;
  return RFC_REGEX_PM.test(rfc) || RFC_REGEX_PF.test(rfc);
}

function checkRfcEmisor(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const rfc = data.emisor['Rfc'];

  if (!rfc) {
    issues.push({
      code: 'CFDI301',
      message: 'RFC del Emisor es requerido',
      field: 'Emisor.Rfc',
      rule: 'emisor.rfc',
    });
    return issues;
  }

  if (!isRfcValido(rfc)) {
    issues.push({
      code: 'CFDI302',
      message: `RFC del Emisor '${rfc}' no tiene un formato valido (12 chars PM o 13 chars PF)`,
      field: 'Emisor.Rfc',
      rule: 'emisor.rfc',
    });
  }

  return issues;
}

function checkNombreEmisor(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nombre = data.emisor['Nombre'];

  if (data.version === '4.0' && (!nombre || nombre.trim() === '')) {
    issues.push({
      code: 'CFDI303',
      message: 'Nombre del Emisor es requerido en CFDI 4.0',
      field: 'Emisor.Nombre',
      rule: 'emisor.nombre',
    });
  }

  return issues;
}

function checkRegimenFiscalEmisor(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const regimen = data.emisor['RegimenFiscal'];

  if (!regimen || regimen.trim() === '') {
    issues.push({
      code: 'CFDI304',
      message: 'RegimenFiscal del Emisor es requerido',
      field: 'Emisor.RegimenFiscal',
      rule: 'emisor.regimenFiscal',
    });
  }

  return issues;
}

export const emisorRules: ValidationRule[] = [
  checkRfcEmisor,
  checkNombreEmisor,
  checkRegimenFiscalEmisor,
];
