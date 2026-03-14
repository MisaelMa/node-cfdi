import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { SatResources } from '../src';

// Los tests de integracion que descargan del SAT requieren conexion a internet.
// Se ejecutan en CI solo si la variable INTEGRATION_TESTS=1 esta presente,
// o siempre en desarrollo local cuando se corre este archivo directamente.
const INTEGRATION =
  process.env.INTEGRATION_TESTS === '1' ||
  process.env.NODE_ENV !== 'test' ||
  process.env.VITEST_RUN_INTEGRATION === '1';

describe('@cfdi/sat - SatResources', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfdi-sat-test-'));
  });

  afterAll(() => {
    // Limpiar directorio temporal despues de los tests
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('SatResources se instancia correctamente con opciones validas', () => {
    const sat = new SatResources({
      version: '4.0',
      outputDir: tmpDir,
    });

    expect(sat).toBeInstanceOf(SatResources);
  });

  it('SatResources se instancia correctamente con version 3.3', () => {
    const sat = new SatResources({
      version: '3.3',
      outputDir: tmpDir,
    });

    expect(sat).toBeInstanceOf(SatResources);
  });

  describe.skipIf(!INTEGRATION)(
    'descarga de recursos SAT (requiere internet)',
    () => {
      let outputDir: string;

      beforeAll(() => {
        outputDir = path.join(tmpDir, 'resources-4.0');
        fs.mkdirSync(outputDir, { recursive: true });
      });

      it('descarga los recursos CFDI 4.0 del SAT', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();

        // Verifica que los archivos principales existen
        expect(fs.existsSync(result.schema)).toBe(true);
        expect(fs.existsSync(result.xslt)).toBe(true);
      }, 120_000);

      it('el XSD descargado es un schema valido', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const schemaContent = fs.readFileSync(result.schema, 'utf-8');

        // Debe ser XML valido con declaracion de schema
        expect(schemaContent).toContain('<xs:schema');
        expect(schemaContent).toContain('cfdi');
      }, 120_000);

      it('el XSLT descargado tiene hrefs locales (no URLs remotas)', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const xsltContent = fs.readFileSync(result.xslt, 'utf-8');

        // No debe contener URLs http en xsl:include
        const includeMatches = xsltContent.match(
          /<xsl:include[^>]*href=["']([^"']+)["'][^>]*\/?>/gi
        );

        if (includeMatches) {
          for (const include of includeMatches) {
            expect(include).not.toMatch(/href=["']https?:\/\//);
            expect(include).toMatch(/href=["']\.\/complementos\//);
          }
        }
      }, 120_000);

      it('el XSLT tiene declaracion XML al inicio', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const xsltContent = fs.readFileSync(result.xslt, 'utf-8');

        expect(xsltContent.trimStart()).toMatch(/^<\?xml/);
      }, 120_000);

      it('los complementos se descargaron en la carpeta complementos/', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const complementosDir = path.join(outputDir, 'complementos');

        // Debe existir la carpeta de complementos
        expect(fs.existsSync(complementosDir)).toBe(true);

        // Debe haber al menos un complemento descargado
        expect(result.complementos.length).toBeGreaterThan(0);

        // Cada complemento debe existir como archivo
        for (const complementoPath of result.complementos) {
          expect(fs.existsSync(complementoPath)).toBe(true);
        }
      }, 120_000);

      it('los complementos descargados son XSLTs validos', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();

        for (const complementoPath of result.complementos) {
          const content = fs.readFileSync(complementoPath, 'utf-8');
          // Cada complemento debe ser XML que contenga stylesheet o transform
          expect(content).toMatch(/<xsl:stylesheet|<xsl:transform/);
        }
      }, 120_000);

      it('los complementos se guardan flat sin subdirectorios', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const complementosDir = path.join(outputDir, 'complementos');

        for (const complementoPath of result.complementos) {
          // El directorio padre de cada complemento debe ser complementosDir
          expect(path.dirname(complementoPath)).toBe(complementosDir);
        }
      }, 120_000);

      it('el XSLT del SAT incluye complemento de utilerias', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const xsltContent = fs.readFileSync(result.xslt, 'utf-8');

        // utilerias.xslt es un complemento conocido del SAT CFDI 4.0
        expect(xsltContent).toContain('utilerias.xslt');
      }, 120_000);

      it('extrae archivos opcionales de catalogos del schema', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();

        // Si el schema contiene xs:import de catCFDI o tdCFDI, deben descargarse
        // Pueden ser null si el schema no los incluye
        if (result.catalogSchema !== null) {
          expect(fs.existsSync(result.catalogSchema)).toBe(true);
          const content = fs.readFileSync(result.catalogSchema, 'utf-8');
          expect(content).toContain('<xs:schema');
        }

        if (result.tipoDatosSchema !== null) {
          expect(fs.existsSync(result.tipoDatosSchema)).toBe(true);
          const content = fs.readFileSync(result.tipoDatosSchema, 'utf-8');
          expect(content).toContain('<xs:schema');
        }
      }, 120_000);

      it('el XSLT no contiene texto basura al inicio', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        const result = await sat.download();
        const xsltContent = fs.readFileSync(result.xslt, 'utf-8');

        // No debe contener el texto de error del SAT
        expect(xsltContent).not.toContain(
          'This XML file does not appear to have any style information'
        );
        expect(xsltContent).not.toContain('The document tree is shown below');
      }, 120_000);

      it('crea la estructura de directorios correcta', async () => {
        const sat = new SatResources({
          version: '4.0',
          outputDir,
        });

        await sat.download();

        // Estructura esperada
        expect(fs.existsSync(outputDir)).toBe(true);
        expect(
          fs.existsSync(path.join(outputDir, 'complementos'))
        ).toBe(true);
        expect(
          fs.existsSync(path.join(outputDir, 'cadenaoriginal.xslt'))
        ).toBe(true);
        expect(
          fs.existsSync(path.join(outputDir, 'cfdv40.xsd'))
        ).toBe(true);
      }, 120_000);

      it('descarga correctamente los recursos CFDI 3.3', async () => {
        const dir33 = path.join(tmpDir, 'resources-3.3');
        fs.mkdirSync(dir33, { recursive: true });

        const sat = new SatResources({
          version: '3.3',
          outputDir: dir33,
        });

        const result = await sat.download();

        expect(fs.existsSync(result.schema)).toBe(true);
        expect(fs.existsSync(result.xslt)).toBe(true);

        const schemaContent = fs.readFileSync(result.schema, 'utf-8');
        expect(schemaContent).toContain('<xs:schema');
      }, 120_000);
    }
  );
});
