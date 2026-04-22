import { describe, expect, it } from 'vitest';
import { InvalidRfcError, Rfc } from '../../src/value/Rfc';

// RFCs de prueba verificados con la logica checkDigit del SAT
const RFC_FISICA = 'GODE561231GR8'; // persona fisica valida (13 chars)
const RFC_MORAL = 'BMC860829IF3'; // persona moral valida (12 chars)
const RFC_GENERICO = 'XAXX010101000';
const RFC_EXTRANJERO = 'XEXX010101000';

describe('Rfc.of()', () => {
  it('crea instancia con RFC valido de persona fisica', () => {
    const rfc = Rfc.of(RFC_FISICA);
    expect(rfc.toString()).toBe(RFC_FISICA);
  });

  it('crea instancia con RFC valido de persona moral', () => {
    const rfc = Rfc.of(RFC_MORAL);
    expect(rfc.toString()).toBe(RFC_MORAL);
  });

  it('acepta RFC generico XAXX010101000 por definicion reglamentaria', () => {
    const rfc = Rfc.of(RFC_GENERICO);
    expect(rfc.toString()).toBe(RFC_GENERICO);
  });

  it('acepta RFC para extranjeros XEXX010101000 por definicion reglamentaria', () => {
    const rfc = Rfc.of(RFC_EXTRANJERO);
    expect(rfc.toString()).toBe(RFC_EXTRANJERO);
  });

  it('normaliza el input a mayusculas y sin espacios', () => {
    const rfc = Rfc.of('  gode561231gr8  ');
    expect(rfc.toString()).toBe(RFC_FISICA);
  });

  it('lanza InvalidRfcError con RFC invalido', () => {
    expect(() => Rfc.of('RFC_INVALIDO')).toThrow(InvalidRfcError);
  });

  it('el mensaje de error incluye el RFC proporcionado', () => {
    expect(() => Rfc.of('MAL')).toThrow("'MAL' is not a valid RFC");
  });

  it('lanza InvalidRfcError con cadena vacia', () => {
    expect(() => Rfc.of('')).toThrow(InvalidRfcError);
  });
});

describe('Rfc.parse()', () => {
  it('retorna instancia Rfc con RFC valido de persona fisica', () => {
    const rfc = Rfc.parse(RFC_FISICA);
    expect(rfc).not.toBeNull();
    expect(rfc!.toString()).toBe(RFC_FISICA);
  });

  it('retorna instancia Rfc con RFC valido de persona moral', () => {
    const rfc = Rfc.parse(RFC_MORAL);
    expect(rfc).not.toBeNull();
    expect(rfc!.toString()).toBe(RFC_MORAL);
  });

  it('retorna null con RFC invalido', () => {
    expect(Rfc.parse('INVALIDO')).toBeNull();
  });

  it('retorna null con cadena vacia', () => {
    expect(Rfc.parse('')).toBeNull();
  });

  it('acepta RFC generico', () => {
    expect(Rfc.parse(RFC_GENERICO)).not.toBeNull();
  });

  it('acepta RFC de extranjero', () => {
    expect(Rfc.parse(RFC_EXTRANJERO)).not.toBeNull();
  });
});

describe('Rfc.isValid()', () => {
  it('retorna true para RFC de persona fisica valido', () => {
    expect(Rfc.isValid(RFC_FISICA)).toBe(true);
  });

  it('retorna true para RFC de persona moral valido', () => {
    expect(Rfc.isValid(RFC_MORAL)).toBe(true);
  });

  it('retorna true para RFC generico', () => {
    expect(Rfc.isValid(RFC_GENERICO)).toBe(true);
  });

  it('retorna true para RFC de extranjero', () => {
    expect(Rfc.isValid(RFC_EXTRANJERO)).toBe(true);
  });

  it('retorna false para RFC con formato invalido', () => {
    expect(Rfc.isValid('INVALIDO')).toBe(false);
  });

  it('retorna false para RFC con digito verificador incorrecto', () => {
    const rfcMalo = RFC_FISICA.slice(0, -1) + '9';
    expect(Rfc.isValid(rfcMalo)).toBe(false);
  });
});

describe('isFisica()', () => {
  it('retorna true para persona fisica (13 chars)', () => {
    expect(Rfc.of(RFC_FISICA).isFisica()).toBe(true);
  });

  it('retorna false para persona moral (12 chars)', () => {
    expect(Rfc.of(RFC_MORAL).isFisica()).toBe(false);
  });

  it('retorna false para RFC generico aunque tenga 13 chars', () => {
    expect(Rfc.of(RFC_GENERICO).isFisica()).toBe(false);
  });

  it('retorna false para RFC de extranjero aunque tenga 13 chars', () => {
    expect(Rfc.of(RFC_EXTRANJERO).isFisica()).toBe(false);
  });
});

describe('isMoral()', () => {
  it('retorna true para persona moral (12 chars)', () => {
    expect(Rfc.of(RFC_MORAL).isMoral()).toBe(true);
  });

  it('retorna false para persona fisica (13 chars)', () => {
    expect(Rfc.of(RFC_FISICA).isMoral()).toBe(false);
  });
});

describe('isGeneric()', () => {
  it('retorna true solo para XAXX010101000', () => {
    expect(Rfc.of(RFC_GENERICO).isGeneric()).toBe(true);
  });

  it('retorna false para RFC normal de persona fisica', () => {
    expect(Rfc.of(RFC_FISICA).isGeneric()).toBe(false);
  });

  it('retorna false para RFC de extranjero', () => {
    expect(Rfc.of(RFC_EXTRANJERO).isGeneric()).toBe(false);
  });
});

describe('isForeign()', () => {
  it('retorna true solo para XEXX010101000', () => {
    expect(Rfc.of(RFC_EXTRANJERO).isForeign()).toBe(true);
  });

  it('retorna false para RFC normal de persona fisica', () => {
    expect(Rfc.of(RFC_FISICA).isForeign()).toBe(false);
  });

  it('retorna false para RFC generico', () => {
    expect(Rfc.of(RFC_GENERICO).isForeign()).toBe(false);
  });
});

describe('obtainDate()', () => {
  it('extrae la fecha de un RFC de persona fisica', () => {
    // GODE561231GR8: date part = 561231 -> 31 diciembre 1956
    const rfc = Rfc.of(RFC_FISICA);
    const date = rfc.obtainDate();
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(1956);
    expect(date!.getMonth()).toBe(11); // diciembre = indice 11
    expect(date!.getDate()).toBe(31);
  });

  it('extrae la fecha de un RFC de persona moral', () => {
    // BMC860829IF3: date part = 860829 -> 29 agosto 1986
    const rfc = Rfc.of(RFC_MORAL);
    const date = rfc.obtainDate();
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(1986);
    expect(date!.getMonth()).toBe(7); // agosto = indice 7
    expect(date!.getDate()).toBe(29);
  });

  it('retorna null para RFC generico', () => {
    expect(Rfc.of(RFC_GENERICO).obtainDate()).toBeNull();
  });

  it('retorna null para RFC de extranjero', () => {
    expect(Rfc.of(RFC_EXTRANJERO).obtainDate()).toBeNull();
  });
});

describe('equals()', () => {
  it('dos instancias con el mismo RFC son iguales', () => {
    const a = Rfc.of(RFC_FISICA);
    const b = Rfc.of(RFC_FISICA);
    expect(a.equals(b)).toBe(true);
  });

  it('dos instancias con diferentes RFCs no son iguales', () => {
    const a = Rfc.of(RFC_FISICA);
    const b = Rfc.of(RFC_MORAL);
    expect(a.equals(b)).toBe(false);
  });

  it('es reflexivo: a.equals(a) es true', () => {
    const a = Rfc.of(RFC_FISICA);
    expect(a.equals(a)).toBe(true);
  });

  it('es simetrico: a.equals(b) == b.equals(a)', () => {
    const a = Rfc.of(RFC_FISICA);
    const b = Rfc.of(RFC_MORAL);
    expect(a.equals(b)).toBe(b.equals(a));
  });
});

describe('toString()', () => {
  it('retorna el valor del RFC en mayusculas', () => {
    const rfc = Rfc.of(RFC_FISICA);
    expect(rfc.toString()).toBe(RFC_FISICA);
  });
});
