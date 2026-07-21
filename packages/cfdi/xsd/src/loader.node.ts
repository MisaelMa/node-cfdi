// Adaptador NODE-ONLY del puerto `SchemaReader`.
//
// Este es el UNICO modulo de @cfdi/xsd que toca `fs`. Vive aparte para que el
// entrypoint browser (`browser.ts`) pueda exportar `Schema` sin arrastrar
// modulos nativos al bundle del front.
import { existsSync, readFileSync } from 'fs';

import { SchemaReader } from './schema';

/**
 *nodeSchemaReader
 *
 * Lee un JSON de schema desde disco. Devuelve `null` si la ruta no existe,
 * que es lo que `Schema` interpreta como "nada que cargar".
 *
 * @param file
 * string
 */
export const nodeSchemaReader: SchemaReader = (file: string) => {
  if (!existsSync(file)) {
    return null;
  }
  return JSON.parse(readFileSync(file, 'utf8'));
};
