import { describe, it, expect } from 'vitest';
import { Validador } from '../src/Validador';

function buildXml(overrides: {
  subtotal?: string;
  total?: string;
  descuento?: string;
  moneda?: string;
  tipoCambio?: string;
  tipoCambioAttr?: string;
  totalTrasladados?: string;
  totalRetenidos?: string;
  tipoComprobante?: string;
  version?: string;
  emisorNombre?: string;
  receptorExtra?: string;
  impuestosAttr?: string;
  impuestosContent?: string;
  conceptoImporte?: string;
  conceptoValorUnitario?: string;
}): string {
  const {
    subtotal = '1000.00',
    total = '1160.00',
    descuento,
    moneda = 'MXN',
    tipoCambioAttr = '',
    totalTrasladados = '160.00',
    totalRetenidos,
    tipoComprobante = 'I',
    version = '4.0',
    emisorNombre = 'Nombre="TEST"',
    receptorExtra = 'DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601"',
    impuestosAttr,
    impuestosContent,
    conceptoImporte = '1000.00',
    conceptoValorUnitario = '1000.00',
  } = overrides;

  const impAttr =
    impuestosAttr ??
    [
      totalTrasladados ? `TotalImpuestosTrasladados="${totalTrasladados}"` : '',
      totalRetenidos ? `TotalImpuestosRetenidos="${totalRetenidos}"` : '',
    ]
      .filter(Boolean)
      .join(' ');

  const impContent =
    impuestosContent ??
    `<cfdi:Traslados>
      <cfdi:Traslado Base="${conceptoImporte}" Importe="${totalTrasladados ?? '160.00'}" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
    </cfdi:Traslados>`;

  const descAttr = descuento ? `Descuento="${descuento}"` : '';
  const ns =
    version === '4.0'
      ? 'http://www.sat.gob.mx/cfd/4'
      : 'http://www.sat.gob.mx/cfd/3';

  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="${ns}"
  Version="${version}" TipoDeComprobante="${tipoComprobante}"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="${subtotal}" Total="${total}" Moneda="${moneda}"
  ${descAttr} ${tipoCambioAttr}
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" ${emisorNombre} RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" ${receptorExtra} UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48"
      Descripcion="Test" ValorUnitario="${conceptoValorUnitario}"
      Importe="${conceptoImporte}" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="${conceptoImporte}" Importe="${totalTrasladados ?? '160.00'}" Impuesto="002" TasaOCuota="0.160000" TipoFactor="Tasa"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos ${impAttr}>
    ${impContent}
  </cfdi:Impuestos>
</cfdi:Comprobante>`;
}

describe('Reglas de montos - SubTotal', () => {
  const validador = new Validador();

  it('acepta SubTotal valido', () => {
    const result = validador.validate(buildXml({}));
    const subtotalErrors = result.errors.filter(e =>
      e.field?.includes('SubTotal')
    );
    expect(subtotalErrors).toHaveLength(0);
  });

  it('rechaza SubTotal negativo', () => {
    const xml = buildXml({ subtotal: '-100.00', total: '-100.00' });
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI203')).toBe(true);
  });
});

describe('Reglas de montos - Total', () => {
  const validador = new Validador();

  it('rechaza Total negativo', () => {
    const xml = buildXml({ total: '-500.00' });
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI205')).toBe(true);
  });

  it('rechaza cuando Total no coincide con la formula', () => {
    // SubTotal=1000, impuestos=160, total deberia ser 1160 pero ponemos 1000
    const xml = buildXml({ total: '1000.00' });
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI208')).toBe(true);
  });

  it('acepta Total con tolerancia de 1 centavo', () => {
    // Total correcto = 1000 + 160 = 1160, toleramos hasta 0.01
    const xml = buildXml({ total: '1160.005' });
    const result = validador.validate(xml);
    const totalErrors = result.errors.filter(e => e.code === 'CFDI208');
    expect(totalErrors).toHaveLength(0);
  });
});

describe('Reglas de montos - Descuento', () => {
  const validador = new Validador();

  it('acepta descuento menor al subtotal', () => {
    // SubTotal=1000, Descuento=100, Impuestos=144 (16% de 900), Total=1044
    const xml = buildXml({
      subtotal: '1000.00',
      total: '1044.00',
      descuento: '100.00',
      conceptoImporte: '1000.00',
      totalTrasladados: '144.00',
    });
    const result = validador.validate(xml);
    const descErrors = result.errors.filter(e => e.code === 'CFDI207');
    expect(descErrors).toHaveLength(0);
  });

  it('rechaza descuento mayor al subtotal', () => {
    const xml = buildXml({
      subtotal: '100.00',
      total: '116.00',
      descuento: '200.00',
    });
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI207')).toBe(true);
  });
});

describe('Reglas de montos - Moneda y TipoCambio', () => {
  const validador = new Validador();

  it('rechaza TipoCambio cuando Moneda=XXX', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="T"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="0" Total="0" Moneda="XXX" TipoCambio="17.00"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="S01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="0" Importe="0" ObjetoImp="01"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI006')).toBe(true);
  });

  it('requiere TipoCambio cuando Moneda es distinta de MXN y XXX', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="I"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="1000.00" Total="1160.00" Moneda="USD"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="1000.00" Importe="1000.00" ObjetoImp="02">
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
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI007')).toBe(true);
  });

  it('acepta Moneda=MXN sin TipoCambio', () => {
    const result = validador.validate(buildXml({}));
    expect(result.errors.some(e => e.code === 'CFDI006')).toBe(false);
    expect(result.errors.some(e => e.code === 'CFDI007')).toBe(false);
  });
});

describe('Reglas de montos - TipoDeComprobante Traslado', () => {
  const validador = new Validador();

  it('rechaza SubTotal != 0 en comprobante Traslado', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0" TipoDeComprobante="T"
  Fecha="2024-01-01T00:00:00" LugarExpedicion="06600"
  SubTotal="500.00" Total="0" Moneda="XXX"
  Exportacion="01" NoCertificado="" Sello="" Certificado="">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="TEST" DomicilioFiscalReceptor="06600" RegimenFiscalReceptor="601" UsoCFDI="S01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="E48" Descripcion="Test" ValorUnitario="0" Importe="0" ObjetoImp="01"/>
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
    const result = validador.validate(xml);
    expect(result.errors.some(e => e.code === 'CFDI004')).toBe(true);
  });
});
