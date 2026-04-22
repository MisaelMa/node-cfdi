import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const VERSIONES_VALIDAS = ['3.3', '4.0'];
const TIPOS_COMPROBANTE = ['I', 'E', 'T', 'P', 'N'];

const CAMPOS_REQUERIDOS_COMUNES = [
  'Version',
  'Fecha',
  'LugarExpedicion',
  'Moneda',
  'SubTotal',
  'Total',
  'TipoDeComprobante',
  'NoCertificado',
  'Sello',
  'Certificado',
];

const CAMPOS_REQUERIDOS_40 = ['Exportacion'];

function checkVersion(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!VERSIONES_VALIDAS.includes(data.version)) {
    issues.push({
      code: 'CFDI001',
      message: `Version '${data.version}' no es valida. Se esperaba 3.3 o 4.0`,
      field: 'Version',
      rule: 'estructura.version',
    });
  }
  return issues;
}

function checkCamposRequeridos(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const campos =
    data.version === '4.0'
      ? [...CAMPOS_REQUERIDOS_COMUNES, ...CAMPOS_REQUERIDOS_40]
      : CAMPOS_REQUERIDOS_COMUNES;

  for (const campo of campos) {
    if (
      data.comprobante[campo] === undefined ||
      data.comprobante[campo] === null
    ) {
      issues.push({
        code: 'CFDI002',
        message: `Campo requerido '${campo}' no esta presente en el Comprobante`,
        field: campo,
        rule: 'estructura.camposRequeridos',
      });
    }
  }
  return issues;
}

function checkTipoDeComprobante(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const tipo = data.comprobante['TipoDeComprobante'];
  if (tipo && !TIPOS_COMPROBANTE.includes(tipo)) {
    issues.push({
      code: 'CFDI003',
      message: `TipoDeComprobante '${tipo}' no es valido. Valores permitidos: ${TIPOS_COMPROBANTE.join(', ')}`,
      field: 'TipoDeComprobante',
      rule: 'estructura.tipoDeComprobante',
    });
  }
  return issues;
}

function checkTipoTraslado(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const tipo = data.comprobante['TipoDeComprobante'];
  if (tipo === 'T') {
    const subtotal = data.comprobante['SubTotal'];
    const total = data.comprobante['Total'];
    if (subtotal !== '0' && subtotal !== '0.00') {
      issues.push({
        code: 'CFDI004',
        message:
          "Para TipoDeComprobante='T' (Traslado), SubTotal debe ser '0'",
        field: 'SubTotal',
        rule: 'estructura.tipoTraslado',
      });
    }
    if (total !== '0' && total !== '0.00') {
      issues.push({
        code: 'CFDI005',
        message: "Para TipoDeComprobante='T' (Traslado), Total debe ser '0'",
        field: 'Total',
        rule: 'estructura.tipoTraslado',
      });
    }
  }
  return issues;
}

function checkMonedaTipoCambio(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const moneda = data.comprobante['Moneda'];
  const tipoCambio = data.comprobante['TipoCambio'];

  if (moneda === 'XXX' && tipoCambio !== undefined) {
    issues.push({
      code: 'CFDI006',
      message: "Cuando Moneda='XXX', no debe existir el atributo TipoCambio",
      field: 'TipoCambio',
      rule: 'estructura.monedaTipoCambio',
    });
  }

  if (
    moneda &&
    moneda !== 'MXN' &&
    moneda !== 'XXX' &&
    tipoCambio === undefined
  ) {
    issues.push({
      code: 'CFDI007',
      message: `Cuando Moneda='${moneda}' (distinta de MXN y XXX), TipoCambio es requerido`,
      field: 'TipoCambio',
      rule: 'estructura.monedaTipoCambio',
    });
  }
  return issues;
}

function checkFecha(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fecha = data.comprobante['Fecha'];
  if (fecha) {
    const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!ISO_REGEX.test(fecha)) {
      issues.push({
        code: 'CFDI008',
        message: `Fecha '${fecha}' no tiene el formato ISO 8601 requerido (YYYY-MM-DDTHH:mm:ss)`,
        field: 'Fecha',
        rule: 'estructura.fecha',
      });
    }
  }
  return issues;
}

export const estructuraRules: ValidationRule[] = [
  checkVersion,
  checkCamposRequeridos,
  checkTipoDeComprobante,
  checkTipoTraslado,
  checkMonedaTipoCambio,
  checkFecha,
];
