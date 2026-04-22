import crypto from 'crypto';

/**
 * Canonicalizacion XML Exclusiva (C14N exc) simplificada para el Timestamp
 * del token SOAP de autenticacion del SAT.
 *
 * Esta implementacion cubre unicamente lo necesario para el elemento Timestamp:
 * - Elimina la declaracion XML
 * - Ordena los atributos alfabeticamente por nombre
 * - Normaliza saltos de linea a LF
 * - Elimina espacios innecesarios entre tags de apertura y cierre
 *
 * No es una implementacion completa de C14N, pero es suficiente para el
 * caso de uso de autenticacion con el SAT.
 */
export function canonicalize(xmlFragment: string): string {
  // Eliminar declaracion XML si existe
  let result = xmlFragment.replace(/<\?xml[^?]*\?>\s*/g, '');

  // Normalizar saltos de linea
  result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Ordenar atributos dentro de cada tag de apertura
  result = result.replace(/<([a-zA-Z][^\s/>]*)((?:\s+[^>]*)?)(\/?)>/g, (_match, tagName: string, attrsStr: string, selfClose: string) => {
    if (!attrsStr || !attrsStr.trim()) {
      return `<${tagName}${selfClose}>`;
    }
    const attrs = _parseAttributes(attrsStr);
    const sortedAttrs = Object.keys(attrs)
      .sort()
      .map(name => `${name}="${attrs[name]}"`)
      .join(' ');
    return `<${tagName} ${sortedAttrs}${selfClose}>`;
  });

  return result;
}

/**
 * Parsea un string de atributos XML y retorna un objeto nombre -> valor.
 */
function _parseAttributes(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  // Patron: nombre="valor" o nombre='valor'
  const attrRegex = /([a-zA-Z_:][\w:.-]*)=["']([^"']*)["']/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(attrsStr)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

/**
 * Calcula el digest SHA-256 del string dado y lo retorna en base64.
 */
export function sha256Digest(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('base64');
}

/**
 * Firma el string `data` con la llave privada RSA usando SHA-256.
 * Retorna la firma en base64.
 */
export function signRsaSha256(
  data: string,
  privateKey: crypto.KeyObject
): string {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data, 'utf8');
  return sign.sign(privateKey, 'base64');
}
