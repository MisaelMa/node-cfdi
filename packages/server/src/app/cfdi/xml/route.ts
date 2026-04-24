import { CFDI, Emisor, Receptor, Concepto, Impuestos } from '@cfdi/xml';

export async function GET(request: Request) {
  const cfdi = new CFDI();

  cfdi.comprobante({
    Serie: 'A',
    Folio: '1',
    Fecha: '2024-01-15T10:30:00',
    FormaPago: '01',
    MetodoPago: 'PUE',
    TipoDeComprobante: 'I',
    LugarExpedicion: '64000',
    Moneda: 'MXN',
    Exportacion: '01',
    SubTotal: '1000.00',
    Total: '1160.00',
  });

  cfdi.emisor(
    new Emisor({
      Rfc: 'AAA010101AAA',
      Nombre: 'Empresa SA de CV',
      RegimenFiscal: '601',
    })
  );

  cfdi.receptor(
    new Receptor({
      Rfc: 'BBB020202BB1',
      Nombre: 'Cliente SA de CV',
      UsoCFDI: 'G03',
      DomicilioFiscalReceptor: '64000',
      RegimenFiscalReceptor: '601',
    })
  );

  const concepto = new Concepto({
    ClaveProdServ: '01010101',
    Cantidad: '1',
    ClaveUnidad: 'E48',
    Descripcion: 'Servicio de consultoria',
    ValorUnitario: '1000.00',
    Importe: '1000.00',
    ObjetoImp: '02',
  });
  concepto.setTraslado({
    Base: '1000.00',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '160.00',
  });
  cfdi.concepto(concepto);

  const impuestos = new Impuestos({
    TotalImpuestosTrasladados: '160.00',
  });
  impuestos.traslados({
    Base: '1000.00',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '160.00',
  });
  cfdi.impuesto(impuestos);

  const xml = cfdi.getXmlCdfi();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': 'inline; filename="ejemplo.xml"',
    },
  });
}
