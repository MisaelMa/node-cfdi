import { describe, it, expect, vi } from 'vitest';
import { CFDI } from '../src';
import { Options } from '../src/types/types';
import xmlJS from 'xml-js';
import fs from 'fs';
import path from 'path';
import { FileSystem } from '../src/utils/FileSystem';

vi.mock('@cfdi/transform', () => ({
  Transform: vi.fn().mockImplementation(() => ({
    s: vi.fn().mockReturnThis(),
    xsl: vi.fn().mockReturnThis(),
    warnings: vi.fn().mockReturnThis(),
    run: vi.fn().mockReturnValue('CADENA_ORIGINAL'),
  })),
}));

vi.mock('@saxon-he/cli', () => ({
  Transform: vi.fn().mockImplementation(() => ({
    s: vi.fn().mockReturnThis(),
    xsl: vi.fn().mockReturnThis(),
    warnings: vi.fn().mockReturnThis(),
    run: vi.fn().mockReturnValue('CADENA_ORIGINAL_SAXON'),
  })),
}));

vi.mock('../src/utils/FileSystem', () => ({
  FileSystem: {
    getTmpFullPath: vi.fn().mockReturnValue('/tmp/tempfile.xml'),
    generateNameTemp: vi.fn().mockReturnValue('tempfile'),
  },
}));

const files = path.resolve(__dirname, '..', '..', '..', 'files');

const key_path = `${files}/certificados/LAN7008173R5.key`;
const key_pem_path = `${files}/certificados/LAN7008173R5.key.pem`;
const cer_path = `${files}/certificados/LAN7008173R5.cer`;
const cer_pem_path = `${files}/certificados/LAN7008173R5.cer.pem`;
const xslt_path = `${files}/4.0/cadenaoriginal.xslt`;

describe('CFDI', () => {
  it('debería crear una instancia de CFDI con los atributos dados', () => {
    const options: Options = { debug: true, xslt: { path: 'path/to/xslt' } };
    const cfdi = new CFDI(options);
    expect(cfdi).toBeInstanceOf(CFDI);
    expect(cfdi.isBebug).toBe(true);
  });

  it('debería certificar el CFDI', () => {
    const cfdi = new CFDI();
    cfdi.certificar(cer_path);

    const cfdiJson = cfdi.getJsonCdfi();
    expect(cfdiJson['cfdi:Comprobante']._attributes.NoCertificado).toBe(
      '20001000000300022815'
    );
    expect(cfdiJson['cfdi:Comprobante']._attributes.Certificado).contain(
      'MIIFxTCCA62gAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI4MTUwDQYJKoZIhvcN'
    );
  });

  it('debería retornar un error al certificar el CFDI', () => {
    const cfdi = new CFDI();
    cfdi.setDebug(true);
    expect(() => cfdi.certificar('path/to/nonexistent.cer')).toThrow();
  });

  it('debería generar la cadena original', async () => {
    const validateSpyFsWrite = vi.spyOn(fs, 'writeFileSync');
    const validateSpyUnlinkSync = vi.spyOn(fs, 'unlinkSync');
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const cfdi = new CFDI({ xslt: { path: xslt_path } });
    cfdi.setDebug(true);
    const cadenaOriginal = await cfdi.generarCadenaOriginal();
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd">
    <cfdi:Emisor/>
    <cfdi:Receptor/>
</cfdi:Comprobante>`;
    expect(validateSpyFsWrite).toBeCalled();
    expect(validateSpyFsWrite).toHaveBeenCalledWith(
      '/tmp/tempfile.xml',
      xml,
      'utf8'
    );
    expect(FileSystem.getTmpFullPath).toHaveBeenCalled();
    expect(FileSystem.generateNameTemp).toHaveBeenCalled();

    expect(consoleLogSpy).toHaveBeenCalledWith('xslt =>', { path: xslt_path });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'cadena original =>',
      'CADENA_ORIGINAL'
    );

    expect(cadenaOriginal).toBe('CADENA_ORIGINAL');
    expect(validateSpyUnlinkSync).toHaveBeenCalledWith('/tmp/tempfile.xml');

    validateSpyFsWrite.mockRestore();
    validateSpyUnlinkSync.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('debería generar el sello correctamente', async () => {
    const cfdi = new CFDI();
    cfdi.setDebug(true);
    const generarSello = (cfdi as any).generarSello;

    const cadenaOriginal = 'CADENA_ORIGINAL';

    const sello = await generarSello(cadenaOriginal, key_path, '12345678a');
    expect(sello).toBeDefined();
    expect(typeof sello).toBe('string');
  });

  it('debería retornar un error al generar el sello', async () => {
    const cfdi = new CFDI();

    const cadenaOriginal = 'CADENA_ORIGINAL';
    expect(() =>
      cfdi.generarSello(cadenaOriginal, 'error.key', '123456a')
    ).toThrow();
  });

  describe('generarCadenaOriginal - branches', () => {
    it('debería lanzar error sin xslt configurado', () => {
      const cfdi = new CFDI();
      expect(() => cfdi.generarCadenaOriginal()).toThrow(
        'Extensible Stylesheet Language Transformation'
      );
    });

    it('debería usar CfdiTransform cuando no hay saxon', () => {
      const spyWrite = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      const spyUnlink = vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

      const cfdi = new CFDI({ xslt: { path: xslt_path } });
      const cadena = cfdi.generarCadenaOriginal();
      expect(cadena).toBe('CADENA_ORIGINAL');
      expect(spyWrite).toHaveBeenCalled();
      expect(spyUnlink).toHaveBeenCalled();

      spyWrite.mockRestore();
      spyUnlink.mockRestore();
    });

    it('debería usar SaxonTransform cuando se configura saxon', () => {
      const spyWrite = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      const spyUnlink = vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

      const cfdi = new CFDI({
        xslt: { path: xslt_path },
        saxon: { binary: '/usr/local/bin/transform' },
      });
      const cadena = cfdi.generarCadenaOriginal();
      expect(cadena).toBe('CADENA_ORIGINAL_SAXON');

      spyWrite.mockRestore();
      spyUnlink.mockRestore();
    });
  });

  it('debería sellar el CFDI', async () => {
    const cfdi = new CFDI();
    vi.spyOn(cfdi, 'generarCadenaOriginal').mockResolvedValue(
      'CADENA_ORIGINAL'
    );
    vi.spyOn(cfdi as any, 'generarSello').mockResolvedValue('SIGNATURE_HEX');

    await cfdi.sellar(key_path, '12345678a');
    expect(cfdi.cadenaOriginal).toBe('CADENA_ORIGINAL');
    expect(cfdi.sello).toBe('SIGNATURE_HEX');

    const cfdiJson = cfdi.getJsonCdfi();
    expect(cfdiJson['cfdi:Comprobante']._attributes.Sello).toBe(
      'SIGNATURE_HEX'
    );
    vi.restoreAllMocks();
  });

  it('debería retornar el JSON del CFDI', () => {
    const cfdi = new CFDI();
    const jsonCdfi = cfdi.getJsonCdfi();
    expect(jsonCdfi).toEqual({
      _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
      'cfdi:Comprobante': {
        _attributes: {
          'xmlns:cfdi': 'http://www.sat.gob.mx/cfd/4',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:schemaLocation':
            'http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd',
        },
        'cfdi:Emisor': {},
        'cfdi:Receptor': {},
      },
    });
  });

  it('debería retornar el XML del CFDI', async () => {
    const validateSpyFsWrite = vi.spyOn(xmlJS, 'js2xml');

    const cfdi = new CFDI();
    const xmlCdfi = await cfdi.getXmlCdfi();
    expect(validateSpyFsWrite).toHaveBeenCalledWith(cfdi.getJsonCdfi(), {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    });
    expect(xmlCdfi).toBe(`<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd">
    <cfdi:Emisor/>
    <cfdi:Receptor/>
</cfdi:Comprobante>`);
  });

  it('debería guardar el archivo', () => {
    const validateSpywriteFileSync = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => true);
    const cfdi = new CFDI();
    const result = cfdi.saveFile('fileContent', '/path/to/save/', 'filename');
    expect(validateSpywriteFileSync).toHaveBeenCalledWith(
      '/path/to/save/filename.xml',
      Buffer.from('fileContent', 'base64'),
      'utf8'
    );
    expect(result).toBe(true);
  });

  it('debería manejar errores al guardar el archivo', () => {
    const cfdi = new CFDI();
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('Error writing file');
    });
    const result = cfdi.saveFile('fileContent', '/path/to/save/', 'filename');
    expect(result).toBe(false);
  });

  it('debería cambiar al modo debug', () => {
    const cfdi = new CFDI();
    cfdi.setDebug(true);
    expect(cfdi.isBebug).toBe(true);
  });

  describe('soporte multi-formato certificar()', () => {
    it('debería certificar con .cer (DER binario)', () => {
      const cfdi = new CFDI();
      cfdi.certificar(cer_path);
      const json = cfdi.getJsonCdfi();
      expect(json['cfdi:Comprobante']._attributes.NoCertificado).toBe(
        '20001000000300022815'
      );
      expect(json['cfdi:Comprobante']._attributes.Certificado).toContain(
        'MIIFxTCCA62gAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI4MTUw'
      );
    });

    it('debería certificar con .cer.pem', () => {
      const cfdi = new CFDI();
      cfdi.certificar(cer_pem_path);
      const json = cfdi.getJsonCdfi();
      expect(json['cfdi:Comprobante']._attributes.NoCertificado).toBe(
        '20001000000300022815'
      );
      expect(json['cfdi:Comprobante']._attributes.Certificado).toContain(
        'MIIFxTCCA62gAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI4MTUw'
      );
    });

    it('debería obtener el mismo NoCertificado y Certificado con .cer y .pem', () => {
      const cfdiCer = new CFDI();
      cfdiCer.certificar(cer_path);
      const jsonCer = cfdiCer.getJsonCdfi();

      const cfdiPem = new CFDI();
      cfdiPem.certificar(cer_pem_path);
      const jsonPem = cfdiPem.getJsonCdfi();

      expect(jsonCer['cfdi:Comprobante']._attributes.NoCertificado).toBe(
        jsonPem['cfdi:Comprobante']._attributes.NoCertificado
      );
      expect(jsonCer['cfdi:Comprobante']._attributes.Certificado).toBe(
        jsonPem['cfdi:Comprobante']._attributes.Certificado
      );
    });
  });

  describe('soporte multi-formato generarSello()', () => {
    const cadena = 'CADENA_ORIGINAL_TEST';

    it('debería generar sello con .key (DER cifrado)', () => {
      const cfdi = new CFDI();
      const sello = cfdi.generarSello(cadena, key_path, '12345678a');
      expect(sello).toBeDefined();
      expect(typeof sello).toBe('string');
      expect(sello.length).toBeGreaterThan(10);
    });

    it('debería generar sello con .key.pem', () => {
      const cfdi = new CFDI();
      const sello = cfdi.generarSello(cadena, key_pem_path, '12345678a');
      expect(sello).toBeDefined();
      expect(typeof sello).toBe('string');
      expect(sello.length).toBeGreaterThan(10);
    });

    it('debería generar el mismo sello con .key y .key.pem', () => {
      const cfdi = new CFDI();
      const selloKey = cfdi.generarSello(cadena, key_path, '12345678a');
      const selloPem = cfdi.generarSello(cadena, key_pem_path, '12345678a');
      expect(selloKey).toBe(selloPem);
    });

    it('debería fallar con contraseña incorrecta en .key', () => {
      const cfdi = new CFDI();
      expect(() =>
        cfdi.generarSello(cadena, key_path, 'wrong_password')
      ).toThrow();
    });

    it('debería generar sellos diferentes para cadenas diferentes', () => {
      const cfdi = new CFDI();
      const sello1 = cfdi.generarSello('cadena_1', key_path, '12345678a');
      const sello2 = cfdi.generarSello('cadena_2', key_path, '12345678a');
      expect(sello1).not.toBe(sello2);
    });
  });
});
