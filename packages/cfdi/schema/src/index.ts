// Exportar clases principales
export { CfdiSchema } from './schema.xsd';
export { CfdiSchema as default } from './schema.xsd';
export { CfdiXsd } from './cfdi.xsd';
export { CatalogProcess } from './catalogos.xsd';

// Exportar XSDLoader
export { 
  XSDLoader, 
  xsdLoader, 
  type LoaderOptions 
} from './loader.xsd';

// Exportar clases base y utilidades
export { BaseXSDProcessor } from './common/base-processor';
export { XMLUtils } from './common/xml-utils';
export { XSD_CONSTANTS } from './common/constants';

// Exportar interfaces y tipos
export type {
  ProcessorConfig,
  ProcessingOptions,
  ProcessingResult,
  XSDGenerationConfig,
  IXSDProcessor,
  XMLElementOptions
} from './common/interfaces';

// Exportar tipos de constantes
export type {
  XSDNamespaces,
  SchemaLocations
} from './common/constants';

// Exportar factory y funciones de conveniencia
export {
  ProcessorFactory,
  createCfdiProcessor,
  createCatalogProcessor,
  processXSD
} from './common/processor-factory';




