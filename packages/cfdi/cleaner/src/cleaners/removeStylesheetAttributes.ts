/**
 * Elimina processing instructions <?xml-stylesheet ...?> del XML.
 *
 * Estas instrucciones de procesamiento no son parte del estandar CFDI y
 * pueden causar problemas en sistemas que validan el XML estrictamente.
 */
export function removeStylesheetAttributes(xml: string): string {
  return xml.replace(/<\?xml-stylesheet[^?]*\?>/gi, '');
}
