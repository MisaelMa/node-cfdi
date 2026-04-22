import { describe, it, expect } from 'vitest';
import { buildBalanzaXml } from '../src/xml/balanza';
import { buildCatalogoXml } from '../src/xml/catalogo';
import { buildPolizasXml } from '../src/xml/polizas';
import { buildAuxiliarXml } from '../src/xml/auxiliar';
import {
  TipoEnvio,
  NaturalezaCuenta,
  VersionContabilidad,
} from '../src/types';

const INFO = {
  rfc: 'AAA010101AAA',
  mes: '01',
  anio: 2024,
  tipoEnvio: TipoEnvio.Normal,
};

describe('buildBalanzaXml', () => {
  it('genera XML con el namespace y version correctos', () => {
    const xml = buildBalanzaXml(INFO, [
      { numCta: '100', saldoIni: 1000, debe: 500, haber: 200, saldoFin: 1300 },
    ]);
    expect(xml).toContain('BCE:Balanza');
    expect(xml).toContain('ContabilidadE/1_3/BalanzaComprobacion');
    expect(xml).toContain('Version="1.3"');
  });

  it('incluye los datos del contribuyente', () => {
    const xml = buildBalanzaXml(INFO, []);
    expect(xml).toContain('RFC="AAA010101AAA"');
    expect(xml).toContain('Mes="01"');
    expect(xml).toContain('Anio="2024"');
    expect(xml).toContain('TipoEnvio="N"');
  });

  it('incluye las cuentas con saldos formateados', () => {
    const xml = buildBalanzaXml(INFO, [
      { numCta: '100', saldoIni: 1000.5, debe: 500, haber: 200, saldoFin: 1300.5 },
    ]);
    expect(xml).toContain('NumCta="100"');
    expect(xml).toContain('SaldoIni="1000.50"');
    expect(xml).toContain('Debe="500.00"');
    expect(xml).toContain('SaldoFin="1300.50"');
  });

  it('soporta version 1.1', () => {
    const xml = buildBalanzaXml(INFO, [], VersionContabilidad.V1_1);
    expect(xml).toContain('Version="1.1"');
    expect(xml).toContain('ContabilidadE/1_1/BalanzaComprobacion');
  });
});

describe('buildCatalogoXml', () => {
  it('genera XML con el namespace correcto', () => {
    const xml = buildCatalogoXml(INFO, [
      {
        codAgrup: '100',
        numCta: '1000',
        desc: 'Activo',
        nivel: 1,
        natur: NaturalezaCuenta.Deudora,
      },
    ]);
    expect(xml).toContain('catalogocuentas:Catalogo');
    expect(xml).toContain('CatalogoCuentas');
  });

  it('incluye SubCtaDe cuando se especifica', () => {
    const xml = buildCatalogoXml(INFO, [
      {
        codAgrup: '100.01',
        numCta: '1001',
        desc: 'Bancos',
        subCtaDe: '1000',
        nivel: 2,
        natur: NaturalezaCuenta.Deudora,
      },
    ]);
    expect(xml).toContain('SubCtaDe="1000"');
  });

  it('no incluye SubCtaDe cuando no se especifica', () => {
    const xml = buildCatalogoXml(INFO, [
      {
        codAgrup: '100',
        numCta: '1000',
        desc: 'Activo',
        nivel: 1,
        natur: NaturalezaCuenta.Deudora,
      },
    ]);
    expect(xml).not.toContain('SubCtaDe');
  });
});

describe('buildPolizasXml', () => {
  it('genera XML con polizas y transacciones', () => {
    const xml = buildPolizasXml(
      INFO,
      [
        {
          numPoliza: 'P001',
          fecha: '2024-01-15',
          concepto: 'Venta de mercancia',
          detalle: [
            {
              numUnidad: '1',
              concepto: 'Ingreso venta',
              debe: 1000,
              haber: 0,
              numCta: '100',
            },
            {
              numUnidad: '2',
              concepto: 'IVA trasladado',
              debe: 0,
              haber: 1000,
              numCta: '200',
            },
          ],
        },
      ],
      'AF'
    );
    expect(xml).toContain('PLZ:Polizas');
    expect(xml).toContain('PLZ:Poliza');
    expect(xml).toContain('NumUnIdenPol="P001"');
    expect(xml).toContain('TipoSolicitud="AF"');
    expect(xml).toContain('PLZ:Transaccion');
  });
});

describe('buildAuxiliarXml', () => {
  it('genera XML con cuentas auxiliares y detalle', () => {
    const xml = buildAuxiliarXml(
      INFO,
      [
        {
          numCta: '100',
          desCta: 'Bancos',
          saldoIni: 5000,
          saldoFin: 7000,
          transacciones: [
            {
              fecha: '2024-01-10',
              numPoliza: 'P001',
              concepto: 'Deposito',
              debe: 2000,
              haber: 0,
            },
          ],
        },
      ],
      'AF'
    );
    expect(xml).toContain('AuxiliarCtas:AuxiliarCtas');
    expect(xml).toContain('AuxiliarCtas:Cuenta');
    expect(xml).toContain('AuxiliarCtas:DetalleAux');
    expect(xml).toContain('NumCta="100"');
    expect(xml).toContain('SaldoIni="5000.00"');
    expect(xml).toContain('TipoSolicitud="AF"');
  });
});
