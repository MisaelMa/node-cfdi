import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  assertExactCasePath,
  FileNotFoundError,
  PathCaseMismatchError,
} from '../src/node';

let base: string;

beforeAll(() => {
  base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'cfdi-utils-')));
  fs.writeFileSync(path.join(base, 'A.key'), 'x');
  fs.mkdirSync(path.join(base, 'Certs', 'Sub'), { recursive: true });
  fs.writeFileSync(path.join(base, 'Certs', 'Sub', 'B.cer'), 'x');
});

afterAll(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

describe('assertExactCasePath', () => {
  it('devuelve la ruta resuelta cuando coincide exactamente', () => {
    const p = path.join(base, 'A.key');
    expect(assertExactCasePath(p)).toBe(p);
  });

  it('acepta rutas anidadas exactas y relativas (resuelve a absoluta)', () => {
    const p = path.join(base, 'Certs', 'Sub', 'B.cer');
    expect(assertExactCasePath(p)).toBe(p);
    const rel = path.relative(process.cwd(), p);
    expect(assertExactCasePath(rel)).toBe(p);
  });

  it('lanza PathCaseMismatchError si el archivo difiere en mayúsculas', () => {
    expect(() => assertExactCasePath(path.join(base, 'a.key'))).toThrow(
      PathCaseMismatchError
    );
  });

  it('el mensaje indica la ruta exacta, en español', () => {
    try {
      assertExactCasePath(path.join(base, 'a.key'));
      expect.unreachable();
    } catch (e) {
      const err = e as PathCaseMismatchError;
      expect(err.message).toBe(
        "El archivo 'a.key' existe como 'A.key'. Usa la ruta exacta: en Linux se distinguen mayúsculas y minúsculas."
      );
      expect(err.expected).toBe('A.key');
      expect(err.actual).toBe('a.key');
      expect(err.name).toBe('PathCaseMismatchError');
    }
  });

  it('detecta mayúsculas incorrectas en un directorio intermedio', () => {
    const p = path.join(base, 'certs', 'Sub', 'B.cer');
    try {
      assertExactCasePath(p);
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(PathCaseMismatchError);
      expect((e as PathCaseMismatchError).expected).toBe('Certs');
    }
  });

  it('lanza FileNotFoundError si no existe', () => {
    const p = path.join(base, 'nope.key');
    expect(() => assertExactCasePath(p)).toThrow(FileNotFoundError);
    try {
      assertExactCasePath(p);
    } catch (e) {
      expect((e as Error).message).toContain("'nope.key'");
      expect((e as Error).name).toBe('FileNotFoundError');
    }
  });

  it('lanza FileNotFoundError si falta un directorio intermedio', () => {
    expect(() =>
      assertExactCasePath(path.join(base, 'Missing', 'x.key'))
    ).toThrow(FileNotFoundError);
  });

  it('no autocorrige: nunca devuelve la ruta con otras mayúsculas', () => {
    expect(() => assertExactCasePath(path.join(base, 'a.key'))).toThrow();
  });

  it('ambos errores son instancias de Error', () => {
    expect(new PathCaseMismatchError('a', 'A')).toBeInstanceOf(Error);
    expect(new FileNotFoundError('a')).toBeInstanceOf(Error);
  });
});
