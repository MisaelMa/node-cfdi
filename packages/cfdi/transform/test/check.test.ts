import { describe, expect, it } from 'vitest';
import { Transform as SaxonHe } from '@saxon-he/cli';
import { Transform } from '../src';
import path from 'path';
import fs from 'fs';

const files = path.resolve(__dirname, '..', '..', '..', 'files');
const xml_path = `${files}/xml`;
const xslt_40 = `${files}/4.0/cadenaoriginal.xslt`;
const xslt_33 = `${files}/3.3/cadenaoriginal-3.3.xslt`;

const vehiculo_usado = `${xml_path}/vehiculo_usado.xml`;

function hasSaxon(): boolean {
  try {
    const saxon = new SaxonHe();
    saxon.s(vehiculo_usado).xsl(xslt_40).run();
    return true;
  } catch {
    return false;
  }
}

const saxonAvailable = hasSaxon();

describe('transform', () => {
  it('should generate cadena original from vehiculo_usado.xml', () => {
    const transform = new Transform();
    const cadena = transform.s(vehiculo_usado).xsl(xslt_40).run();
    expect(cadena).toBeTypeOf('string');
    expect(cadena.startsWith('||')).toBe(true);
    expect(cadena.endsWith('||')).toBe(true);
  });

  it('should throw if xsl not loaded', () => {
    const transform = new Transform();
    expect(() => transform.s(vehiculo_usado).run()).toThrow('XSLT not loaded');
  });
});

describe('transform vs saxon-he (xml/)', () => {
  const xmlFiles = fs.readdirSync(xml_path).filter((f: string) => f.endsWith('.xml'));

  for (const xmlFile of xmlFiles) {
    const xmlFilePath = `${xml_path}/${xmlFile}`;

    it.skipIf(!saxonAvailable)(`${xmlFile}: output must match Saxon-HE (4.0)`, () => {
      let cadenaSaxon: string;
      try {
        const saxon = new SaxonHe();
        cadenaSaxon = saxon.s(xmlFilePath).xsl(xslt_40).run();
      } catch {
        return;
      }

      const transform = new Transform();
      const cadenaTransform = transform.s(xmlFilePath).xsl(xslt_40).run();

      expect(cadenaTransform).toBe(cadenaSaxon);
    });
  }
});

const examplesPath = `${xml_path}/examples`;

function getExampleFiles(subdir: string): string[] {
  const dirPath = `${examplesPath}/${subdir}`;
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((f: string) => f.endsWith('.xml'));
}

function compareSaxonVsTransform(xmlFilePath: string, xsltPath: string) {
  let cadenaSaxon: string;
  try {
    const saxon = new SaxonHe();
    cadenaSaxon = saxon.s(xmlFilePath).xsl(xsltPath).run();
  } catch {
    return;
  }

  const transform = new Transform();
  const cadenaTransform = transform.s(xmlFilePath).xsl(xsltPath).run();

  console.log(`
    Saxon: ${cadenaSaxon}
    Transform: ${cadenaTransform}
    Difference: ${cadenaTransform !== cadenaSaxon}
    `);
  expect(cadenaTransform).toBe(cadenaSaxon);
}

describe('transform vs saxon-he (examples cfdi40 con xslt 4.0)', () => {
  const cfdi40Files = getExampleFiles('cfdi40');

  for (const xmlFile of cfdi40Files) {
    const xmlFilePath = `${examplesPath}/cfdi40/${xmlFile}`;

    it.skipIf(!saxonAvailable)(`${xmlFile}: output must match Saxon-HE`, () => {
      compareSaxonVsTransform(xmlFilePath, xslt_40);
    });
  }
});

describe('transform vs saxon-he (examples cfdi33 con xslt 3.3)', () => {
  const cfdi33Files = getExampleFiles('cfdi33');

  for (const xmlFile of cfdi33Files) {
    const xmlFilePath = `${examplesPath}/cfdi33/${xmlFile}`;

    it.skipIf(!saxonAvailable)(`${xmlFile}: output must match Saxon-HE`, () => {
      compareSaxonVsTransform(xmlFilePath, xslt_33);
    });
  }
});

describe('transform vs saxon-he (test-cfdi40 con xslt 4.0)', () => {
  const testFiles = getExampleFiles('test-cfdi40');

  for (const xmlFile of testFiles) {
    const xmlFilePath = `${examplesPath}/test-cfdi40/${xmlFile}`;

    it.skipIf(!saxonAvailable)(`${xmlFile}: output must match Saxon-HE`, () => {
      compareSaxonVsTransform(xmlFilePath, xslt_40);
    });

    it(`${xmlFile}: cadena original should be valid`, () => {
      const transform = new Transform();
      const cadena = transform.s(xmlFilePath).xsl(xslt_40).run();

      expect(cadena).toBeTypeOf('string');
      expect(cadena.startsWith('||')).toBe(true);
      expect(cadena.endsWith('||')).toBe(true);
      expect(cadena.length).toBeGreaterThan(4);
    });
  }
});

describe('transform vs saxon-he (test-cfdi33 con xslt 3.3)', () => {
  const testFiles = getExampleFiles('test-cfdi33');

  for (const xmlFile of testFiles) {
    const xmlFilePath = `${examplesPath}/test-cfdi33/${xmlFile}`;

    it.skipIf(!saxonAvailable)(`${xmlFile}: output must match Saxon-HE`, () => {
      compareSaxonVsTransform(xmlFilePath, xslt_33);
    });

    it(`${xmlFile}: cadena original should be valid`, () => {
      const transform = new Transform();
      const cadena = transform.s(xmlFilePath).xsl(xslt_33).run();

      expect(cadena).toBeTypeOf('string');
      expect(cadena.startsWith('||')).toBe(true);
      expect(cadena.endsWith('||')).toBe(true);
      expect(cadena.length).toBeGreaterThan(4);
    });
  }
});
