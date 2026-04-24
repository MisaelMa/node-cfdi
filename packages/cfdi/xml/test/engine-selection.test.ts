import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CFDI } from '../src';
import fs from 'fs';
import path from 'path';

const files = path.resolve(__dirname, '..', '..', '..', 'files');
const xslt_path = `${files}/4.0/cadenaoriginal.xslt`;

const transformRunMock = vi.fn().mockReturnValue('||CADENA_TRANSFORM||');
const saxonRunMock = vi.fn().mockReturnValue('||CADENA_SAXON||');

vi.mock('@cfdi/transform', () => ({
  Transform: vi.fn().mockImplementation(() => ({
    s: vi.fn().mockReturnThis(),
    xsl: vi.fn().mockReturnThis(),
    warnings: vi.fn().mockReturnThis(),
    run: transformRunMock,
  })),
}));

vi.mock('@saxon-he/cli', () => ({
  Transform: vi.fn().mockImplementation(() => ({
    s: vi.fn().mockReturnThis(),
    xsl: vi.fn().mockReturnThis(),
    warnings: vi.fn().mockReturnThis(),
    run: saxonRunMock,
  })),
}));

vi.mock('../src/utils/FileSystem', () => ({
  FileSystem: {
    getTmpFullPath: vi.fn().mockReturnValue('/tmp/tempfile.xml'),
    generateNameTemp: vi.fn().mockReturnValue('tempfile'),
  },
}));

describe('Seleccion de motor XSLT', () => {
  beforeEach(() => {
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
    transformRunMock.mockClear();
    saxonRunMock.mockClear();
  });

  it('debería usar @cfdi/transform por defecto cuando no se configura saxon', () => {
    const cfdi = new CFDI({ xslt: { path: xslt_path } });
    const cadena = cfdi.generarCadenaOriginal();

    expect(transformRunMock).toHaveBeenCalled();
    expect(saxonRunMock).not.toHaveBeenCalled();
    expect(cadena).toBe('||CADENA_TRANSFORM||');
  });

  it('debería usar @saxon-he/cli cuando se configura saxon', () => {
    const cfdi = new CFDI({
      xslt: { path: xslt_path },
      saxon: { binary: 'transform' },
    });
    const cadena = cfdi.generarCadenaOriginal();

    expect(saxonRunMock).toHaveBeenCalled();
    expect(transformRunMock).not.toHaveBeenCalled();
    expect(cadena).toBe('||CADENA_SAXON||');
  });

  it('debería lanzar error cuando no se proporciona xslt en ambos motores', () => {
    const cfdiDefault = new CFDI();
    expect(() => cfdiDefault.generarCadenaOriginal()).toThrow(
      '¡Ups! Direcction Not Found Extensible Stylesheet Language Transformation'
    );

    const cfdiSaxon = new CFDI({ saxon: { binary: 'transform' } });
    expect(() => cfdiSaxon.generarCadenaOriginal()).toThrow(
      '¡Ups! Direcction Not Found Extensible Stylesheet Language Transformation'
    );
  });
});
