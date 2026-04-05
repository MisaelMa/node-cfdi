import { describe, it, expect } from 'vitest';
import path from 'path';
import { Validador } from '../src/Validador';

const FILES_DIR = path.resolve(__dirname, '../../../files/xml/examples');

const BASE_XML_40 = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1160.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="160.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;

describe('Reglas de impuestos - suma de traslados', () => {
  const validador = new Validador();

  it('acepta cuando TotalImpuestosTrasladados coincide con la suma', () => {
    const result = validador.validate(BASE_XML_40);
    expect(result.errors.some(e => e.code === 'CFDI605')).toBe(false);
  });

  it('rechaza cuando TotalImpuestosTrasladados no coincide', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1360.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="360.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="1000.00" Importe="360.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI605')).toBe(true);
  });
});

describe('Reglas de impuestos - suma de retenciones', () => {
  const validador = new Validador();

  it('acepta cuando TotalImpuestosRetenidos coincide con la suma', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-08-01T12:00:00" LugarExpedicion="06600"
  SubTotal="25000.00" Total="26333.33" Moneda="MXN"
  Exportacion="01" MetodoPago="PPD" FormaPago="99" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="CACX7605101P8" Nombre="TEST" RegimenFiscal="612"/>
  <cfdi:Receptor Rfc="EKU9003173C9" Nombre="TEST" DomicilioFiscalReceptor="26015" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="80101500" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Honorarios" ValorUnitario="25000.00" Importe="25000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="25000.00" Importe="4000.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
        </cfdi:Traslados>
        <cfdi:Retenciones>
          <cfdi:Retencion Base="25000.00" Importe="2500.00" Impuesto="001" TasaOCuota="0.100000" TipoFactor="Tasa"/>
          <cfdi:Retencion Base="25000.00" Importe="166.67" Impuesto="002" TasaOCuota="0.006667" TipoFactor="Tasa"/>
        </cfdi:Retenciones>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="4000.00" TotalImpuestosRetenidos="2666.67">
    <cfdi:Retenciones>
      <cfdi:Retencion Importe="2500.00" Impuesto="001"/>
      <cfdi:Retencion Importe="166.67" Impuesto="002"/>
    </cfdi:Retenciones>
    <cfdi:Traslados>
      <cfdi:Traslado Base="25000.00" Importe="4000.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI606')).toBe(false);
    expect(result.errors.some(e => e.code === 'CFDI605')).toBe(false);
  });

  it('rechaza cuando TotalImpuestosRetenidos no coincide', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1060.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
        </cfdi:Traslados>
        <cfdi:Retenciones>
          <cfdi:Retencion Base="1000.00" Importe="100.00" Impuesto="001" TasaOCuota="0.100000" TipoFactor="Tasa"/>
        </cfdi:Retenciones>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="160.00" TotalImpuestosRetenidos="999.00">
    <cfdi:Retenciones>
      <cfdi:Retencion Importe="100.00" Impuesto="001"/>
    </cfdi:Retenciones>
    <cfdi:Traslados>
      <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI606')).toBe(true);
  });
});

describe('Reglas de impuestos - impuesto invalido', () => {
  const validador = new Validador();

  it('rechaza impuesto con codigo no valido', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1160.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="999" TasaOCuota="0.160000" TipoFactor="Tasa"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="160.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="999" TasaOCuota="0.160000" TipoFactor="Tasa"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI601')).toBe(true);
  });
});

describe('Reglas de impuestos - TipoFactor Exento', () => {
  const validador = new Validador();

  it('rechaza TasaOCuota cuando TipoFactor=Exento', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1000.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="86121700" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test exento" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1000.00" Impuesto="002" TipoFactor="Exento" TasaOCuota="0.160000"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos>
    <cfdi:Traslados>
      <cfdi:Traslado Base="1000.00" Impuesto="002" TipoFactor="Exento" TasaOCuota="0.160000"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI603')).toBe(true);
  });

  it('acepta traslado Exento sin TasaOCuota ni Importe', () => {
    const result = validador.validateFile(
      path.join(FILES_DIR, 'test-cfdi40/ingreso-exento.xml')
    );
    expect(result.errors.some(e => e.code === 'CFDI603')).toBe(false);
    expect(result.errors.some(e => e.code === 'CFDI604')).toBe(false);
  });
});

describe('Reglas de impuestos - TipoFactor invalido', () => {
  const validador = new Validador();

  it('rechaza TipoFactor desconocido', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1160.00" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Porcentaje"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="160.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="1000.00" Importe="160.00" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Porcentaje"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI602')).toBe(true);
  });
});

describe('Reglas de estructura - campos faltantes', () => {
  const validador = new Validador();

  it('rechaza CFDI 4.0 sin DomicilioFiscalReceptor', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="0" Total="0" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="0" Importe="0" ObjetoImp="01"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI404')).toBe(true);
  });

  it('rechaza CFDI 4.0 sin ObjetoImp en concepto', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="0" Total="0" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="0" Importe="0"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI508')).toBe(true);
  });

  it('rechaza CFDI con RFC del emisor invalido', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="0" Total="0" Moneda="MXN"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="INVALIDO" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="0" Importe="0" ObjetoImp="01"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI302')).toBe(true);
  });
});
