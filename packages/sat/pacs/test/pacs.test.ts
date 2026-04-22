import { describe, expect, it } from 'vitest';
import {
  FinkokProvider,
  PacProviderType,
  type TimbradoRequest,
  type TimbradoResult,
} from '../src/index';

describe('@sat/pacs', () => {
  it('instancia FinkokProvider con configuración mínima', () => {
    const provider = new FinkokProvider({
      user: 'demo',
      password: 'demo',
      sandbox: true,
    });
    expect(provider).toBeInstanceOf(FinkokProvider);
  });

  it('expone los valores esperados en PacProviderType', () => {
    expect(PacProviderType.Finkok).toBe('Finkok');
    expect(PacProviderType.SW).toBe('SW');
    expect(PacProviderType.ComercioDigital).toBe('ComercioDigital');
    expect(PacProviderType.Prodigia).toBe('Prodigia');
    expect(PacProviderType.Diverza).toBe('Diverza');
  });

  it('compila TimbradoRequest y TimbradoResult como estructuras de datos', () => {
    const req: TimbradoRequest = { xmlCfdi: '<cfdi:Comprobante />' };
    const res: TimbradoResult = {
      uuid: '00000000-0000-0000-0000-000000000000',
      fechaTimbrado: '2024-01-01T12:00:00',
      selloCFD: 'x',
      selloSAT: 'y',
      noCertificadoSAT: '00001000000412345678',
      cadenaOriginalSAT: '||1.1|...',
      xmlTimbrado: `${req.xmlCfdi}<tfd:TimbreFiscalDigital UUID="${'00000000-0000-0000-0000-000000000000'}" FechaTimbrado="2024-01-01T12:00:00"/>`,
    };
    expect(res.xmlTimbrado).toContain('TimbreFiscalDigital');
  });
});
