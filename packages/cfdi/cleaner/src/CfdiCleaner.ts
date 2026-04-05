import fs from 'node:fs';
import {
  collapseWhitespace,
  removeAddenda,
  removeNonSatNamespaces,
  removeNonSatNodes,
  removeNonSatSchemaLocations,
  removeStylesheetAttributes,
} from './cleaners';

/**
 * Limpia XMLs de CFDI eliminando contenido no estandar del SAT.
 *
 * Las operaciones de limpieza se aplican en el siguiente orden:
 *  1. Elimina processing instructions xml-stylesheet
 *  2. Elimina addendas
 *  3. Elimina nodos no-SAT dentro de cfdi:Complemento
 *  4. Elimina declaraciones xmlns no-SAT del elemento raiz
 *  5. Limpia pares no-SAT en xsi:schemaLocation
 *  6. Normaliza whitespace entre tags
 *
 * El Sello, Certificado y UUID NO se modifican.
 * Solo se elimina contenido, nunca se agrega.
 */
export class CfdiCleaner {
  /**
   * Limpia un XML de CFDI en memoria.
   *
   * @param xml - Contenido XML del CFDI como string UTF-8
   * @returns XML limpio con solo contenido oficial del SAT
   */
  clean(xml: string): string {
    let result = xml;
    result = removeStylesheetAttributes(result);
    result = removeAddenda(result);
    result = removeNonSatNodes(result);
    result = removeNonSatNamespaces(result);
    result = removeNonSatSchemaLocations(result);
    result = collapseWhitespace(result);
    return result;
  }

  /**
   * Limpia un CFDI leyendo el archivo desde disco.
   *
   * @param filePath - Ruta absoluta al archivo XML
   * @returns XML limpio con solo contenido oficial del SAT
   */
  cleanFile(filePath: string): string {
    const xml = fs.readFileSync(filePath, 'utf-8');
    return this.clean(xml);
  }
}
