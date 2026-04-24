import type { ContribuyenteInfo, CuentaAuxiliar, VersionContabilidad } from '../types';

const NS_AUX_13 = 'http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/AuxiliarCtas';

/**
 * Genera el XML de Auxiliar de Cuentas conforme al Anexo 24.
 */
export function buildAuxiliarXml(
  info: ContribuyenteInfo,
  cuentas: CuentaAuxiliar[],
  tipoSolicitud: 'AF' | 'FC' | 'DE' | 'CO',
  version: VersionContabilidad = '1.3' as VersionContabilidad
): string {
  const ns = version === '1.3' ? NS_AUX_13 : NS_AUX_13.replace('1_3', '1_1');

  const cuentasXml = cuentas
    .map((c) => {
      const txXml = c.transacciones
        .map(
          (t) =>
            `      <AuxiliarCtas:DetalleAux Fecha="${t.fecha}" NumUnIdenPol="${t.numPoliza}" Concepto="${t.concepto}" Debe="${t.debe.toFixed(2)}" Haber="${t.haber.toFixed(2)}"/>`
        )
        .join('\n');

      return `    <AuxiliarCtas:Cuenta NumCta="${c.numCta}" DesCta="${c.desCta}" SaldoIni="${c.saldoIni.toFixed(2)}" SaldoFin="${c.saldoFin.toFixed(2)}">
${txXml}
    </AuxiliarCtas:Cuenta>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<AuxiliarCtas:AuxiliarCtas xmlns:AuxiliarCtas="${ns}"
                           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                           Version="${version}"
                           RFC="${info.rfc}"
                           Mes="${info.mes}"
                           Anio="${info.anio}"
                           TipoEnvio="${info.tipoEnvio}"
                           TipoSolicitud="${tipoSolicitud}">
${cuentasXml}
</AuxiliarCtas:AuxiliarCtas>`;
}
