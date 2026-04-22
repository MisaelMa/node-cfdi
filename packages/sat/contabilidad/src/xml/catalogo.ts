import type { ContribuyenteInfo, CuentaCatalogo, VersionContabilidad } from '../types';

const NS_CATALOGO_13 = 'http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/CatalogoCuentas';

/**
 * Genera el XML de Catalogo de Cuentas conforme al Anexo 24.
 */
export function buildCatalogoXml(
  info: ContribuyenteInfo,
  cuentas: CuentaCatalogo[],
  version: VersionContabilidad = '1.3' as VersionContabilidad
): string {
  const ns =
    version === '1.3' ? NS_CATALOGO_13 : NS_CATALOGO_13.replace('1_3', '1_1');

  const cuentasXml = cuentas
    .map((c) => {
      const subCta = c.subCtaDe ? ` SubCtaDe="${c.subCtaDe}"` : '';
      return `  <catalogocuentas:Ctas CodAgrup="${c.codAgrup}" NumCta="${c.numCta}" Desc="${c.desc}"${subCta} Nivel="${c.nivel}" Natur="${c.natur}"/>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<catalogocuentas:Catalogo xmlns:catalogocuentas="${ns}"
                          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                          Version="${version}"
                          RFC="${info.rfc}"
                          Mes="${info.mes}"
                          Anio="${info.anio}"
                          TipoEnvio="${info.tipoEnvio}">
${cuentasXml}
</catalogocuentas:Catalogo>`;
}
