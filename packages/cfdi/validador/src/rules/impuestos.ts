import type { CfdiData, ValidationIssue, ValidationRule } from '../types';

const TOLERANCIA = 0.011;
const IMPUESTOS_VALIDOS = ['001', '002', '003'];
const TIPOS_FACTOR_VALIDOS = ['Tasa', 'Cuota', 'Exento'];

function parseDecimal(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function checkImpuesto(
  val: string | undefined,
  prefix: string
): ValidationIssue | null {
  if (!val) return null;
  if (!IMPUESTOS_VALIDOS.includes(val)) {
    return {
      code: 'CFDI601',
      message: `Impuesto '${val}' en ${prefix} no es valido. Valores permitidos: ${IMPUESTOS_VALIDOS.join(', ')} (001=ISR, 002=IVA, 003=IEPS)`,
      field: `${prefix}.Impuesto`,
      rule: 'impuestos.impuestoValido',
    };
  }
  return null;
}

function checkTipoFactor(
  val: string | undefined,
  prefix: string
): ValidationIssue | null {
  if (!val) return null;
  if (!TIPOS_FACTOR_VALIDOS.includes(val)) {
    return {
      code: 'CFDI602',
      message: `TipoFactor '${val}' en ${prefix} no es valido. Valores permitidos: ${TIPOS_FACTOR_VALIDOS.join(', ')}`,
      field: `${prefix}.TipoFactor`,
      rule: 'impuestos.tipoFactor',
    };
  }
  return null;
}

function checkExento(
  traslado: Record<string, string>,
  prefix: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (traslado['TipoFactor'] === 'Exento') {
    if (traslado['TasaOCuota'] !== undefined) {
      issues.push({
        code: 'CFDI603',
        message: `TasaOCuota no debe estar presente cuando TipoFactor='Exento' en ${prefix}`,
        field: `${prefix}.TasaOCuota`,
        rule: 'impuestos.exento',
      });
    }
    if (traslado['Importe'] !== undefined) {
      issues.push({
        code: 'CFDI604',
        message: `Importe no debe estar presente cuando TipoFactor='Exento' en ${prefix}`,
        field: `${prefix}.Importe`,
        rule: 'impuestos.exento',
      });
    }
  }
  return issues;
}

function checkTrasladosConcepto(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  data.conceptos.forEach((concepto, ci) => {
    const traslados = concepto.impuestos?.traslados ?? [];
    traslados.forEach((t, ti) => {
      const prefix = `Concepto[${ci}].Impuestos.Traslados[${ti}]`;
      const impIssue = checkImpuesto(t['Impuesto'], prefix);
      if (impIssue) issues.push(impIssue);
      const factorIssue = checkTipoFactor(t['TipoFactor'], prefix);
      if (factorIssue) issues.push(factorIssue);
      issues.push(...checkExento(t, prefix));
    });

    const retenciones = concepto.impuestos?.retenciones ?? [];
    retenciones.forEach((r, ri) => {
      const prefix = `Concepto[${ci}].Impuestos.Retenciones[${ri}]`;
      const impIssue = checkImpuesto(r['Impuesto'], prefix);
      if (impIssue) issues.push(impIssue);
    });
  });

  return issues;
}

function checkTrasladosGlobales(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!data.impuestos) return issues;

  data.impuestos.traslados.forEach((t, i) => {
    const prefix = `Impuestos.Traslados[${i}]`;
    const impIssue = checkImpuesto(t['Impuesto'], prefix);
    if (impIssue) issues.push(impIssue);
    const factorIssue = checkTipoFactor(t['TipoFactor'], prefix);
    if (factorIssue) issues.push(factorIssue);
    issues.push(...checkExento(t, prefix));
  });

  data.impuestos.retenciones.forEach((r, i) => {
    const prefix = `Impuestos.Retenciones[${i}]`;
    const impIssue = checkImpuesto(r['Impuesto'], prefix);
    if (impIssue) issues.push(impIssue);
  });

  return issues;
}

function checkSumaTrasladados(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const totalDeclarado = parseDecimal(
    data.impuestos?.totalImpuestosTrasladados
  );
  if (totalDeclarado === null) return issues;

  // Sum traslados from conceptos (excluding Exento which have no Importe)
  let sumaConceptos = 0;
  for (const concepto of data.conceptos) {
    for (const t of concepto.impuestos?.traslados ?? []) {
      if (t['TipoFactor'] !== 'Exento') {
        const imp = parseDecimal(t['Importe']);
        if (imp !== null) sumaConceptos += imp;
      }
    }
  }

  const diferencia = Math.abs(totalDeclarado - sumaConceptos);
  if (diferencia > TOLERANCIA) {
    issues.push({
      code: 'CFDI605',
      message: `TotalImpuestosTrasladados (${totalDeclarado}) no coincide con la suma de traslados en conceptos (${sumaConceptos.toFixed(2)}) (diferencia: ${diferencia.toFixed(6)})`,
      field: 'Impuestos.TotalImpuestosTrasladados',
      rule: 'impuestos.sumaTrasladados',
    });
  }

  return issues;
}

function checkSumaRetenidos(data: CfdiData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const totalDeclarado = parseDecimal(data.impuestos?.totalImpuestosRetenidos);
  if (totalDeclarado === null) return issues;

  let sumaConceptos = 0;
  for (const concepto of data.conceptos) {
    for (const r of concepto.impuestos?.retenciones ?? []) {
      const imp = parseDecimal(r['Importe']);
      if (imp !== null) sumaConceptos += imp;
    }
  }

  const diferencia = Math.abs(totalDeclarado - sumaConceptos);
  if (diferencia > TOLERANCIA) {
    issues.push({
      code: 'CFDI606',
      message: `TotalImpuestosRetenidos (${totalDeclarado}) no coincide con la suma de retenciones en conceptos (${sumaConceptos.toFixed(2)}) (diferencia: ${diferencia.toFixed(6)})`,
      field: 'Impuestos.TotalImpuestosRetenidos',
      rule: 'impuestos.sumaRetenidos',
    });
  }

  return issues;
}

export const impuestosRules: ValidationRule[] = [
  checkTrasladosConcepto,
  checkTrasladosGlobales,
  checkSumaTrasladados,
  checkSumaRetenidos,
];
