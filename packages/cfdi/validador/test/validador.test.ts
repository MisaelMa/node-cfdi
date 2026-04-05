import { describe, it, expect } from 'vitest';
import path from 'path';
import { Validador } from '../src/Validador';

const FILES_DIR = path.resolve(
  __dirname,
  '../../../files/xml/examples'
);

const cfdi40Dir = path.join(FILES_DIR, 'test-cfdi40');
const cfdi33Dir = path.join(FILES_DIR, 'test-cfdi33');

describe('Validador - XMLs validos CFDI 4.0', () => {
  const validador = new Validador();

  it('valida ingreso-basico.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-basico.xml')
    );
    expect(result.version).toBe('4.0');
    expect(result.errors).toHaveLength(0);
    expect(result.valid).toBe(true);
  });

  it('valida ingreso-dolares.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-dolares.xml')
    );
    expect(result.version).toBe('4.0');
    expect(result.errors).toHaveLength(0);
    expect(result.valid).toBe(true);
  });

  it('valida ingreso-exento.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-exento.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida ingreso-iva-retencion.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-iva-retencion.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida ingreso-ieps.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-ieps.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida egreso-nota-credito.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'egreso-nota-credito.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida traslado.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'traslado.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida ingreso-sin-impuestos.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-sin-impuestos.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida ingreso-multi-concepto.xml sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-multi-concepto.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('Validador - XMLs validos CFDI 3.3', () => {
  const validador = new Validador();

  it('valida ingreso-basico.xml CFDI 3.3 sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi33Dir, 'ingreso-basico.xml')
    );
    expect(result.version).toBe('3.3');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida ingreso-iva-retencion.xml CFDI 3.3 sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi33Dir, 'ingreso-iva-retencion.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('valida traslado.xml CFDI 3.3 sin errores', () => {
    const result = validador.validateFile(
      path.join(cfdi33Dir, 'traslado.xml')
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('Validador - version invalida', () => {
  const validador = new Validador();

  it('reporta error cuando la version es invalida', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="2.0" TipoDeComprobante="I" Fecha="2024-01-01T00:00:00"
  LugarExpedicion="06600" SubTotal="0" Total="0" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="0" Importe="0" ObjetoImp="01"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'CFDI001')).toBe(true);
  });
});

describe('Validador - estructura de resultado', () => {
  const validador = new Validador();

  it('resultado tiene la estructura correcta', () => {
    const result = validador.validateFile(
      path.join(cfdi40Dir, 'ingreso-basico.xml')
    );
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('warnings');
    expect(result).toHaveProperty('version');
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('cada issue tiene code, message y rule', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I" Fecha="2024-01-01T00:00:00"
  LugarExpedicion="06600" SubTotal="1000.00" Total="9999.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="01"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    // Total 9999 vs expected 1000 - should have errors
    for (const issue of result.errors) {
      expect(issue).toHaveProperty('code');
      expect(issue).toHaveProperty('message');
      expect(issue).toHaveProperty('rule');
    }
  });
});
