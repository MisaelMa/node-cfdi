import type { ContribuyenteInfo, CuentaBalanza, VersionContabilidad } from '../types';

const NS_BCE_13 = 'http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/BalanzaComprobacion';

/**
 * Genera el XML de Balanza de Comprobacion conforme al Anexo 24.
 */
export function buildBalanzaXml(
  info: ContribuyenteInfo,
  cuentas: CuentaBalanza[],
  version: VersionContabilidad = '1.3' as VersionContabilidad
): string {
  const ns = version === '1.3' ? NS_BCE_13 : NS_BCE_13.replace('1_3', '1_1');
  const cuentasXml = cuentas
    .map(
      (c) =>
        `  <BCE:Ctas NumCta="${c.numCta}" SaldoIni="${c.saldoIni.toFixed(2)}" Debe="${c.debe.toFixed(2)}" Haber="${c.haber.toFixed(2)}" SaldoFin="${c.saldoFin.toFixed(2)}"/>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<BCE:Balanza xmlns:BCE="${ns}"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             Version="${version}"
             RFC="${info.rfc}"
             Mes="${info.mes}"
             Anio="${info.anio}"
             TipoEnvio="${info.tipoEnvio}">
${cuentasXml}
</BCE:Balanza>`;
}
