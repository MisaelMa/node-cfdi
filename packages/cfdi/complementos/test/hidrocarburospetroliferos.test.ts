import { describe, it, expect } from 'vitest';
import { HidrocarburosPetroliferos } from '../src/4.0/hidrocarburospetroliferos/HidrocarburosPetroliferos';
import {
  TipoPermiso,
  SubProductoHYP,
} from '../src/4.0/hidrocarburospetroliferos/type/hidrocarburospetroliferos.enum';

describe('HidrocarburosPetroliferos (HidroYPetro v1.0)', () => {
  it('expone key, xmlns, xsd y atributos correctos', () => {
    const hyp = new HidrocarburosPetroliferos({
      Version: '1.0',
      TipoPermiso: 'PER07',
      NumeroPermiso: 'PL/1234/EXP/ES/2026',
      ClaveHYP: '15101505',
      SubProductoHYP: 'SP22',
    });

    const r = hyp.getComplement();
    expect(r.key).toBe('hidrocarburospetroliferos:HidroYPetro');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/hidrocarburospetroliferos');
    expect(r.xmlnskey).toBe('hidrocarburospetroliferos');
    expect(r.schemaLocation).toHaveLength(2);
    expect(r.schemaLocation[0]).toBe(
      'http://www.sat.gob.mx/hidrocarburospetroliferos'
    );
    expect(r.schemaLocation[1]).toBe(
      'http://www.sat.gob.mx/sitio_internet/cfd/hidrocarburospetroliferos/hidrocarburospetroliferos.xsd'
    );
    expect(r.complement._attributes?.Version).toBe('1.0');
    expect(r.complement._attributes?.TipoPermiso).toBe('PER07');
    expect(r.complement._attributes?.NumeroPermiso).toBe(
      'PL/1234/EXP/ES/2026'
    );
    expect(r.complement._attributes?.ClaveHYP).toBe('15101505');
    expect(r.complement._attributes?.SubProductoHYP).toBe('SP22');
  });

  it('acepta valores del enum TipoPermiso y SubProductoHYP', () => {
    const hyp = new HidrocarburosPetroliferos({
      Version: '1.0',
      TipoPermiso: TipoPermiso.PER06,
      NumeroPermiso: 'DIS/0001/DIS/GN/2026',
      ClaveHYP: '15101501',
      SubProductoHYP: SubProductoHYP.SP19,
    });

    const r = hyp.getComplement();
    expect(r.complement._attributes?.TipoPermiso).toBe('PER06');
    expect(r.complement._attributes?.SubProductoHYP).toBe('SP19');
  });

  it('acepta strings sueltos en union Enum | string', () => {
    const hyp = new HidrocarburosPetroliferos({
      Version: '1.0',
      TipoPermiso: 'PER11',
      NumeroPermiso: 'GLP/0099/DIS/2026',
      ClaveHYP: '15101520',
      SubProductoHYP: 'SP48',
    });

    const r = hyp.getComplement();
    expect(r.complement._attributes?.TipoPermiso).toBe('PER11');
    expect(r.complement._attributes?.SubProductoHYP).toBe('SP48');
  });
});
