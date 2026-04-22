import { describe, it, expect } from 'vitest';
import { BanxicoClient } from '../src/BanxicoClient';
import { Moneda, SERIE_BANXICO } from '../src/types';

describe('BanxicoClient', () => {
  it('se puede instanciar con un token válido', () => {
    const client = new BanxicoClient({ apiToken: 'token-de-prueba' });
    expect(client).toBeInstanceOf(BanxicoClient);
  });

  it('rechaza instanciación sin token', () => {
    expect(() => new BanxicoClient({ apiToken: '' })).toThrow(
      'apiToken es obligatorio'
    );
  });
});

describe('Moneda', () => {
  it('expone los códigos ISO esperados', () => {
    expect(Moneda.USD).toBe('USD');
    expect(Moneda.EUR).toBe('EUR');
    expect(Moneda.GBP).toBe('GBP');
    expect(Moneda.JPY).toBe('JPY');
    expect(Moneda.CAD).toBe('CAD');
  });
});

describe('SERIE_BANXICO', () => {
  it('asocia cada moneda con el id de serie SIE correcto', () => {
    expect(SERIE_BANXICO.get(Moneda.USD)).toBe('SF43718');
    expect(SERIE_BANXICO.get(Moneda.EUR)).toBe('SF46410');
    expect(SERIE_BANXICO.get(Moneda.GBP)).toBe('SF46407');
    expect(SERIE_BANXICO.get(Moneda.JPY)).toBe('SF46406');
    expect(SERIE_BANXICO.get(Moneda.CAD)).toBe('SF60632');
  });
});
