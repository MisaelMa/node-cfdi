import { readFileSync, existsSync } from 'fs';
import { join, isAbsolute, extname } from 'path';
import { ElementCompact, xml2js } from 'xml-js';

export interface LoaderOptions {
  source: string; // Ruta local o URL
  encoding?: BufferEncoding;
  timeout?: number;
}

export class XSDLoader {
  private static instance: XSDLoader;

  public static getInstance(): XSDLoader {
    if (!XSDLoader.instance) {
      XSDLoader.instance = new XSDLoader();
    }
    return XSDLoader.instance;
  }

  /**
   * Determina si una fuente es una URL o una ruta local
   */
  private isUrl(source: string): boolean {
    try {
      const url = new URL(source);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Valida si el archivo tiene extensión .xsd
   */
  private isXsdFile(source: string): boolean {
    if (this.isUrl(source)) {
      // Para URLs, verificar que termine en .xsd
      return source.toLowerCase().endsWith('.xsd');
    } else {
      // Para rutas locales, verificar la extensión
      return extname(source).toLowerCase() === '.xsd';
    }
  }

  /**
   * Carga el contenido del archivo desde una URL
   */
  private async loadFromUrl(url: string, timeout: number = 10000): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'XSDLoader/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const content = await response.text();
      
      if (!content.trim()) {
        throw new Error('El archivo descargado está vacío');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Timeout al descargar el archivo desde ${url}`);
        }
        throw new Error(`Error descargando XSD desde ${url}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Carga el contenido del archivo desde una ruta local
   */
  private loadFromPath(filePath: string, encoding: BufferEncoding = 'utf-8'): string {
    try {
      // Verificar si el archivo existe
      if (!existsSync(filePath)) {
        throw new Error(`El archivo no existe: ${filePath}`);
      }

      const content = readFileSync(filePath, encoding);
      
      if (!content.trim()) {
        throw new Error('El archivo está vacío');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error leyendo archivo ${filePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Carga y parsea un archivo XSD desde una URL o ruta local
   */
  async loadXSD(options: LoaderOptions): Promise<ElementCompact> {
    const { source, encoding = 'utf-8', timeout = 10000 } = options;

    // Validar que el archivo tenga extensión .xsd
    if (!this.isXsdFile(source)) {
      throw new Error(`El archivo debe tener extensión .xsd: ${source}`);
    }

    let content: string;

    try {
      if (this.isUrl(source)) {
        //console.log(`Descargando XSD desde URL: ${source}`);
        content = await this.loadFromUrl(source, timeout);
      } else {
        //console.log(`Cargando XSD desde archivo local: ${source}`);
        content = this.loadFromPath(source, encoding);
      }

      // Parsear el XML
      const options = {
        compact: true,
        ignoreComment: true,
        alwaysChildren: true,
      };

      const parsedXsd = xml2js(content, options) as ElementCompact;

      // Validar que sea un esquema XSD válido
      if (!parsedXsd['xs:schema']) {
        throw new Error('El archivo no es un esquema XSD válido (no contiene xs:schema)');
      }

      //console.log(`XSD cargado exitosamente desde: ${source}`);
      return parsedXsd;

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error procesando XSD desde ${source}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Carga múltiples archivos XSD
   */
  async loadMultipleXSD(sources: LoaderOptions[]): Promise<ElementCompact[]> {
    const promises = sources.map(options => this.loadXSD(options));
    
    try {
      return await Promise.all(promises);
    } catch (error) {
      throw new Error(`Error cargando múltiples archivos XSD: ${error}`);
    }
  }

  /**
   * Utilidad para crear opciones de carga rápida
   */
  static createOptions(source: string, encoding?: BufferEncoding, timeout?: number): LoaderOptions {
    return { source, encoding, timeout };
  }
}

// Instancia singleton para uso directo
export const xsdLoader = XSDLoader.getInstance(); 