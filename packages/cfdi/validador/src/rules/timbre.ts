import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

function checkTimbre(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!data.timbre) return issues;

  const { uuid, fechaTimbrado, version } = data.timbre;

  if (!UUID_REGEX.test(uuid)) {
    issues.push({
      code: 'CFDI701',
      message: `UUID del TimbreFiscalDigital '${uuid}' no tiene el formato valido (8-4-4-4-12 hex)`,
      field: 'Complemento.TimbreFiscalDigital.UUID',
      rule: 'timbre.uuid',
    });
  }

  if (fechaTimbrado && !ISO_DATE_REGEX.test(fechaTimbrado)) {
    issues.push({
      code: 'CFDI702',
      message: `FechaTimbrado '${fechaTimbrado}' no tiene el formato ISO 8601 requerido (YYYY-MM-DDTHH:mm:ss)`,
      field: 'Complemento.TimbreFiscalDigital.FechaTimbrado',
      rule: 'timbre.fechaTimbrado',
    });
  }

  if (version && version !== '1.1') {
    issues.push({
      code: 'CFDI703',
      message: `Version del TimbreFiscalDigital debe ser '1.1', se encontro '${version}'`,
      field: 'Complemento.TimbreFiscalDigital.Version',
      rule: 'timbre.version',
    });
  }

  return issues;
}

export const timbreRules: ValidationRule[] = [checkTimbre];
