import { SAT_NAMESPACES } from './satNamespaces';

/**
 * Elimina declaraciones xmlns:prefix="uri" del elemento raiz donde el URI
 * no esta en la lista de namespaces oficiales del SAT.
 *
 * Solo procesa el elemento raiz (cfdi:Comprobante) para evitar tocar
 * declaraciones inline en nodos hijos.
 */
export function removeNonSatNamespaces(xml: string): string {
  // Captura la apertura del elemento raiz (hasta el primer '>') y procesa
  // solo los xmlns dentro de ese bloque.
  return xml.replace(
    /(<cfdi:Comprobante\b)([\s\S]*?)(\/?>)/,
    (_match, open, attrs, close) => {
      const cleaned = attrs.replace(
        /\s+xmlns:[a-zA-Z0-9_-]+="([^"]*)"/g,
        (declaration: string, uri: string) => {
          return SAT_NAMESPACES.has(uri) ? declaration : '';
        }
      );
      return `${open}${cleaned}${close}`;
    }
  );
}
