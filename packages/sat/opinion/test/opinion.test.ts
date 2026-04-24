import { describe, it, expect } from 'vitest';
import { OpinionCumplimientoService } from '../src/OpinionCumplimiento';
import { ResultadoOpinion } from '../src/types';

describe('OpinionCumplimientoService', () => {
  it('puede instanciarse con configuracion por defecto', () => {
    const service = new OpinionCumplimientoService();
    expect(service).toBeInstanceOf(OpinionCumplimientoService);
  });

  it('puede instanciarse con configuracion personalizada', () => {
    const service = new OpinionCumplimientoService({
      timeout: 60_000,
      baseUrl: 'https://test.example.com',
    });
    expect(service).toBeInstanceOf(OpinionCumplimientoService);
  });

  it('lanza error si la sesion no esta autenticada', async () => {
    const service = new OpinionCumplimientoService();
    const sesionInactiva = {
      cookies: {},
      rfc: 'AAA010101AAA',
      authenticated: false,
    };

    await expect(service.obtener(sesionInactiva)).rejects.toThrow(
      'sesion activa'
    );
  });

  it('lanza error al descargar PDF sin sesion activa', async () => {
    const service = new OpinionCumplimientoService();
    const sesionInactiva = {
      cookies: {},
      rfc: 'AAA010101AAA',
      authenticated: false,
    };

    await expect(service.descargarPdf(sesionInactiva)).rejects.toThrow(
      'sesion activa'
    );
  });
});

describe('ResultadoOpinion', () => {
  it('tiene los valores correctos', () => {
    expect(ResultadoOpinion.Positivo).toBe('Positivo');
    expect(ResultadoOpinion.Negativo).toBe('Negativo');
    expect(ResultadoOpinion.EnSuspenso).toBe('En suspenso');
    expect(ResultadoOpinion.Inscrito).toBe('Inscrito sin obligaciones');
    expect(ResultadoOpinion.NoInscrito).toBe('No inscrito');
  });
});
