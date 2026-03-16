/**
 * Normaliza whitespace excesivo entre tags XML.
 *
 * Reemplaza multiples espacios/tabs/saltos de linea consecutivos entre
 * el cierre de un tag y la apertura del siguiente por un espacio simple.
 * Preserva el contenido de texto dentro de los nodos.
 */
export function collapseWhitespace(xml: string): string {
  // Colapsa whitespace entre tags: >   < -> >\n<
  return xml
    .replace(/>[ \t\r\n]+</g, '>\n<')
    .trim();
}
