/**
 * Elimina el nodo <cfdi:Addenda>...</cfdi:Addenda> completo del XML.
 *
 * La Addenda es contenido no estándar permitido por el SAT solo para datos
 * adicionales del emisor/receptor. No forma parte del CFDI oficial y no
 * debe considerarse para la cadena original ni el sello.
 */
export function removeAddenda(xml: string): string {
  // Elimina el bloque completo incluyendo atributos en el tag de apertura y
  // cualquier contenido anidado, usando un patron que respeta nesting basico.
  // El flag 's' (dotAll) permite que '.' coincida con saltos de linea.
  return xml.replace(/<cfdi:Addenda[\s\S]*?<\/cfdi:Addenda>/gi, '');
}
