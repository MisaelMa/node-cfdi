import { describe, it, expect, vi } from 'vitest';
import { CFDI } from '../src';
import { Logger } from '../src/utils/Logger';

describe('CFDI', () => {
  it('debería retornar un error al generar la cadena original con @cfdi/transform (default)', async () => {
    const spy = vi.spyOn(Logger, 'error').mockImplementation(() => {});
    const cfdi = new CFDI({ xslt: { path: 'error.xslt' } });
    cfdi.setDebug(true);
    expect(() => cfdi.generarCadenaOriginal()).toThrow();
    spy.mockRestore();
  });

  it('debería retornar un error al generar la cadena original con @saxon-he/cli', async () => {
    const spy = vi.spyOn(Logger, 'error').mockImplementation(() => {});
    const cfdi = new CFDI({ xslt: { path: 'error.xslt' }, saxon: { binary: 'transform' } });
    cfdi.setDebug(true);
    expect(() => cfdi.generarCadenaOriginal()).toThrow();
    spy.mockRestore();
  });

  it('debería lanzar un error cuando no se proporciona xslt', async () => {
    const cfdi = new CFDI();

    expect(() => cfdi.generarCadenaOriginal()).toThrow(Error);
    expect(() => cfdi.generarCadenaOriginal()).toThrow('¡Ups! Direcction Not Found Extensible Stylesheet Language Transformation');
  });
});
