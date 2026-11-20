import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * La ruta existe, pero con otras mayúsculas/minúsculas (p. ej. `a.key` vs `A.key`).
 * En Windows/macOS funciona; en Linux falla. Se lanza para detectarlo antes.
 */
export class PathCaseMismatchError extends Error {
  constructor(
    public readonly actual: string,
    public readonly expected: string
  ) {
    super(
      `El archivo '${actual}' existe como '${expected}'. Usa la ruta exacta: en Linux se distinguen mayúsculas y minúsculas.`
    );
    this.name = 'PathCaseMismatchError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FileNotFoundError extends Error {
  constructor(public readonly file: string) {
    super(`El archivo '${file}' no existe.`);
    this.name = 'FileNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Valida que cada segmento de la ruta coincida EXACTAMENTE (mayúsculas
 * incluidas) con lo que hay en disco. No autocorrige.
 *
 * @returns la ruta absoluta resuelta.
 * @throws PathCaseMismatchError si solo difiere en mayúsculas/minúsculas.
 * @throws FileNotFoundError si no existe.
 */
export function assertExactCasePath(p: string): string {
  const resolved = path.resolve(p);
  // `root` ("/", "C:\", "\\server\share\") no se valida: en Windows las
  // letras de unidad y UNC no distinguen mayúsculas.
  const { root } = path.parse(resolved);
  const segments = resolved
    .slice(root.length)
    .split(path.sep)
    .filter((s) => s.length > 0);

  let current = root;
  for (const segment of segments) {
    let entries: string[];
    try {
      entries = fs.readdirSync(current);
    } catch {
      throw new FileNotFoundError(segment);
    }
    if (!entries.includes(segment)) {
      const lower = segment.toLowerCase();
      const similar = entries.find((e) => e.toLowerCase() === lower);
      if (similar !== undefined) {
        throw new PathCaseMismatchError(segment, similar);
      }
      throw new FileNotFoundError(segment);
    }
    current = path.join(current, segment);
  }
  return resolved;
}
