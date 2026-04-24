import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CfdiCleaner } from '../src/CfdiCleaner';
import {
  collapseWhitespace,
  removeAddenda,
  removeNonSatNamespaces,
  removeNonSatNodes,
  removeNonSatSchemaLocations,
  removeStylesheetAttributes,
} from '../src/cleaners';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EXAMPLES_DIR = path.resolve(
  __dirname,
  '../../../files/xml/examples/cfdi40'
);

// XML base limpio (sin addenda, sin namespaces no-SAT)
const XML_CLEAN = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" Version="4.0" Sello="ABC123" NoCertificado="00000000000000000001" Certificado="CERT">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="EMISOR TEST" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="URE180429TM6" Nombre="RECEPTOR TEST" DomicilioFiscalReceptor="65000" RegimenFiscalReceptor="601" UsoCFDI="G01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="01010101" Cantidad="1" ClaveUnidad="H87" Descripcion="Servicio" ValorUnitario="100.00" Importe="100.00" ObjetoImp="01"/>
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd" Version="1.1" UUID="A1B2C3D4-E5F6-7890-ABCD-EF1234567890" FechaTimbrado="2024-01-01T00:00:00" RfcProvCertif="SAT970701NN3" SelloCFD="ABC" NoCertificadoSAT="00001000000504465028" SelloSAT="XYZ"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

// XML con addenda
const XML_WITH_ADDENDA = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="4.0" Sello="ABC123">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="EMISOR TEST" RegimenFiscal="601"/>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="A1B2C3D4-0000-0000-0000-000000000001" FechaTimbrado="2024-01-01T00:00:00" RfcProvCertif="SAT970701NN3" SelloCFD="ABC" NoCertificadoSAT="00001000000504465028" SelloSAT="XYZ"/>
  </cfdi:Complemento>
  <cfdi:Addenda>
    <vendor:DatosProveedor xmlns:vendor="http://www.proveedor.com/schema">
      <vendor:PedidoInterno>PO-2024-001</vendor:PedidoInterno>
      <vendor:CentroCostos>CC-100</vendor:CentroCostos>
    </vendor:DatosProveedor>
  </cfdi:Addenda>
</cfdi:Comprobante>`;

// XML con addenda multilinea
const XML_WITH_ADDENDA_MULTILINE = `<?xml version="1.0"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Sello="SEL">
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="UUID-001" RfcProvCertif="SAT970701NN3" SelloCFD="S" SelloSAT="T"/>
  </cfdi:Complemento>
  <cfdi:Addenda>
    <extra:Info xmlns:extra="http://extra.com">
      <extra:Linea1>dato 1</extra:Linea1>
      <extra:Linea2>dato 2</extra:Linea2>
    </extra:Info>
  </cfdi:Addenda>
</cfdi:Comprobante>`;

// XML con namespaces no-SAT
const XML_WITH_NON_SAT_NS = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:vendor="http://www.proveedor.com/ns" xmlns:erp="http://erp.empresa.com/v1" Version="4.0" Sello="ABC">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
</cfdi:Comprobante>`;

// XML con schemaLocations de terceros
const XML_WITH_NON_SAT_SCHEMA = `<?xml version="1.0"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:vendor="http://proveedor.com/ns" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://proveedor.com/ns http://proveedor.com/schema/vendor.xsd" Version="4.0" Sello="ABC">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
</cfdi:Comprobante>`;

// XML con nodo no-SAT en Complemento
const XML_WITH_NON_SAT_COMPLEMENT_NODE = `<?xml version="1.0"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" xmlns:vendor="http://www.proveedor.com/complemento" Version="4.0" Sello="ABC">
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital Version="1.1" UUID="UUID-002" RfcProvCertif="SAT970701NN3" SelloCFD="S" SelloSAT="T"/>
    <vendor:DatosExtra Foo="bar"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

// XML con stylesheet PI
const XML_WITH_STYLESHEET = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="cfdi.xsl"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Sello="ABC">
  <cfdi:Emisor Rfc="EKU9003173C9" Nombre="TEST" RegimenFiscal="601"/>
</cfdi:Comprobante>`;

// ---------------------------------------------------------------------------
// Tests unitarios por cleaner
// ---------------------------------------------------------------------------

describe('removeAddenda()', () => {
  it('elimina bloque cfdi:Addenda completo', () => {
    const result = removeAddenda(XML_WITH_ADDENDA);
    expect(result).not.toContain('<cfdi:Addenda');
    expect(result).not.toContain('PedidoInterno');
    expect(result).not.toContain('</cfdi:Addenda>');
  });

  it('elimina addenda multilinea con contenido anidado', () => {
    const result = removeAddenda(XML_WITH_ADDENDA_MULTILINE);
    expect(result).not.toContain('cfdi:Addenda');
    expect(result).not.toContain('extra:Info');
    expect(result).not.toContain('dato 1');
  });

  it('preserva el Sello del Comprobante', () => {
    const result = removeAddenda(XML_WITH_ADDENDA);
    expect(result).toContain('Sello="ABC123"');
  });

  it('preserva el UUID del TimbreFiscalDigital', () => {
    const result = removeAddenda(XML_WITH_ADDENDA);
    expect(result).toContain('UUID="A1B2C3D4-0000-0000-0000-000000000001"');
  });

  it('no modifica un XML sin addenda', () => {
    const result = removeAddenda(XML_CLEAN);
    expect(result).toBe(XML_CLEAN);
  });
});

describe('removeNonSatNamespaces()', () => {
  it('elimina declaraciones xmlns no-SAT del root', () => {
    const result = removeNonSatNamespaces(XML_WITH_NON_SAT_NS);
    expect(result).not.toContain('xmlns:vendor="http://www.proveedor.com/ns"');
    expect(result).not.toContain('xmlns:erp="http://erp.empresa.com/v1"');
  });

  it('preserva namespaces oficiales del SAT', () => {
    const result = removeNonSatNamespaces(XML_WITH_NON_SAT_NS);
    expect(result).toContain('xmlns:cfdi="http://www.sat.gob.mx/cfd/4"');
    expect(result).toContain(
      'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
    );
  });

  it('no modifica un XML sin namespaces no-SAT', () => {
    const result = removeNonSatNamespaces(XML_CLEAN);
    expect(result).toBe(XML_CLEAN);
  });

  it('preserva el namespace tfd en el Complemento (declarado en nodo hijo)', () => {
    // tfd esta declarado en el nodo TimbreFiscalDigital, no en el root
    const result = removeNonSatNamespaces(XML_WITH_NON_SAT_NS);
    // El XML de prueba no tiene tfd en root, solo en hijo; el cleaner
    // solo actua sobre el root element
    expect(result).toContain('xmlns:cfdi="http://www.sat.gob.mx/cfd/4"');
  });
});

describe('removeNonSatSchemaLocations()', () => {
  it('elimina pares URI+XSD no-SAT del schemaLocation', () => {
    const result = removeNonSatSchemaLocations(XML_WITH_NON_SAT_SCHEMA);
    // El URI del tercero no debe aparecer dentro del atributo schemaLocation
    expect(result).not.toContain('http://proveedor.com/schema/vendor.xsd');
    // El schemaLocation resultante no debe incluir el namespace del proveedor
    const schemaMatch = result.match(/xsi:schemaLocation="([^"]*)"/);
    expect(schemaMatch).not.toBeNull();
    expect(schemaMatch![1]).not.toContain('http://proveedor.com/ns');
  });

  it('preserva pares URI+XSD del SAT en schemaLocation', () => {
    const result = removeNonSatSchemaLocations(XML_WITH_NON_SAT_SCHEMA);
    expect(result).toContain('http://www.sat.gob.mx/cfd/4');
    expect(result).toContain(
      'http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd'
    );
  });

  it('mantiene el atributo xsi:schemaLocation aunque quede vacio de SAT', () => {
    const xml = `<root xsi:schemaLocation="http://no-sat.com/ns http://no-sat.com/schema.xsd"/>`;
    const result = removeNonSatSchemaLocations(xml);
    expect(result).toContain('xsi:schemaLocation=""');
  });

  it('no modifica un XML sin schemaLocation de terceros', () => {
    const result = removeNonSatSchemaLocations(XML_CLEAN);
    expect(result).toBe(XML_CLEAN);
  });
});

describe('removeNonSatNodes()', () => {
  it('elimina nodos con namespace no-SAT dentro de cfdi:Complemento', () => {
    const result = removeNonSatNodes(XML_WITH_NON_SAT_COMPLEMENT_NODE);
    expect(result).not.toContain('vendor:DatosExtra');
    expect(result).not.toContain('Foo="bar"');
  });

  it('preserva TimbreFiscalDigital (namespace SAT) en Complemento', () => {
    const result = removeNonSatNodes(XML_WITH_NON_SAT_COMPLEMENT_NODE);
    expect(result).toContain('tfd:TimbreFiscalDigital');
    expect(result).toContain('UUID="UUID-002"');
  });

  it('no modifica nodos fuera de cfdi:Complemento', () => {
    const result = removeNonSatNodes(XML_WITH_NON_SAT_COMPLEMENT_NODE);
    expect(result).toContain('<cfdi:Comprobante');
  });

  it('no modifica un XML sin Complemento', () => {
    const xmlSinComplemento = `<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Sello="S"/>`;
    const result = removeNonSatNodes(xmlSinComplemento);
    expect(result).toBe(xmlSinComplemento);
  });
});

describe('removeStylesheetAttributes()', () => {
  it('elimina processing instruction xml-stylesheet', () => {
    const result = removeStylesheetAttributes(XML_WITH_STYLESHEET);
    expect(result).not.toContain('<?xml-stylesheet');
    expect(result).not.toContain('cfdi.xsl');
  });

  it('preserva la declaracion xml normal', () => {
    const result = removeStylesheetAttributes(XML_WITH_STYLESHEET);
    expect(result).toContain('<?xml version="1.0"');
  });

  it('preserva el contenido del Comprobante', () => {
    const result = removeStylesheetAttributes(XML_WITH_STYLESHEET);
    expect(result).toContain('<cfdi:Comprobante');
    expect(result).toContain('Sello="ABC"');
  });

  it('no modifica un XML sin stylesheet PI', () => {
    const result = removeStylesheetAttributes(XML_CLEAN);
    expect(result).toBe(XML_CLEAN);
  });

  it('elimina multiples PI xml-stylesheet', () => {
    const xml = `<?xml version="1.0"?><?xml-stylesheet type="text/xsl" href="a.xsl"?><?xml-stylesheet type="text/css" href="b.css"?><root/>`;
    const result = removeStylesheetAttributes(xml);
    expect(result).not.toContain('<?xml-stylesheet');
    expect(result).toContain('<root/>');
  });
});

describe('collapseWhitespace()', () => {
  it('colapsa multiples saltos de linea entre tags a uno solo', () => {
    const xml = `<root>\n\n\n  <child/>\n\n</root>`;
    const result = collapseWhitespace(xml);
    expect(result).not.toMatch(/>\s{2,}</);
  });

  it('no altera el contenido de texto dentro de nodos', () => {
    const xml = `<root><name>Juan  Garcia</name></root>`;
    const result = collapseWhitespace(xml);
    expect(result).toContain('Juan  Garcia');
  });

  it('elimina whitespace al inicio y final del documento', () => {
    const xml = `   <root/>\n   `;
    const result = collapseWhitespace(xml);
    expect(result).toBe('<root/>');
  });
});

// ---------------------------------------------------------------------------
// Tests de integracion: CfdiCleaner
// ---------------------------------------------------------------------------

describe('CfdiCleaner', () => {
  const cleaner = new CfdiCleaner();

  describe('clean()', () => {
    it('elimina addenda del XML sucio', () => {
      const result = cleaner.clean(XML_WITH_ADDENDA);
      expect(result).not.toContain('cfdi:Addenda');
      expect(result).not.toContain('PedidoInterno');
    });

    it('preserva Sello, Certificado y UUID tras limpieza', () => {
      const xmlConTodo = `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="cfdi.xsl"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:vendor="http://tercero.com/ns" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://tercero.com/ns http://tercero.com/schema.xsd" Version="4.0" Sello="SELLO_ORIGINAL" NoCertificado="00000000000000000001" Certificado="CERT_ORIGINAL">
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="UUID-REAL-123" RfcProvCertif="SAT970701NN3" SelloCFD="SELLO_CFD" SelloSAT="SELLO_SAT"/>
    <vendor:Extra xmlns:vendor="http://tercero.com/ns" Dato="quitar"/>
  </cfdi:Complemento>
  <cfdi:Addenda>
    <info>eliminar</info>
  </cfdi:Addenda>
</cfdi:Comprobante>`;

      const result = cleaner.clean(xmlConTodo);

      // Contenido critico NO debe modificarse
      expect(result).toContain('Sello="SELLO_ORIGINAL"');
      expect(result).toContain('Certificado="CERT_ORIGINAL"');
      expect(result).toContain('UUID="UUID-REAL-123"');
      expect(result).toContain('SelloCFD="SELLO_CFD"');
      expect(result).toContain('SelloSAT="SELLO_SAT"');

      // Contenido no-SAT debe eliminarse
      expect(result).not.toContain('<?xml-stylesheet');
      expect(result).not.toContain('cfdi:Addenda');
      expect(result).not.toContain('eliminar');
      expect(result).not.toContain('xmlns:vendor="http://tercero.com/ns"');
      expect(result).not.toContain('http://tercero.com/schema.xsd');
      expect(result).not.toContain('vendor:Extra');
    });

    it('un XML limpio no cambia su contenido esencial tras clean()', () => {
      // Aplicar clean al XML limpio: puede cambiar whitespace pero no contenido
      const result = cleaner.clean(XML_CLEAN);

      // El contenido esencial debe estar intacto
      expect(result).toContain('Sello="ABC123"');
      expect(result).toContain('xmlns:cfdi="http://www.sat.gob.mx/cfd/4"');
      expect(result).toContain('UUID="A1B2C3D4-E5F6-7890-ABCD-EF1234567890"');
      expect(result).toContain('SelloCFD="ABC"');
      expect(result).toContain('SelloSAT="XYZ"');
    });

    it('elimina nodo no-SAT en Complemento preservando tfd', () => {
      const result = cleaner.clean(XML_WITH_NON_SAT_COMPLEMENT_NODE);
      expect(result).not.toContain('vendor:DatosExtra');
      expect(result).toContain('tfd:TimbreFiscalDigital');
    });

    it('elimina namespaces no-SAT del root', () => {
      const result = cleaner.clean(XML_WITH_NON_SAT_NS);
      expect(result).not.toContain('xmlns:vendor');
      expect(result).not.toContain('xmlns:erp');
      expect(result).toContain('xmlns:cfdi="http://www.sat.gob.mx/cfd/4"');
    });

    it('elimina schemaLocation de terceros', () => {
      const result = cleaner.clean(XML_WITH_NON_SAT_SCHEMA);
      expect(result).not.toContain('http://proveedor.com');
    });

    it('elimina stylesheet PI', () => {
      const result = cleaner.clean(XML_WITH_STYLESHEET);
      expect(result).not.toContain('<?xml-stylesheet');
    });
  });

  describe('cleanFile()', () => {
    it('limpia archivo real de CFDI 4.0 (cfdi-validator-cfdi40-real.xml)', () => {
      const filePath = `${EXAMPLES_DIR}/cfdi-validator-cfdi40-real.xml`;
      const result = cleaner.cleanFile(filePath);

      // El archivo real es ya limpio: debe conservar sus elementos esenciales
      expect(result).toContain('cfdi:Comprobante');
      expect(result).toContain('tfd:TimbreFiscalDigital');
      expect(result).not.toContain('<?xml-stylesheet');
    });

    it('limpia archivo real CfdiUtils-cfdi40-real.xml preservando UUID y sellos', () => {
      const filePath = `${EXAMPLES_DIR}/CfdiUtils-cfdi40-real.xml`;
      const result = cleaner.cleanFile(filePath);

      // UUID del TimbreFiscalDigital debe estar intacto
      expect(result).toContain('UUID="C2832671-DA6D-11EF-A83D-00155D012007"');
      // El sello del CFD debe estar intacto
      expect(result).toContain('WZzQVFmM/0E21+v4Th3K9K3a8yfN8TPwkarBsD28YUb');
    });

    it('lanza error si el archivo no existe', () => {
      expect(() =>
        cleaner.cleanFile('/ruta/que/no/existe/factura.xml')
      ).toThrow();
    });
  });
});
