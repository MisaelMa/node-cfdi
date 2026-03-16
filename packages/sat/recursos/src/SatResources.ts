import fs from 'fs';
import path from 'path';

export type SatVersion = '4.0' | '3.3';

export interface SatResourcesOptions {
  version: SatVersion;
  outputDir: string;
}

export interface DownloadResult {
  schema: string;
  xslt: string;
  catalogSchema: string | null;
  tipoDatosSchema: string | null;
  complementos: string[];
  unused: string[];
  added: string[];
}

interface VersionUrls {
  schema: string;
  xslt: string;
}

const SAT_URLS: Record<SatVersion, VersionUrls> = {
  '4.0': {
    schema:
      'https://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd',
    xslt: 'https://www.sat.gob.mx/sitio_internet/cfd/4/cadenaoriginal_4_0/cadenaoriginal_4_0.xslt',
  },
  '3.3': {
    schema:
      'https://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd',
    xslt: 'https://www.sat.gob.mx/sitio_internet/cfd/3/cadenaoriginal_3_3/cadenaoriginal_3_3.xslt',
  },
};

/**
 * Descarga los recursos del SAT necesarios para procesar CFDI.
 *
 * Descarga el esquema XSD, el XSLT de cadena original y todos los
 * complementos referenciados via xsl:include. Reescribe los hrefs
 * del XSLT principal para apuntar a rutas locales.
 */
export class SatResources {
  private readonly version: SatVersion;
  private readonly outputDir: string;

  constructor(options: SatResourcesOptions) {
    this.version = options.version;
    this.outputDir = options.outputDir;
  }

  /**
   * Descarga todos los recursos del SAT al directorio de salida.
   */
  async download(): Promise<DownloadResult> {
    const urls = SAT_URLS[this.version];
    const complementosDir = path.join(this.outputDir, 'complementos');

    fs.mkdirSync(this.outputDir, { recursive: true });
    fs.mkdirSync(complementosDir, { recursive: true });

    // 1. Descargar esquema XSD principal
    const schemaContent = await this._fetchText(urls.schema);
    const schemaFileName =
      this.version === '4.0' ? 'cfdv40.xsd' : 'cfdv33.xsd';
    const schemaPath = path.join(this.outputDir, schemaFileName);
    fs.writeFileSync(schemaPath, schemaContent, 'utf-8');

    // 2. Extraer URLs opcionales del schema (xs:import)
    const { catalogUrl, tipoDatosUrl } =
      this._extractSchemaImports(schemaContent);

    // 3. Descargar catalogo XSD (opcional)
    let catalogSchemaPath: string | null = null;
    if (catalogUrl) {
      try {
        const catalogContent = await this._fetchText(catalogUrl);
        const catalogFileName = path.basename(catalogUrl).split('?')[0];
        catalogSchemaPath = path.join(this.outputDir, catalogFileName);
        fs.writeFileSync(catalogSchemaPath, catalogContent, 'utf-8');
      } catch {
        catalogSchemaPath = null;
      }
    }

    // 4. Descargar tipoDatos XSD (opcional)
    let tipoDatosSchemaPath: string | null = null;
    if (tipoDatosUrl) {
      try {
        const tipoDatosContent = await this._fetchText(tipoDatosUrl);
        const tipoDatosFileName = path.basename(tipoDatosUrl).split('?')[0];
        tipoDatosSchemaPath = path.join(this.outputDir, tipoDatosFileName);
        fs.writeFileSync(tipoDatosSchemaPath, tipoDatosContent, 'utf-8');
      } catch {
        tipoDatosSchemaPath = null;
      }
    }

    // 5. Descargar XSLT principal
    const rawXslt = await this._fetchText(urls.xslt);
    const cleanXslt = this._cleanXml(rawXslt);

    // 6. Extraer URLs de xsl:include del XSLT principal
    const includeUrls = this._extractXslIncludes(cleanXslt);

    // 7. Descargar cada complemento y guardar en complementos/
    const downloadedComplementos: string[] = [];
    for (const includeUrl of includeUrls) {
      try {
        const complementoContent = await this._fetchText(includeUrl);
        const cleanComplemento = this._cleanXml(complementoContent);
        const fileName = path.basename(includeUrl).split('?')[0];
        const complementoPath = path.join(complementosDir, fileName);
        fs.writeFileSync(complementoPath, cleanComplemento, 'utf-8');
        downloadedComplementos.push(complementoPath);
      } catch {
        // Ignorar complementos que no se puedan descargar
      }
    }

    // 8. Reescribir hrefs del XSLT principal a rutas locales
    const localXslt = this._rewriteIncludes(cleanXslt, includeUrls);

    const xsltPath = path.join(this.outputDir, 'cadenaoriginal.xslt');
    fs.writeFileSync(xsltPath, localXslt, 'utf-8');

    // 9. Comparar complementos locales vs los del SAT
    const downloadedFileNames = new Set(
      downloadedComplementos.map(p => path.basename(p))
    );
    const { unused, added } = this._diffComplementos(
      complementosDir,
      downloadedFileNames
    );

    return {
      schema: schemaPath,
      xslt: xsltPath,
      catalogSchema: catalogSchemaPath,
      tipoDatosSchema: tipoDatosSchemaPath,
      complementos: downloadedComplementos,
      unused,
      added,
    };
  }

  /**
   * Descarga texto desde una URL usando fetch nativo de Node 22.
   */
  private async _fetchText(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error al descargar ${url}: ${response.status} ${response.statusText}`
      );
    }
    return response.text();
  }

  /**
   * Limpia el texto descargado del SAT eliminando basura antes del XML.
   * Los archivos del SAT a veces incluyen texto como:
   * "This XML file does not appear to have any style information..."
   */
  private _cleanXml(content: string): string {
    // Encontrar el inicio del XML valido
    const xmlDeclarationIndex = content.indexOf('<?xml');
    const xslStylesheetIndex = content.indexOf('<xsl:stylesheet');
    const xsStylesheetIndex = content.indexOf('<xs:schema');
    const xsdSchemaIndex = content.indexOf('<schema');

    const candidates = [
      xmlDeclarationIndex,
      xslStylesheetIndex,
      xsStylesheetIndex,
      xsdSchemaIndex,
    ].filter(i => i >= 0);

    if (candidates.length === 0) {
      return content;
    }

    const startIndex = Math.min(...candidates);
    const cleaned = content.slice(startIndex);

    // Asegurar que el XSLT tenga declaracion XML al inicio
    if (
      !cleaned.startsWith('<?xml') &&
      (cleaned.includes('<xsl:stylesheet') ||
        cleaned.includes('<xsl:transform'))
    ) {
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + cleaned;
    }

    return cleaned;
  }

  /**
   * Extrae las URLs de los xs:import del esquema XSD.
   * Busca especificamente los catalogos (catCFDI) y tipoDatos (tdCFDI).
   */
  private _extractSchemaImports(schemaContent: string): {
    catalogUrl: string | null;
    tipoDatosUrl: string | null;
  } {
    const importRegex =
      /<xs:import[^>]*schemaLocation=["']([^"']+)["'][^>]*>/gi;
    let catalogUrl: string | null = null;
    let tipoDatosUrl: string | null = null;

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(schemaContent)) !== null) {
      const schemaLocation = match[1];
      if (
        schemaLocation.includes('catCFDI') ||
        schemaLocation.includes('catalogos')
      ) {
        catalogUrl = schemaLocation;
      } else if (
        schemaLocation.includes('tdCFDI') ||
        schemaLocation.includes('tipoDatos')
      ) {
        tipoDatosUrl = schemaLocation;
      }
    }

    return { catalogUrl, tipoDatosUrl };
  }

  /**
   * Extrae las URLs de xsl:include del XSLT.
   */
  private _extractXslIncludes(xsltContent: string): string[] {
    const includeRegex = /<xsl:include[^>]*href=["']([^"']+)["'][^>]*\/?>/gi;
    const urls: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = includeRegex.exec(xsltContent)) !== null) {
      const href = match[1];
      if (href.startsWith('http://') || href.startsWith('https://')) {
        urls.push(href);
      }
    }

    return urls;
  }

  /**
   * Reescribe los href de xsl:include del XSLT principal para que
   * apunten a rutas locales dentro de la carpeta complementos/.
   *
   * Ejemplo:
   *   href="http://www.sat.gob.mx/sitio_internet/cfd/donat/donat11.xslt"
   *   -> href="./complementos/donat11.xslt"
   */
  /**
   * Compara los archivos .xslt existentes en el directorio de complementos
   * contra los que se descargaron del SAT.
   * - unused: archivos locales que ya no estan en el XSLT del SAT
   * - added: archivos nuevos del SAT que no existian localmente
   */
  private _diffComplementos(
    complementosDir: string,
    downloadedFileNames: Set<string>
  ): { unused: string[]; added: string[] } {
    const localFiles: string[] = fs.existsSync(complementosDir)
      ? fs
          .readdirSync(complementosDir)
          .filter((f: string) => f.endsWith('.xslt'))
      : [];

    const localSet = new Set(localFiles);

    const unused = localFiles.filter((f: string) => !downloadedFileNames.has(f));
    const added = [...downloadedFileNames].filter((f: string) => !localSet.has(f));

    return { unused, added };
  }

  private _rewriteIncludes(
    xsltContent: string,
    includeUrls: string[]
  ): string {
    let result = xsltContent;

    for (const url of includeUrls) {
      const fileName = path.basename(url).split('?')[0];
      const localHref = `./complementos/${fileName}`;
      // Reemplazar el href exacto con la ruta local
      result = result.split(url).join(localHref);
    }

    return result;
  }
}
