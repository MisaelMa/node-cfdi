import { ElementCompact } from 'xml-js';
import { XSDLoader, LoaderOptions } from '../loader.xsd';
import { XSD_CONSTANTS } from './constants';
import { ProcessorConfig, IXSDProcessor } from './interfaces';

/**
 * Clase base abstracta que centraliza la lógica común de procesadores XSD
 * Elimina duplicación entre CfdiProcess y CatalogProcess
 */
export abstract class BaseXSDProcessor implements IXSDProcessor {
  protected xsdLoader: XSDLoader;
  protected source: string = '';

  constructor() {
    this.xsdLoader = XSDLoader.getInstance();
  }

  /**
   * Configuración estandarizada con compatibilidad hacia atrás
   */
  setConfig(options: ProcessorConfig): void {
    // Mantener compatibilidad hacia atrás con 'path'
    const source = options.source || options.path;
    if (source) {
      this.source = source;
    }
  }

  /**
   * Lectura estandarizada de XSD con validación
   */
  async readXsd(): Promise<ElementCompact> {
    if (!this.source) {
      throw new Error('No se ha configurado una fuente XSD. Use setConfig() primero.');
    }
    
    const loaderOptions: LoaderOptions = {
      source: this.source,
      encoding: XSD_CONSTANTS.DEFAULT_ENCODING,
      timeout: XSD_CONSTANTS.DEFAULT_TIMEOUT,
    };
    
    return await this.xsdLoader.loadXSD(loaderOptions);
  }

  /**
   * Validación de configuración
   */
  protected validateConfig(): void {
    if (!this.source) {
      throw new Error('Configuración inválida: se requiere source o path');
    }
  }

  /**
   * Método abstracto que cada procesador debe implementar
   */
  abstract process(): Promise<any>;

  /**
   * Método opcional para limpieza de recursos
   */
  dispose(): void {
    // Implementación base - los procesadores pueden sobrescribir
  }
} 