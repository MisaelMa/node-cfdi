import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateCadenaOriginal, opcional, parseXslt } from '../src';

const fixtures = path.join(__dirname, 'fixtures');
const xslt = path.resolve(__dirname, '..', '..', '..', 'files', '4.0', 'cadenaoriginal.xslt');

// El Opcional del SAT recibe un node-set (select="./@Attr"): un atributo presente
// pero vacio es un node-set no vacio (true), asi que emite "|". Solo se omite si no existe.
describe('opcional', () => {
  it.each([
    [undefined, ''],
    ['', '|'],
    ['  ', '|'],
    [' a  b ', '|a b'],
  ])('opcional(%j) -> %j', (value, esperado) => {
    expect(opcional(value as string | undefined)).toBe(esperado);
  });

  it('atributos opcionales vacios coinciden con la cadena de xsltproc', () => {
    const xml = fs.readFileSync(path.join(fixtures, 'opcional-vacio.xml'), 'utf-8');
    // Generada una vez con: xsltproc cadenaoriginal.xslt opcional-vacio.xml
    const esperada = fs.readFileSync(path.join(fixtures, 'opcional-vacio.cadena.txt'), 'utf-8').trim();
    expect(generateCadenaOriginal(xml, parseXslt(xslt))).toBe(esperada);
  });
});
