import { describe, it, expect } from 'vitest';
import path from 'path';
import {
  CFDI,
  Concepto,
  Emisor,
  Impuestos,
  ObjetoImpEnum,
  Receptor,
} from '../../src';
import {
  HidrocarburosPetroliferos,
  SubProductoHYP,
  TipoPermiso,
} from '@cfdi/complementos';
import { Transform as SaxonHe } from '@saxon-he/cli';
import {
  ExportacionEnum,
  FormaPago,
  Impuesto,
  MetodoPago,
  TipoComprobante,
  UsoCFDI,
} from '@cfdi/catalogos/src';

const files = path.resolve(__dirname, '..', '..', '..', '..', 'files');
const xslt_path = `${files}/4.0/cadenaoriginal.xslt`;
const vehiculo_usado = `${files}/xml/vehiculo_usado.xml`;

function hasSaxon(): boolean {
  try {
    new SaxonHe().s(vehiculo_usado).xsl(xslt_path).run();
    return true;
  } catch {
    return false;
  }
}

const saxonAvailable = hasSaxon();

const hidroAttributes = {
  Version: '1.0',
  TipoPermiso: TipoPermiso.PER07,
  NumeroPermiso: 'PL/1234/EXP/ES/2026',
  ClaveHYP: '15101505',
  SubProductoHYP: SubProductoHYP.SP22,
};

function buildCfdiWithHidroYPetro(saxon?: { binary: string }): CFDI {
  const cfdi = new CFDI({ xslt: { path: xslt_path }, saxon });

  cfdi.comprobante({
    FormaPago: FormaPago.EFECTIVO,
    Serie: 'HYP',
    Folio: '0001',
    Fecha: '2026-04-24T00:00:00',
    MetodoPago: MetodoPago.PAGO_EN_UNA_EXHIBICION,
    SubTotal: '1000.00',
    Moneda: 'MXN',
    Total: '1160.00',
    TipoDeComprobante: TipoComprobante.INGRESO,
    Exportacion: ExportacionEnum.NoAplica,
    LugarExpedicion: '45610',
  });

  cfdi.emisor(
    new Emisor({
      Rfc: 'EKU9003173C9',
      Nombre: 'ESTACION DE SERVICIO HYP',
      RegimenFiscal: '601',
    })
  );

  cfdi.receptor(
    new Receptor({
      Rfc: 'XAXX010101000',
      Nombre: 'CLIENTE PUBLICO EN GENERAL',
      DomicilioFiscalReceptor: '45610',
      RegimenFiscalReceptor: '616',
      UsoCFDI: UsoCFDI.SIN_EFECTOS_FISCALES,
    })
  );

  const concepto = new Concepto({
    ClaveProdServ: '15101505',
    Cantidad: '100.00',
    ClaveUnidad: 'LTR',
    Unidad: 'Litro',
    Descripcion: 'Gasolina mayor o igual a 92 octanos',
    ValorUnitario: '10.00',
    Importe: '1000.00',
    ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuesto,
  });

  concepto.traslado({
    Base: '1000.00',
    Importe: '160.00',
    Impuesto: Impuesto.IVA,
    TasaOCuota: '0.160000',
    TipoFactor: 'Tasa',
  });

  concepto.complemento(new HidrocarburosPetroliferos(hidroAttributes));

  cfdi.concepto(concepto);

  cfdi.impuesto(
    new Impuestos({
      TotalImpuestosTrasladados: '160.00',
    })
  );

  return cfdi;
}

describe('HidroYPetro | cadena original @cfdi/transform vs Saxon-HE', () => {
  it('transform incluye los 5 atributos HidroYPetro en la cadena original', () => {
    const cfdi = buildCfdiWithHidroYPetro();
    const cadena = cfdi.generarCadenaOriginal();

    expect(cadena).toBeTypeOf('string');
    expect(cadena.startsWith('||')).toBe(true);
    expect(cadena.endsWith('||')).toBe(true);

    const hidroSegment = [
      hidroAttributes.Version,
      hidroAttributes.TipoPermiso,
      hidroAttributes.NumeroPermiso,
      hidroAttributes.ClaveHYP,
      hidroAttributes.SubProductoHYP,
    ].join('|');

    expect(cadena).toContain(hidroSegment);
  });

  it.skipIf(!saxonAvailable)(
    'cadena original de Saxon-HE debe coincidir con @cfdi/transform',
    () => {
      const cfdiTransform = buildCfdiWithHidroYPetro();
      const cfdiSaxon = buildCfdiWithHidroYPetro({ binary: 'transform' });

      const cadenaTransform = cfdiTransform.generarCadenaOriginal();
      const cadenaSaxon = cfdiSaxon.generarCadenaOriginal();

      expect(cadenaSaxon).toBe(cadenaTransform);
    }
  );
});
