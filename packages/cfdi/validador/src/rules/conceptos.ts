import type { CfdiData, ConceptoData, ValidationIssue, ValidationRule } from '../types';

const TOLERANCIA = 0.011;

function parseDecimal(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function checkConceptoMinimo(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (data.conceptos.length === 0) {
    issues.push({
      code: 'CFDI501',
      message: 'El CFDI debe tener al menos un Concepto',
      field: 'Conceptos',
      rule: 'conceptos.minimo',
    });
  }
  return issues;
}

function checkConcepto(
  concepto: ConceptoData,
  idx: number,
  version: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const attrs = concepto.attributes;
  const prefix = `Conceptos[${idx}]`;

  const camposRequeridos = [
    'ClaveProdServ',
    'Cantidad',
    'ClaveUnidad',
    'Descripcion',
    'ValorUnitario',
    'Importe',
  ];

  for (const campo of camposRequeridos) {
    if (attrs[campo] === undefined || attrs[campo] === null) {
      issues.push({
        code: 'CFDI502',
        message: `Campo requerido '${campo}' no presente en Concepto[${idx}]`,
        field: `${prefix}.${campo}`,
        rule: 'conceptos.camposRequeridos',
      });
    }
  }

  const cantidad = parseDecimal(attrs['Cantidad']);
  if (cantidad !== null && cantidad <= 0) {
    issues.push({
      code: 'CFDI503',
      message: `Cantidad en Concepto[${idx}] debe ser mayor a 0, valor actual: ${attrs['Cantidad']}`,
      field: `${prefix}.Cantidad`,
      rule: 'conceptos.cantidad',
    });
  }

  const valorUnitario = parseDecimal(attrs['ValorUnitario']);
  if (valorUnitario !== null && valorUnitario < 0) {
    issues.push({
      code: 'CFDI504',
      message: `ValorUnitario en Concepto[${idx}] no puede ser negativo: ${attrs['ValorUnitario']}`,
      field: `${prefix}.ValorUnitario`,
      rule: 'conceptos.valorUnitario',
    });
  }

  const importe = parseDecimal(attrs['Importe']);
  if (importe !== null && importe < 0) {
    issues.push({
      code: 'CFDI505',
      message: `Importe en Concepto[${idx}] no puede ser negativo: ${attrs['Importe']}`,
      field: `${prefix}.Importe`,
      rule: 'conceptos.importe',
    });
  }

  if (
    cantidad !== null &&
    valorUnitario !== null &&
    importe !== null
  ) {
    const importeEsperado = cantidad * valorUnitario;
    const diferencia = Math.abs(importe - importeEsperado);
    if (diferencia > TOLERANCIA) {
      issues.push({
        code: 'CFDI506',
        message: `Importe en Concepto[${idx}] (${importe}) no coincide con Cantidad * ValorUnitario = ${importeEsperado.toFixed(6)} (diferencia: ${diferencia.toFixed(6)})`,
        field: `${prefix}.Importe`,
        rule: 'conceptos.importeCalculado',
      });
    }
  }

  const descuento = parseDecimal(attrs['Descuento']);
  if (descuento !== null && importe !== null && descuento > importe + TOLERANCIA) {
    issues.push({
      code: 'CFDI507',
      message: `Descuento en Concepto[${idx}] (${descuento}) no puede ser mayor al Importe (${importe})`,
      field: `${prefix}.Descuento`,
      rule: 'conceptos.descuento',
    });
  }

  if (version === '4.0') {
    const objetoImp = attrs['ObjetoImp'];
    if (!objetoImp || objetoImp.trim() === '') {
      issues.push({
        code: 'CFDI508',
        message: `ObjetoImp es requerido en Concepto[${idx}] para CFDI 4.0`,
        field: `${prefix}.ObjetoImp`,
        rule: 'conceptos.objetoImp',
      });
    }
  }

  return issues;
}

function checkConceptos(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  data.conceptos.forEach((concepto, idx) => {
    issues.push(...checkConcepto(concepto, idx, data.version));
  });
  return issues;
}

export const conceptosRules: ValidationRule[] = [
  checkConceptoMinimo,
  checkConceptos,
];
