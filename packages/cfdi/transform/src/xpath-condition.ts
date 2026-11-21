import type { XmlElement } from './types';

/**
 * Subconjunto de XPath soportado en el `test` de xsl:if:
 * `@a='v'`, `@a!='v'`, `@a` (existe), ruta de hijos (existe),
 * `and`, `or`, `not(...)` y parentesis.
 */
export type Condition =
  | { kind: 'and' | 'or'; left: Condition; right: Condition }
  | { kind: 'not'; operand: Condition }
  | { kind: 'attr'; name: string }
  | { kind: 'attrCmp'; name: string; op: '=' | '!='; value: string }
  | { kind: 'path'; path: string };

const TOKEN = /\s*(?:('[^']*'|"[^"]*")|(!=|=|\(|\)|,)|((?:\.\/|\/)?@?[\w:.-]+(?:\/[\w:.-]+)*))/y;

function tokenize(test: string): string[] | null {
  const tokens: string[] = [];
  TOKEN.lastIndex = 0;
  while (TOKEN.lastIndex < test.length) {
    if (/^\s*$/.test(test.slice(TOKEN.lastIndex))) break;
    const m = TOKEN.exec(test);
    if (!m) return null;
    tokens.push(m[1] ?? m[2] ?? m[3]);
  }
  return tokens;
}

export function parseCondition(test: string): Condition {
  const fail = (): never => {
    throw new Error(`test de xsl:if no soportado: ${test}`);
  };
  const tokens = tokenize(test);
  if (!tokens || tokens.length === 0) return fail();
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const isLiteral = (t?: string) => !!t && /^['"]/.test(t);

  const parseOr = (): Condition => {
    let left = parseAnd();
    while (peek() === 'or') {
      next();
      left = { kind: 'or', left, right: parseAnd() };
    }
    return left;
  };
  const parseAnd = (): Condition => {
    let left = parseUnary();
    while (peek() === 'and') {
      next();
      left = { kind: 'and', left, right: parseUnary() };
    }
    return left;
  };
  const parseUnary = (): Condition => {
    const t = next();
    if (t === undefined) return fail();
    if (t === '(') {
      const inner = parseOr();
      if (next() !== ')') return fail();
      return inner;
    }
    if (t === 'not' && peek() === '(') {
      next();
      const inner = parseOr();
      if (next() !== ')') return fail();
      return { kind: 'not', operand: inner };
    }
    if (['and', 'or', 'not', ')', '=', '!=', ','].includes(t) || isLiteral(t)) return fail();
    const attr = t.match(/^(?:\.\/)?@([\w:.-]+)$/);
    if (attr) {
      if (peek() === '=' || peek() === '!=') {
        const op = next() as '=' | '!=';
        const lit = next();
        if (!isLiteral(lit)) return fail();
        return { kind: 'attrCmp', name: attr[1], op, value: lit.slice(1, -1) };
      }
      return { kind: 'attr', name: attr[1] };
    }
    // Ruta de hijos: sin atributos, funciones ni comparaciones.
    if (t.includes('@') || t.startsWith('/') || peek() === '(' || peek() === '=' || peek() === '!=') {
      return fail();
    }
    return { kind: 'path', path: t.replace(/^\.\//, '') };
  };

  const result = parseOr();
  if (pos < tokens.length) return fail();
  return result;
}

export function evaluate(
  cond: Condition,
  node: XmlElement,
  resolveSelect: (node: XmlElement, path: string) => XmlElement[]
): boolean {
  switch (cond.kind) {
    case 'and':
      return evaluate(cond.left, node, resolveSelect) && evaluate(cond.right, node, resolveSelect);
    case 'or':
      return evaluate(cond.left, node, resolveSelect) || evaluate(cond.right, node, resolveSelect);
    case 'not':
      return !evaluate(cond.operand, node, resolveSelect);
    case 'attr':
      return node.attributes?.[cond.name] !== undefined;
    case 'attrCmp': {
      const actual = node.attributes?.[cond.name];
      // XPath: `@a != 'v'` es falso si el atributo no existe.
      if (actual === undefined) return false;
      return cond.op === '=' ? actual === cond.value : actual !== cond.value;
    }
    case 'path':
      return resolveSelect(node, cond.path).length > 0;
  }
}
