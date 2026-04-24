import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const RFC_REGEX_PM = /^[A-Z&Ñ]{3}[0-9]{6}[A-Z0-9]{3}$/;
const RFC_REGEX_PF = /^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$/;
const RFC_GENERICO = /^(XAXX010101000|XEXX010101000)$/;
const CODIGO_POSTAL_REGEX = /^\d{5}$/;

function isRfcValido(rfc: string): boolean {
  if (!rfc) return false;
  if (RFC_GENERICO.test(rfc)) return true;
  return RFC_REGEX_PM.test(rfc) || RFC_REGEX_PF.test(rfc);
}

function checkRfcReceptor(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const rfc = data.receptor['Rfc'];

  if (!rfc) {
    issues.push({
      code: 'CFDI401',
      message: 'RFC del Receptor es requerido',
      field: 'Receptor.Rfc',
      rule: 'receptor.rfc',
    });
    return issues;
  }

  if (!isRfcValido(rfc)) {
    issues.push({
      code: 'CFDI402',
      message: `RFC del Receptor '${rfc}' no tiene un formato valido (12 chars PM o 13 chars PF)`,
      field: 'Receptor.Rfc',
      rule: 'receptor.rfc',
    });
  }

  return issues;
}

function checkUsoCFDI(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const uso = data.receptor['UsoCFDI'];

  if (!uso || uso.trim() === '') {
    issues.push({
      code: 'CFDI403',
      message: 'UsoCFDI del Receptor es requerido',
      field: 'Receptor.UsoCFDI',
      rule: 'receptor.usoCFDI',
    });
  }

  return issues;
}

function checkDomicilioFiscal40(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (data.version !== '4.0') return issues;

  const domicilio = data.receptor['DomicilioFiscalReceptor'];
  if (!domicilio || domicilio.trim() === '') {
    issues.push({
      code: 'CFDI404',
      message: 'DomicilioFiscalReceptor es requerido en CFDI 4.0',
      field: 'Receptor.DomicilioFiscalReceptor',
      rule: 'receptor.domicilioFiscal',
    });
  } else if (!CODIGO_POSTAL_REGEX.test(domicilio)) {
    issues.push({
      code: 'CFDI405',
      message: `DomicilioFiscalReceptor '${domicilio}' debe ser un codigo postal de 5 digitos`,
      field: 'Receptor.DomicilioFiscalReceptor',
      rule: 'receptor.domicilioFiscal',
    });
  }

  return issues;
}

function checkRegimenFiscalReceptor40(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (data.version !== '4.0') return issues;

  const regimen = data.receptor['RegimenFiscalReceptor'];
  if (!regimen || regimen.trim() === '') {
    issues.push({
      code: 'CFDI406',
      message: 'RegimenFiscalReceptor es requerido en CFDI 4.0',
      field: 'Receptor.RegimenFiscalReceptor',
      rule: 'receptor.regimenFiscal',
    });
  }

  return issues;
}

export const receptorRules: ValidationRule[] = [
  checkRfcReceptor,
  checkUsoCFDI,
  checkDomicilioFiscal40,
  checkRegimenFiscalReceptor40,
];
