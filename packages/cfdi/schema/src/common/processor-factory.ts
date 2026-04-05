import { CfdiXsd } from '../cfdi.xsd';
import { CatalogProcess } from '../catalogos.xsd';
import { ProcessorConfig } from './interfaces';

/**
 * Factory para crear procesadores XSD de manera centralizada
 * Simplifica el uso y centraliza la lógica de creación
 */
export class ProcessorFactory {
  /**
   * Crea un procesador CFDI configurado
   */
  static createCfdiProcessor(config?: ProcessorConfig): CfdiXsd {
    const processor = CfdiXsd.of();
    if (config) {
      processor.setConfig(config);
    }
    return processor;
  }

  /**
   * Crea un procesador de catálogos configurado
   */
  static createCatalogProcessor(config?: ProcessorConfig): CatalogProcess {
    const processor = CatalogProcess.of();
    if (config) {
      processor.setConfig(config);
    }
    return processor;
  }

  /**
   * Crea un procesador basado en el tipo especificado
   */
  static createProcessor(
    type: 'cfdi' | 'catalog',
    config?: ProcessorConfig
  ): CfdiXsd | CatalogProcess {
    switch (type) {
      case 'cfdi':
        return this.createCfdiProcessor(config);
      case 'catalog':
        return this.createCatalogProcessor(config);
      default:
        throw new Error(`Tipo de procesador no soportado: ${type}`);
    }
  }

  /**
   * Procesa un XSD desde una fuente específica
   */
  static async processXSD(
    type: 'cfdi' | 'catalog',
    source: string,
    options?: Omit<ProcessorConfig, 'source'>
  ): Promise<any> {
    const config: ProcessorConfig = { source, ...options };
    const processor = this.createProcessor(type, config);
    return await processor.process();
  }
}

/**
 * Funciones de conveniencia para uso directo
 */
export const createCfdiProcessor = ProcessorFactory.createCfdiProcessor;
export const createCatalogProcessor = ProcessorFactory.createCatalogProcessor;
export const processXSD = ProcessorFactory.processXSD; 