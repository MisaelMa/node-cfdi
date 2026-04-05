import { describe, expect, it } from 'vitest';
import { validate } from '../src/rfc';
import { Rfc } from '../src/value/Rfc';
import { RfcFaker } from '../src/RfcFaker';

describe('RfcFaker.persona()', () => {
  it('genera un RFC de 13 caracteres', () => {
    const rfc = RfcFaker.persona();
    expect(rfc).toHaveLength(13);
  });

  it('genera un RFC que pasa la validacion de la funcion validate()', () => {
    const rfc = RfcFaker.persona();
    const result = validate(rfc);
    expect(result.isValid).toBe(true);
  });

  it('genera un RFC reconocido como persona fisica por Rfc', () => {
    const rfcStr = RfcFaker.persona();
    const rfc = Rfc.of(rfcStr);
    expect(rfc.isFisica()).toBe(true);
    expect(rfc.isMoral()).toBe(false);
  });

  it('genera un RFC que no es generico ni extranjero', () => {
    const rfc = Rfc.of(RfcFaker.persona());
    expect(rfc.isGeneric()).toBe(false);
    expect(rfc.isForeign()).toBe(false);
  });

  it('genera RFCs distintos en multiples llamadas', () => {
    // Con alta probabilidad, dos RFCs aleatorios no seran iguales
    const rfcs = new Set(Array.from({ length: 10 }, () => RfcFaker.persona()));
    expect(rfcs.size).toBeGreaterThan(1);
  });

  it('el tipo retornado por validate() es "person"', () => {
    const rfc = RfcFaker.persona();
    expect(validate(rfc).type).toBe('person');
  });

  it('genera multiples RFCs validos consecutivos', () => {
    for (let i = 0; i < 20; i++) {
      const rfc = RfcFaker.persona();
      const result = validate(rfc);
      expect(result.isValid).toBe(true);
    }
  });
});

describe('RfcFaker.moral()', () => {
  it('genera un RFC de 12 caracteres', () => {
    const rfc = RfcFaker.moral();
    expect(rfc).toHaveLength(12);
  });

  it('genera un RFC que pasa la validacion de la funcion validate()', () => {
    const rfc = RfcFaker.moral();
    const result = validate(rfc);
    expect(result.isValid).toBe(true);
  });

  it('genera un RFC reconocido como persona moral por Rfc', () => {
    const rfcStr = RfcFaker.moral();
    const rfc = Rfc.of(rfcStr);
    expect(rfc.isMoral()).toBe(true);
    expect(rfc.isFisica()).toBe(false);
  });

  it('el tipo retornado por validate() es "company"', () => {
    const rfc = RfcFaker.moral();
    expect(validate(rfc).type).toBe('company');
  });

  it('genera multiples RFCs validos consecutivos', () => {
    for (let i = 0; i < 20; i++) {
      const rfc = RfcFaker.moral();
      const result = validate(rfc);
      expect(result.isValid).toBe(true);
    }
  });

  it('genera RFCs distintos en multiples llamadas', () => {
    const rfcs = new Set(Array.from({ length: 10 }, () => RfcFaker.moral()));
    expect(rfcs.size).toBeGreaterThan(1);
  });
});

describe('diferencias entre persona() y moral()', () => {
  it('persona() y moral() generan longitudes distintas', () => {
    expect(RfcFaker.persona()).toHaveLength(13);
    expect(RfcFaker.moral()).toHaveLength(12);
  });

  it('los RFCs generados son strings mayusculas', () => {
    const persona = RfcFaker.persona();
    const moral = RfcFaker.moral();
    expect(persona).toBe(persona.toUpperCase());
    expect(moral).toBe(moral.toUpperCase());
  });

  it('los RFCs generados solo contienen caracteres validos del SAT', () => {
    const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    expect(RfcFaker.persona()).toMatch(rfcRegex);
    expect(RfcFaker.moral()).toMatch(rfcRegex);
  });
});
