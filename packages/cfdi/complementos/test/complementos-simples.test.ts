import { describe, it, expect } from 'vitest';
import { Donat } from '../src/4.0/donat/Donat';
import { Divisas } from '../src/4.0/divisas/Divisas';
import { Pfic } from '../src/4.0/pfic/Pfic';
import { RegistroFiscal } from '../src/4.0/registrofiscal/RegistroFiscal';
import { PagoEnEspecie } from '../src/4.0/pagoenespecie/PagoEnEspecie';
import { ObrasArte } from '../src/4.0/obrasarte/ObrasArte';
import { Tfd } from '../src/4.0/tfd/Tfd';
import { Detallista } from '../src/4.0/detallista/Detallista';

describe('Complementos simples 4.0', () => {
  it('Donat', () => {
    const d = new Donat({ version: '1.1', noAutorizacion: '123', fechaAutorizacion: '2024-01-01', leyenda: 'Leyenda test' });
    const r = d.getComplement();
    expect(r.key).toBe('donat:Donatarias');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/donat');
    expect(r.schemaLocation).toHaveLength(2);
    expect(r.complement._attributes.version).toBe('1.1');
    expect(r.complement._attributes.noAutorizacion).toBe('123');
  });

  it('Divisas', () => {
    const d = new Divisas({ version: '1.0', tipoOperacion: 'compra' });
    const r = d.getComplement();
    expect(r.key).toBe('divisas:Divisas');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/divisas');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('Pfic', () => {
    const p = new Pfic({ version: '1.0', ClaveVehicular: 'CV01', Placa: 'ABC123' });
    const r = p.getComplement();
    expect(r.key).toBe('pfic:PFintegranteCoordinado');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/pfic');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('RegistroFiscal', () => {
    const rf = new RegistroFiscal({ Version: '1.0', Folio: 'F001' });
    const r = rf.getComplement();
    expect(r.key).toBe('registrofiscal:CFDIRegistroFiscal');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/registrofiscal');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('PagoEnEspecie', () => {
    const pe = new PagoEnEspecie({ Version: '1.0', CvePIC: '01', FolioSolDon: 'F01', PzaArtNombre: 'Pieza', PzaArtTecn: 'Oleo', PzaArtAProd: '2020', PzaArtDim: '100x100' });
    const r = pe.getComplement();
    expect(r.key).toBe('pagoenespecie:PagoEnEspecie');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/pagoenespecie');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('ObrasArte', () => {
    const oa = new ObrasArte({ Version: '1.0', TipoBien: 'Pieza', TituloAdquirido: 'Compra', FechaAdquisicion: '2024-01-01', 'CaracterísticasDeObraoPieza': 'Original' });
    const r = oa.getComplement();
    expect(r.key).toBe('obrasarte:obrasarteantiguedades');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/arteantiguedades');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('Tfd', () => {
    const t = new Tfd({ Version: '1.1', UUID: 'ABC-123', FechaTimbrado: '2024-01-01T00:00:00', RfcProvCertif: 'AAA010101AAA', SelloCFD: 'sello', NoCertificadoSAT: '00001' });
    const r = t.getComplement();
    expect(r.key).toBe('tfd:TimbreFiscalDigital');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/TimbreFiscalDigital');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('Detallista', () => {
    const d = new Detallista({ documentStructureVersion: 'AMC8.1' });
    const r = d.getComplement();
    expect(r.key).toBe('detallista:detallista');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/detallista');
    expect(r.schemaLocation).toHaveLength(2);
  });
});
