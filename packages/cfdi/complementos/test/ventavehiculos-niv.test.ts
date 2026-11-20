import { describe, it, expect, expectTypeOf } from 'vitest';
import { VentaVehiculos } from '../src/4.0/ventavehiculos/VentaVehiculos';
import type { XmlVentaVehiculosAttributes } from '../src/4.0/ventavehiculos/type/ventavehiculos.xslt';

// Los tipos se validan con `rushx test:types` (tsc); el runtime con vitest.
describe('VentaVehiculos (ventavehiculos11.xsd: Niv use="required")', () => {
  it('Niv es requerido en el tipo', () => {
    expectTypeOf<XmlVentaVehiculosAttributes['Niv']>().toEqualTypeOf<string>();
  });

  it('no permite construir sin Niv', () => {
    // @ts-expect-error Niv es requerido por el XSD
    new VentaVehiculos({ version: '1.1', ClaveVehicular: 'CV01' });
  });

  it('conserva Niv en los atributos', () => {
    const vv = new VentaVehiculos({ version: '1.1', ClaveVehicular: 'CV01', Niv: 'NIV001' });
    expect(vv.complemento._attributes.Niv).toBe('NIV001');
  });
});
