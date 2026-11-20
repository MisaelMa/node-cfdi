import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateCadenaOriginal, parseXslt } from '../src';

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

describe('xsl:include remoto', () => {
  const writeXslt = (include: string) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfdi-transform-'));
    const file = path.join(dir, 'main.xslt');
    fs.writeFileSync(
      file,
      `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:include href="${include}"/>
</xsl:stylesheet>`
    );
    return file;
  };

  it.each([
    'http://www.sat.gob.mx/sitio_internet/cfd/nomina/nomina12.xslt',
    'https://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xslt',
  ])('lanza un error explicito para el include remoto %s', href => {
    const file = writeXslt(href);

    expect(() => parseXslt(file)).toThrow(
      `include remoto no soportado: ${href}; usa el XSLT localizado`
    );
  });

  it('sigue resolviendo includes relativos', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfdi-transform-'));
    fs.writeFileSync(
      path.join(dir, 'hijo.xslt'),
      `<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="a:B"/>
</xsl:stylesheet>`
    );
    const main = path.join(dir, 'main.xslt');
    fs.writeFileSync(
      main,
      `<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:include href="./hijo.xslt"/>
</xsl:stylesheet>`
    );

    expect(parseXslt(main).templates.has('a:B')).toBe(true);
  });
});

describe('xsl:if con call-template de atributos', () => {
  const xslt = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ventavehiculos="http://www.sat.gob.mx/ventavehiculos">
  <xsl:template match="ventavehiculos:VentaVehiculos">
    <xsl:call-template name="Requerido">
      <xsl:with-param name="valor" select="./@version"/>
    </xsl:call-template>
    <xsl:call-template name="Requerido">
      <xsl:with-param name="valor" select="./@ClaveVehicular"/>
    </xsl:call-template>
    <xsl:if test="./@version='1.1'">
      <xsl:call-template name="Requerido">
        <xsl:with-param name="valor" select="./@Niv"/>
      </xsl:call-template>
    </xsl:if>
    <xsl:call-template name="Opcional">
      <xsl:with-param name="valor" select="./@Final"/>
    </xsl:call-template>
  </xsl:template>
</xsl:stylesheet>`;

  const cadena = (version: string) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfdi-transform-'));
    const file = path.join(dir, 'ventavehiculos.xslt');
    fs.writeFileSync(file, xslt);
    const xml = `<ventavehiculos:VentaVehiculos xmlns:ventavehiculos="http://www.sat.gob.mx/ventavehiculos" version="${version}" ClaveVehicular="CV" Niv="NIV123" Final="F"/>`;
    return generateCadenaOriginal(xml, parseXslt(file));
  };

  it('no emite el atributo condicionado cuando el test del if es falso', () => {
    expect(cadena('1.0')).toBe('||1.0|CV|F||');
  });

  it('emite el atributo condicionado cuando el test del if es verdadero', () => {
    expect(cadena('1.1')).toBe('||1.1|CV|NIV123|F||');
  });
});
