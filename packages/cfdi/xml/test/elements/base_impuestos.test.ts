import { describe, it, expect, vi } from 'vitest';
import { BaseImpuestos } from '../../src/elements/BaseImpuestos';
import {
  XmlImpuestosTrasladados,
  XmlTranRentAttributesProperties,
  XmlRetencionAttributes,
  XmlTransladoAttributes,
} from '../../src/types';
import { Schema } from '@cfdi/xsd';
import { stringObjToNumerico } from '../../src/utils/number.utils';

/* vi.mock('@cfdi/xsd', () => ({
  Schema: {
    of: () => ({
      cfdi: {
        impuestos: {
          validate: vi.fn(),
        },
      },
    }),
  },
})); */

vi.mock('../utils/number.utils', () => ({
  stringObjToNumerico: vi.fn((obj) => obj),
}));

describe('BaseImpuestos', () => {
  it('debería crear una instancia de BaseImpuestos con los atributos dados', () => {
    const validateSpy = vi.spyOn(Schema.of().cfdi.impuestos, 'validate');

    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const baseImpuestos = new BaseImpuestos(totalImpuestos);
    expect(baseImpuestos.getTotalImpuestos()).toEqual({
        TotalImpuestosTrasladados: '100.00',
    });

    expect(validateSpy).toHaveBeenCalledWith({
        TotalImpuestosTrasladados: '100.00',
      });
  
      validateSpy.mockRestore();
  
  });

  it('debería agregar un traslado', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const baseImpuestos = new BaseImpuestos(totalImpuestos);
    const trasladoPayload: XmlTranRentAttributesProperties & { Base: string | number } = {
      Base: '1000',
      Impuesto: '002',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: '160.00',
    };
    baseImpuestos.setTraslado(trasladoPayload);
    expect(baseImpuestos.getTraslados()).toContainEqual({
      _attributes: trasladoPayload,
    });
  });

  it('debería agregar una retención', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const baseImpuestos = new BaseImpuestos(totalImpuestos);
    const retencionPayload: Omit<XmlTranRentAttributesProperties, 'Base' | 'TipoFactor' | 'TasaOCuota'> = {
      Impuesto: '001',
      Importe: '50.00',
    };
    baseImpuestos.setRetencion(retencionPayload);
    expect(baseImpuestos.getRetenciones()).toContainEqual({
      _attributes: retencionPayload,
    });
  });

  it('debería retornar los impuestos totales', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const baseImpuestos = new BaseImpuestos(totalImpuestos);
    expect(baseImpuestos.getTotalImpuestos()).toEqual({
        TotalImpuestosTrasladados: '100.00'
    });
  });

  it('debería retornar las retenciones', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const baseImpuestos = new BaseImpuestos(totalImpuestos);
    const retencionPayload: Omit<XmlTranRentAttributesProperties, 'Base' | 'TipoFactor' | 'TasaOCuota'> = {
      Impuesto: '001',
      Importe: '50.00',
    };
    baseImpuestos.setRetencion(retencionPayload);
    expect(baseImpuestos.getRetenciones()).toContainEqual({
      _attributes: retencionPayload,
    });
  });

  it('debería retornar los traslados', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const baseImpuestos = new BaseImpuestos(totalImpuestos);
    const trasladoPayload: XmlTranRentAttributesProperties & { Base: string | number } = {
      Base: '1000',
      Impuesto: '002',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: '160.00',
    };
    baseImpuestos.setTraslado(trasladoPayload);
    expect(baseImpuestos.getTraslados()).toContainEqual({
      _attributes: trasladoPayload,
    });
  });

  // Los getters se consultaban SIEMPRE después de un setter, así que el estado
  // inicial nunca se ejercitó: `cfdi:Traslados` / `cfdi:Retenciones` solo se
  // crean dentro de `setTraslado` / `setRetencion`, y leerlos antes tiraba
  // `TypeError: Cannot read properties of undefined`. Un concepto sin impuestos
  // (exento, u ObjetoImp '01') es un caso válido del CFDI 4.0.
  describe('sin impuestos declarados', () => {
    it('getTraslados() devuelve [] en vez de reventar', () => {
      expect(new BaseImpuestos().getTraslados()).toEqual([]);
    });

    it('getRetenciones() devuelve [] en vez de reventar', () => {
      expect(new BaseImpuestos().getRetenciones()).toEqual([]);
    });

    it('getTotalImpuestos() devuelve {} en vez de undefined', () => {
      // El tipo de retorno promete `XmlImpuestosTrasladados`; devolver
      // `undefined` era una mentira que el consumidor pagaba en runtime.
      expect(new BaseImpuestos().getTotalImpuestos()).toEqual({});
    });

    it('solo con traslados: las retenciones siguen vacías', () => {
      const impuestos = new BaseImpuestos();
      impuestos.setTraslado({
        Base: '1000',
        Impuesto: '002',
        TipoFactor: 'Tasa',
        TasaOCuota: '0.160000',
        Importe: '160.00',
      });
      expect(impuestos.getTraslados()).toHaveLength(1);
      expect(impuestos.getRetenciones()).toEqual([]);
    });

    it('solo con retenciones: los traslados siguen vacíos', () => {
      const impuestos = new BaseImpuestos();
      impuestos.setRetencion({ Impuesto: '001', Importe: '50.00' });
      expect(impuestos.getRetenciones()).toHaveLength(1);
      expect(impuestos.getTraslados()).toEqual([]);
    });
  });
});