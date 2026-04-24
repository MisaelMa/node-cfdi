/**
 * Constantes centralizadas para el procesamiento de XSD
 */

export const XSD_CONSTANTS = {
  // Configuración de timeout y encoding por defecto
  DEFAULT_TIMEOUT: 15000,
  DEFAULT_ENCODING: 'utf-8' as BufferEncoding,
  
  // Espacios de nombres XML comunes
  NAMESPACES: {
    CFDI: 'http://www.sat.gob.mx/cfd/4',
    XS: 'http://www.w3.org/2001/XMLSchema',
    CAT_CFDI: 'http://www.sat.gob.mx/sitio_internet/cfd/catalogos',
    TD_CFDI: 'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI',
  },

  // Ubicaciones de esquemas externos
  SCHEMA_LOCATIONS: {
    CAT_CFDI: 'http://www.sat.gob.mx/sitio_internet/cfd/catalogos/catCFDI.xsd',
    TD_CFDI: 'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI/tdCFDI.xsd',
  },

  // Opciones de procesamiento XML estándar
  XML_OPTIONS: {
    compact: true,
    ignoreComment: true,
    alwaysChildren: true,
  },

  // Configuración de salida XML
  OUTPUT_OPTIONS: {
    compact: true,
    ignoreComment: true,
    spaces: 4,
  },

  // Propiedades de catálogo a eliminar por defecto
  CATALOG_REMOVE_PROPERTIES: [
    'c_CodigoPostal',
    'c_ClaveProdServ', 
    'c_ClaveUnidad',
    'c_Colonia',
  ],
} as const;

export type XSDNamespaces = typeof XSD_CONSTANTS.NAMESPACES;
export type SchemaLocations = typeof XSD_CONSTANTS.SCHEMA_LOCATIONS; 