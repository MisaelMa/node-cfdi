import { ElementCompact } from 'xml-js';
import { LoaderOptions } from '../loader.xsd';

/**
 * Configuración base para procesadores XSD
 */
export interface ProcessorConfig {
  source?: string;
  path?: string; // Mantener compatibilidad hacia atrás
  encoding?: BufferEncoding;
  timeout?: number;
}

/**
 * Opciones de procesamiento extendidas
 */
export interface ProcessingOptions extends LoaderOptions {
  validateSchema?: boolean;
  removeAnnotations?: boolean;
}

/**
 * Resultado estándar de procesamiento
 */
export interface ProcessingResult {
  name: string;
  path?: string;
  key?: string;
  folder?: string;
  xsd: string | ElementCompact;
}

/**
 * Configuración de generación XSD
 */
export interface XSDGenerationConfig {
  type: 'xsd' | 'json';
  folder?: string;
  path?: string;
  key?: string;
}

/**
 * Interface base para procesadores
 */
export interface IXSDProcessor {
  setConfig(options: ProcessorConfig): void;
  process(): Promise<any>;
  readXsd(): Promise<ElementCompact>;
}

/**
 * Opciones para creación de elementos XML
 */
export interface XMLElementOptions {
  namespaces?: Record<string, string>;
  imports?: Array<{
    namespace: string;
    schemaLocation: string;
  }>;
  targetNamespace?: string;
  elementFormDefault?: string;
  attributeFormDefault?: string;
} 