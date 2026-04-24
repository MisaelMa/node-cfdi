import type { ContribuyenteInfo, Poliza, VersionContabilidad } from '../types';

const NS_PLZ_13 = 'http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/PolizasPeriodo';

/**
 * Genera el XML de Polizas del Periodo conforme al Anexo 24.
 */
export function buildPolizasXml(
  info: ContribuyenteInfo,
  polizas: Poliza[],
  tipoSolicitud: 'AF' | 'FC' | 'DE' | 'CO',
  version: VersionContabilidad = '1.3' as VersionContabilidad
): string {
  const ns = version === '1.3' ? NS_PLZ_13 : NS_PLZ_13.replace('1_3', '1_1');

  const polizasXml = polizas
    .map((p) => {
      const detalleXml = p.detalle
        .map(
          (d) =>
            `      <PLZ:Transaccion NumCta="${d.numCta}" Concepto="${d.concepto}" Debe="${d.debe.toFixed(2)}" Haber="${d.haber.toFixed(2)}"/>`
        )
        .join('\n');

      return `    <PLZ:Poliza NumUnIdenPol="${p.numPoliza}" Fecha="${p.fecha}" Concepto="${p.concepto}">
${detalleXml}
    </PLZ:Poliza>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<PLZ:Polizas xmlns:PLZ="${ns}"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             Version="${version}"
             RFC="${info.rfc}"
             Mes="${info.mes}"
             Anio="${info.anio}"
             TipoEnvio="${info.tipoEnvio}"
             TipoSolicitud="${tipoSolicitud}">
${polizasXml}
</PLZ:Polizas>`;
}
