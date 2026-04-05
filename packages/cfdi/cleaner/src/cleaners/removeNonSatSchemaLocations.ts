import { SAT_NAMESPACES } from './satNamespaces';

/**
 * Limpia el atributo xsi:schemaLocation eliminando pares URI+XSD donde el URI
 * no sea un namespace oficial del SAT.
 *
 * El valor de xsi:schemaLocation es una lista de pares separados por espacios:
 *   "namespaceURI schemaURI namespaceURI2 schemaURI2 ..."
 */
export function removeNonSatSchemaLocations(xml: string): string {
  return xml.replace(
    /xsi:schemaLocation="([^"]*)"/g,
    (_match, locations: string) => {
      const tokens = locations.trim().split(/\s+/);
      const kept: string[] = [];

      // Los tokens vienen en pares: [namespaceURI, xsdURI, namespaceURI2, ...]
      for (let i = 0; i < tokens.length - 1; i += 2) {
        const namespaceUri = tokens[i];
        const xsdUri = tokens[i + 1];
        if (SAT_NAMESPACES.has(namespaceUri)) {
          kept.push(namespaceUri, xsdUri);
        }
      }

      // Si queda un token huerfano (numero impar) lo descartamos
      return `xsi:schemaLocation="${kept.join(' ')}"`;
    }
  );
}
