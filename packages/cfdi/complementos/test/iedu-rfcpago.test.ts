import { describe, it, expect, expectTypeOf } from 'vitest';
import { Iedu } from '../src/4.0/iedu/Iedu';
import type { XmlIeduAttribute } from '../src/4.0/iedu/type/iedu.xslt';

describe('Iedu (iedu.xsd: rfcPago use="optional")', () => {
  const base: XmlIeduAttribute = {
    version: '1.0',
    nombreAlumno: 'Juan',
    CURP: 'CURP180101HDFAAA01',
    nivelEducativo: 'Primaria',
    autRVOE: '201587',
  };

  it('rfcPago es opcional en el tipo', () => {
    expectTypeOf<XmlIeduAttribute['rfcPago']>().toEqualTypeOf<string | undefined>();
  });

  it('sin rfcPago no emite el atributo', () => {
    const attrs = new Iedu({ ...base }).complemento._attributes!;
    expect('rfcPago' in attrs).toBe(false);
  });

  it.each(['', '   ', undefined])('rfcPago %j no se emite', (valor) => {
    const attrs = new Iedu({ ...base, rfcPago: valor }).complemento._attributes!;
    expect('rfcPago' in attrs).toBe(false);
  });

  it('con rfcPago lo conserva', () => {
    const attrs = new Iedu({ ...base, rfcPago: 'XAXX010101000' }).complemento._attributes!;
    expect(attrs.rfcPago).toBe('XAXX010101000');
  });

  it('no muta el objeto del consumidor', () => {
    const input = { ...base, rfcPago: '' };
    new Iedu(input);
    expect(input.rfcPago).toBe('');
  });
});
