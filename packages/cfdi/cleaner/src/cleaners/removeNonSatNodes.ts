import { SAT_NAMESPACES } from './satNamespaces';

/**
 * Dentro de <cfdi:Complemento>, elimina nodos hijo cuyo namespace URI
 * no este en la lista de namespaces oficiales del SAT.
 *
 * Estrategia: extrae el contenido interno de cfdi:Complemento y filtra
 * cada nodo hijo de primer nivel por su prefix, resolviendo el URI
 * contra los xmlns declarados en el XML.
 */
export function removeNonSatNodes(xml: string): string {
  // Construye un mapa prefix -> URI a partir de todas las declaraciones xmlns
  // presentes en el documento (pueden estar en el root o en nodos hijos).
  const prefixToUri: Record<string, string> = {};
  const xmlnsPattern = /xmlns:([a-zA-Z0-9_-]+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = xmlnsPattern.exec(xml)) !== null) {
    prefixToUri[m[1]] = m[2];
  }

  return xml.replace(
    /(<cfdi:Complemento[^>]*>)([\s\S]*?)(<\/cfdi:Complemento>)/g,
    (_match, open, inner, close) => {
      // Elimina nodos hijo cuyo prefix resuelve a un namespace no-SAT.
      // Patron: <prefix:LocalName ...>...</prefix:LocalName> o <prefix:LocalName .../>
      const cleaned = inner.replace(
        /<([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)([\s\S]*?)(?:<\/\1:\2>|\/>)/g,
        (nodeMatch: string, prefix: string) => {
          const uri = prefixToUri[prefix];
          // Si no conocemos el URI o no es SAT, eliminamos el nodo
          if (!uri || !SAT_NAMESPACES.has(uri)) {
            return '';
          }
          return nodeMatch;
        }
      );
      return `${open}${cleaned}${close}`;
    }
  );
}
