import { describe, it, expect } from 'vitest';
import { SatPortal } from '../src/SatPortal';
import { TipoAutenticacion } from '../src/types';

describe('SatPortal', () => {
  it('puede instanciarse con configuracion por defecto', () => {
    const portal = new SatPortal();
    expect(portal).toBeInstanceOf(SatPortal);
  });

  it('puede instanciarse con configuracion personalizada', () => {
    const portal = new SatPortal({
      timeout: 60_000,
      userAgent: 'TestAgent/1.0',
      baseUrl: 'https://test.example.com',
    });
    expect(portal).toBeInstanceOf(SatPortal);
  });

  it('lanza error si la sesion no esta activa', async () => {
    const portal = new SatPortal();
    const sesionInactiva = {
      cookies: {},
      rfc: 'AAA010101AAA',
      authenticated: false,
    };

    await expect(
      portal.consultarCfdis(sesionInactiva, {
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-31',
      })
    ).rejects.toThrow('no esta activa');
  });

  it('lanza error si la sesion ha expirado', async () => {
    const portal = new SatPortal();
    const sesionExpirada = {
      cookies: {},
      rfc: 'AAA010101AAA',
      authenticated: true,
      expiresAt: new Date(Date.now() - 1000),
    };

    await expect(
      portal.consultarCfdis(sesionExpirada, {
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-31',
      })
    ).rejects.toThrow('expirado');
  });

  it('exporta TipoAutenticacion con los valores correctos', () => {
    expect(TipoAutenticacion.FIEL).toBe('fiel');
    expect(TipoAutenticacion.CIEC).toBe('ciec');
  });
});
