import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const MAX_DECIMALES = 6;
const TOLERANCIA = 0.01;

function parseDecimal(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function countDecimals(val: string): number {
  const parts = val.split('.');
  return parts.length > 1 ? parts[1].length : 0;
}

function checkDecimales(
  val: string | undefined,
  field: string,
  rule: string
): ValidationIssue | null {
  if (!val) return null;
  if (countDecimals(val) > MAX_DECIMALES) {
    return {
      code: 'CFDI201',
      message: `El campo '${field}' tiene mas de ${MAX_DECIMALES} decimales: '${val}'`,
      field,
      rule,
    };
  }
  return null;
}

function checkSubTotal(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const val = data.comprobante['SubTotal'];
  const n = parseDecimal(val);

  if (val !== undefined && n === null) {
    issues.push({
      code: 'CFDI202',
      message: `SubTotal '${val}' no es un numero valido`,
      field: 'SubTotal',
      rule: 'montos.subtotal',
    });
    return issues;
  }

  if (n !== null && n < 0) {
    issues.push({
      code: 'CFDI203',
      message: `SubTotal no puede ser negativo: '${val}'`,
      field: 'SubTotal',
      rule: 'montos.subtotal',
    });
  }

  const dec = checkDecimales(val, 'SubTotal', 'montos.subtotal');
  if (dec) issues.push(dec);

  return issues;
}

function checkTotal(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const val = data.comprobante['Total'];
  const n = parseDecimal(val);

  if (val !== undefined && n === null) {
    issues.push({
      code: 'CFDI204',
      message: `Total '${val}' no es un numero valido`,
      field: 'Total',
      rule: 'montos.total',
    });
    return issues;
  }

  if (n !== null && n < 0) {
    issues.push({
      code: 'CFDI205',
      message: `Total no puede ser negativo: '${val}'`,
      field: 'Total',
      rule: 'montos.total',
    });
  }

  const dec = checkDecimales(val, 'Total', 'montos.total');
  if (dec) issues.push(dec);

  return issues;
}

function checkDescuento(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const descuentoVal = data.comprobante['Descuento'];
  if (descuentoVal === undefined) return issues;

  const descuento = parseDecimal(descuentoVal);
  const subtotal = parseDecimal(data.comprobante['SubTotal']);

  if (descuento === null) {
    issues.push({
      code: 'CFDI206',
      message: `Descuento '${descuentoVal}' no es un numero valido`,
      field: 'Descuento',
      rule: 'montos.descuento',
    });
    return issues;
  }

  if (subtotal !== null && descuento > subtotal + TOLERANCIA) {
    issues.push({
      code: 'CFDI207',
      message: `Descuento (${descuento}) no puede ser mayor que SubTotal (${subtotal})`,
      field: 'Descuento',
      rule: 'montos.descuento',
    });
  }

  const dec = checkDecimales(descuentoVal, 'Descuento', 'montos.descuento');
  if (dec) issues.push(dec);

  return issues;
}

function checkTotalCalculado(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const subtotal = parseDecimal(data.comprobante['SubTotal']);
  const total = parseDecimal(data.comprobante['Total']);
  const descuento = parseDecimal(data.comprobante['Descuento']) ?? 0;
  const trasladados = parseDecimal(
    data.impuestos?.totalImpuestosTrasladados
  ) ?? 0;
  const retenidos = parseDecimal(data.impuestos?.totalImpuestosRetenidos) ?? 0;

  if (subtotal === null || total === null) return issues;

  const totalEsperado =
    subtotal - descuento + trasladados - retenidos;
  const diferencia = Math.abs(total - totalEsperado);

  if (diferencia > TOLERANCIA) {
    issues.push({
      code: 'CFDI208',
      message: `Total (${total}) no coincide con SubTotal - Descuento + TotalImpuestosTrasladados - TotalImpuestosRetenidos = ${totalEsperado.toFixed(2)} (diferencia: ${diferencia.toFixed(6)})`,
      field: 'Total',
      rule: 'montos.totalCalculado',
    });
  }

  return issues;
}

export const montosRules: ValidationRule[] = [
  checkSubTotal,
  checkTotal,
  checkDescuento,
  checkTotalCalculado,
];
