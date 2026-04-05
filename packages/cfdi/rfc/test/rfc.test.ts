import { describe, expect, it } from 'vitest';
import { getType, hasForbiddenWords, validate } from '../src/rfc';

// RFC de prueba verificados con la funcion checkDigit del SAT
const RFC_PERSONA_FISICA = 'GODE561231GR8'; // persona fisica valida
const RFC_PERSONA_MORAL = 'BMC860829IF3'; // persona moral valida

describe('validate()', () => {
  describe('RFCs validos', () => {
    it('acepta RFC valido de persona fisica (13 chars)', () => {
      const result = validate(RFC_PERSONA_FISICA);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('person');
      expect(result.rfc).toBe(RFC_PERSONA_FISICA);
    });

    it('acepta RFC valido de persona moral (12 chars)', () => {
      const result = validate(RFC_PERSONA_MORAL);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('company');
      expect(result.rfc).toBe(RFC_PERSONA_MORAL);
    });

    it('normaliza el input — minusculas y espacios extra', () => {
      const result = validate('  gode561231gr8  ');
      expect(result.isValid).toBe(true);
      expect(result.rfc).toBe(RFC_PERSONA_FISICA);
    });

    it('siempre retorna el objeto con la propiedad rfc aunque sea invalido', () => {
      const result = validate('invalido');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('rfc');
    });
  });

  describe('RFCs invalidos', () => {
    it('rechaza cadena vacia', () => {
      const result = validate('');
      expect(result.isValid).toBe(false);
    });

    it('rechaza RFC demasiado corto', () => {
      expect(validate('GOD56').isValid).toBe(false);
    });

    it('rechaza RFC demasiado largo', () => {
      expect(validate('GODE5612311234GR8X').isValid).toBe(false);
    });

    it('rechaza RFC con mes imposible (13)', () => {
      // La fecha YYMMDD con MM=13 es invalida
      expect(validate('GODE561301GR8').isValid).toBe(false);
    });

    it('rechaza RFC con dia imposible (00)', () => {
      expect(validate('GODE561200GR8').isValid).toBe(false);
    });

    it('rechaza RFC con digito verificador incorrecto', () => {
      // Ultimo digito cambiado a uno incorrecto
      const rfcMalo = RFC_PERSONA_FISICA.slice(0, -1) + '9';
      expect(validate(rfcMalo).isValid).toBe(false);
    });

    it('rechaza RFC con palabra prohibida en prefijo', () => {
      // Cualquier RFC cuyo prefijo de 4 letras sea palabra prohibida
      // Nota: el formato puede ser valido pero la palabra lo invalida
      const result = validate('BUEI010101XX0');
      expect(result.isValid).toBe(false);
    });
  });
});

describe('getType()', () => {
  it('retorna "person" para RFC de 13 caracteres', () => {
    expect(getType(RFC_PERSONA_FISICA)).toBe('person');
  });

  it('retorna "company" para RFC de 12 caracteres', () => {
    expect(getType(RFC_PERSONA_MORAL)).toBe('company');
  });

  it('retorna "generic" para XAXX010101000', () => {
    expect(getType('XAXX010101000')).toBe('generic');
  });

  it('retorna "foreign" para XEXX010101000', () => {
    expect(getType('XEXX010101000')).toBe('foreign');
  });
});

describe('hasForbiddenWords()', () => {
  it('detecta palabras prohibidas al inicio del RFC', () => {
    expect(hasForbiddenWords('BUEI010101XX0')).toBe(true);
    expect(hasForbiddenWords('CACA010101XX0')).toBe(true);
    expect(hasForbiddenWords('MEAR010101XX0')).toBe(true);
    expect(hasForbiddenWords('PUTA010101XX0')).toBe(true);
  });

  it('no detecta palabra prohibida en RFC normal', () => {
    expect(hasForbiddenWords(RFC_PERSONA_FISICA)).toBe(false);
    expect(hasForbiddenWords(RFC_PERSONA_MORAL)).toBe(false);
  });

  it('no detecta palabra prohibida si el prefijo no coincide exactamente', () => {
    // MULE no esta en la lista, solo MULA
    expect(hasForbiddenWords('MULE010101XX0')).toBe(false);
  });
});
