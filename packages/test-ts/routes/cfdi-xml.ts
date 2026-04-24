import { Router } from 'express';
import path from 'node:path';
import { CFDI, Emisor, Receptor, Concepto, Impuestos } from '@cfdi/xml';
import {
  FormaPago,
  MetodoPago,
  TipoComprobante,
  UsoCFDI,
  RegimenFiscal,
} from '@cfdi/catalogos';
import { FILES_DIR } from '../config';

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const {
      serie = 'A',
      folio = '1',
      emisor: emisorData,
      receptor: receptorData,
      conceptos = [],
    } = req.body;

    const cfdi = new CFDI();

    cfdi.setAttributes();

    const subtotal = conceptos.reduce(
      (sum: number, c: any) => sum + Number(c.importe || 0),
      0
    );
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    cfdi.comprobante({
      Serie: serie,
      Folio: folio,
      Fecha: new Date().toISOString().slice(0, 19),
      SubTotal: subtotal.toFixed(2),
      Moneda: 'MXN',
      Total: total.toFixed(2),
      TipoDeComprobante: TipoComprobante.INGRESO,
      MetodoPago: MetodoPago.PUE,
      LugarExpedicion: emisorData?.cp || '77728',
      FormaPago: FormaPago['03'],
      Exportacion: '01',
    });

    cfdi.emisor(
      new Emisor({
        Rfc: emisorData?.rfc || 'LAN7008173R5',
        Nombre: emisorData?.nombre || 'EMPRESA DE PRUEBA SA DE CV',
        RegimenFiscal: emisorData?.regimen || '601',
      })
    );

    cfdi.receptor(
      new Receptor({
        Rfc: receptorData?.rfc || 'XAXX010101000',
        Nombre: receptorData?.nombre || 'PUBLICO EN GENERAL',
        UsoCFDI: receptorData?.usoCfdi || 'G03',
        DomicilioFiscalReceptor: receptorData?.cp || '77728',
        RegimenFiscalReceptor: receptorData?.regimen || '616',
      })
    );

    for (const c of conceptos) {
      cfdi.concepto(
        new Concepto({
          ClaveProdServ: c.claveProdServ || '01010101',
          Cantidad: c.cantidad || '1',
          ClaveUnidad: c.claveUnidad || 'E48',
          Unidad: c.unidad || 'Pieza',
          Descripcion: c.descripcion || 'Producto de prueba',
          ValorUnitario: c.valorUnitario || c.importe || '0',
          Importe: c.importe || '0',
          ObjetoImp: c.objetoImp || '02',
        })
      );
    }

    cfdi.impuesto(
      new Impuestos().traslados({
        Base: subtotal.toFixed(2),
        Impuesto: '002',
        TipoFactor: 'Tasa',
        TasaOCuota: '0.160000',
        Importe: iva.toFixed(2),
      })
    );

    const certPath = path.join(FILES_DIR, 'certificados/LAN7008173R5.cer');
    const keyPath = path.join(FILES_DIR, 'certificados/LAN7008173R5.key');

    cfdi.certificar(certPath);
    await cfdi.sellar(keyPath, '12345678a');

    const xml = cfdi.getXmlCdfi();
    const json = cfdi.getJsonCdfi();

    res.json({ xml, json });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.post('/create-xml', async (req, res) => {
  try {
    const body = req.body;

    const cfdi = new CFDI();
    cfdi.setAttributes();

    const subtotal = (body.conceptos || []).reduce(
      (sum: number, c: any) => sum + Number(c.importe || 0),
      0
    );
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    cfdi.comprobante({
      Serie: body.serie || 'A',
      Folio: body.folio || '1',
      Fecha: new Date().toISOString().slice(0, 19),
      SubTotal: subtotal.toFixed(2),
      Moneda: 'MXN',
      Total: total.toFixed(2),
      TipoDeComprobante: TipoComprobante.INGRESO,
      MetodoPago: MetodoPago.PUE,
      LugarExpedicion: body.lugarExpedicion || '77728',
      FormaPago: body.formaPago || FormaPago['03'],
      Exportacion: '01',
    });

    cfdi.emisor(
      new Emisor({
        Rfc: body.emisor?.rfc || 'LAN7008173R5',
        Nombre: body.emisor?.nombre || 'EMPRESA DE PRUEBA SA DE CV',
        RegimenFiscal: body.emisor?.regimen || '601',
      })
    );

    cfdi.receptor(
      new Receptor({
        Rfc: body.receptor?.rfc || 'XAXX010101000',
        Nombre: body.receptor?.nombre || 'PUBLICO EN GENERAL',
        UsoCFDI: body.receptor?.usoCfdi || 'G03',
        DomicilioFiscalReceptor: body.receptor?.cp || '77728',
        RegimenFiscalReceptor: body.receptor?.regimen || '616',
      })
    );

    for (const c of body.conceptos || []) {
      cfdi.concepto(
        new Concepto({
          ClaveProdServ: c.claveProdServ || '01010101',
          Cantidad: c.cantidad || '1',
          ClaveUnidad: c.claveUnidad || 'E48',
          Unidad: c.unidad || 'Pieza',
          Descripcion: c.descripcion || 'Producto',
          ValorUnitario: c.valorUnitario || c.importe || '0',
          Importe: c.importe || '0',
          ObjetoImp: c.objetoImp || '02',
        })
      );
    }

    cfdi.impuesto(
      new Impuestos().traslados({
        Base: subtotal.toFixed(2),
        Impuesto: '002',
        TipoFactor: 'Tasa',
        TasaOCuota: '0.160000',
        Importe: iva.toFixed(2),
      })
    );

    const certPath = path.join(FILES_DIR, 'certificados/LAN7008173R5.cer');
    const keyPath = path.join(FILES_DIR, 'certificados/LAN7008173R5.key');

    cfdi.certificar(certPath);
    await cfdi.sellar(keyPath, '12345678a');

    res.set('Content-Type', 'application/xml');
    res.send(cfdi.getXmlCdfi());
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
