import { describe, expect, it } from 'vitest';
import path from 'path';
import { parseXslt } from '../src';

const files = path.resolve(__dirname, '..', '..', '..', 'files');
const xslt_path = `${files}/4.0/cadenaoriginal.xslt`;

describe('xslt parser', () => {
  it('should parse cadenaoriginal.xslt and extract templates', () => {
    const { templates } = parseXslt(xslt_path);

    expect(templates.size).toBeGreaterThan(0);
    expect(templates.has('cfdi:Comprobante')).toBe(true);
    expect(templates.has('cfdi:Emisor')).toBe(true);
    expect(templates.has('cfdi:Receptor')).toBe(true);
    expect(templates.has('cfdi:Concepto')).toBe(true);
    expect(templates.has('cfdi:Impuestos')).toBe(true);
    expect(templates.has('cfdi:Complemento')).toBe(true);
  });

  it('should parse complemento templates', () => {
    const { templates } = parseXslt(xslt_path);

    expect(templates.has('vehiculousado:VehiculoUsado')).toBe(true);
    expect(templates.has('pago20:Pagos')).toBe(true);
    expect(templates.has('nomina12:Nomina')).toBe(true);
  });

  it('should extract correct attribute order for Comprobante', () => {
    const { templates } = parseXslt(xslt_path);
    const comprobante = templates.get('cfdi:Comprobante')!;
    const attrRules = comprobante.rules.filter(r => r.type === 'attr');

    expect(attrRules[0]).toEqual({ type: 'attr', name: 'Version', required: true });
    expect(attrRules[1]).toEqual({ type: 'attr', name: 'Serie', required: false });
    expect(attrRules[2]).toEqual({ type: 'attr', name: 'Folio', required: false });
    expect(attrRules[3]).toEqual({ type: 'attr', name: 'Fecha', required: true });
  });

  it('should distinguish Requerido from Opcional', () => {
    const { templates } = parseXslt(xslt_path);
    const emisor = templates.get('cfdi:Emisor')!;
    const attrRules = emisor.rules.filter(r => r.type === 'attr');

    expect(attrRules[0]).toEqual({ type: 'attr', name: 'Rfc', required: true });
    expect(attrRules[3]).toEqual({ type: 'attr', name: 'FacAtrAdquirente', required: false });
  });

  it('should extract namespaces from XSLT', () => {
    const { namespaces } = parseXslt(xslt_path);

    expect(namespaces.get('cfdi')).toBe('http://www.sat.gob.mx/cfd/4');
    expect(namespaces.get('pago20')).toBe('http://www.sat.gob.mx/Pagos20');
    expect(namespaces.get('nomina12')).toBe('http://www.sat.gob.mx/nomina12');
    expect(namespaces.get('vehiculousado')).toBe('http://www.sat.gob.mx/vehiculousado');
  });
});
