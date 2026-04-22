import type { DiotDeclaracion, OperacionTercero } from '../types';

function assertMontoDosDecimales(value: number, campo: string): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${campo}: el monto debe ser un número finito mayor o igual a cero`);
  }
  const redondeado = Math.round(value * 100) / 100;
  if (Math.abs(value - redondeado) > 1e-9) {
    throw new Error(
      `${campo}: los montos deben tener como máximo 2 decimales (formato de pesos)`
    );
  }
  return redondeado.toFixed(2);
}

function celda(val: string | undefined): string {
  return (val ?? '').trim();
}

function filaOperacion(op: OperacionTercero): string {
  const iva16 = assertMontoDosDecimales(op.montoIva16, 'montoIva16');
  const iva0 = assertMontoDosDecimales(op.montoIva0, 'montoIva0');
  const exento = assertMontoDosDecimales(op.montoExento, 'montoExento');
  const retenido = assertMontoDosDecimales(op.montoRetenido, 'montoRetenido');
  const noDeduc = assertMontoDosDecimales(op.montoIvaNoDeduc, 'montoIvaNoDeduc');

  const campos = [
    op.tipoTercero,
    op.tipoOperacion,
    celda(op.rfc),
    celda(op.idFiscal),
    celda(op.nombreExtranjero),
    celda(op.paisResidencia),
    celda(op.nacionalidad),
    iva16,
    iva0,
    exento,
    retenido,
    noDeduc,
  ];

  return campos.join('|');
}

/**
 * Genera el contenido de archivo DIOT en formato texto delimitado por tubería (|),
 * una línea por operación con terceros.
 *
 * Formato por línea:
 * `TipoTercero|TipoOperacion|RFC|IDFiscal|Nombre|Pais|Nacionalidad|IVA16|IVA0|Exento|Retenido|NoDeduc`
 */
export function buildDiotTxt(declaracion: DiotDeclaracion): string {
  if (!declaracion.operaciones.length) {
    return '';
  }
  return declaracion.operaciones.map((op) => filaOperacion(op)).join('\n');
}
