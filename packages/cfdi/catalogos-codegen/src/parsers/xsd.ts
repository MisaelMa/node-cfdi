import fs from 'fs';

/**
 * Mapa de nombre de simpleType (`c_FormaPago`, `c_RegimenFiscal`, ...) al
 * arreglo de codigos extraidos de sus `<xs:enumeration value="..."/>`.
 *
 * El XSD del SAT tiene la forma:
 *   <xs:simpleType name="c_FormaPago">
 *     <xs:restriction base="xs:string">
 *       <xs:enumeration value="01"/>
 *       <xs:enumeration value="02"/>
 *       ...
 *     </xs:restriction>
 *   </xs:simpleType>
 */
export type CodesByType = Map<string, string[]>;

const SIMPLE_TYPE_REGEX =
  /<xs:simpleType\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/xs:simpleType>/g;
const ENUMERATION_REGEX = /<xs:enumeration\s+value="([^"]*)"\s*\/?>/g;

export function parseXsdString(content: string): CodesByType {
  const result: CodesByType = new Map();
  let match: RegExpExecArray | null;
  SIMPLE_TYPE_REGEX.lastIndex = 0;
  while ((match = SIMPLE_TYPE_REGEX.exec(content)) !== null) {
    const name = match[1];
    const body = match[2];
    const codes: string[] = [];
    let enumMatch: RegExpExecArray | null;
    const enumRegex = new RegExp(ENUMERATION_REGEX.source, 'g');
    while ((enumMatch = enumRegex.exec(body)) !== null) {
      codes.push(enumMatch[1]);
    }
    if (codes.length > 0) {
      result.set(name, codes);
    }
  }
  return result;
}

export function parseXsd(filePath: string): CodesByType {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseXsdString(content);
}
