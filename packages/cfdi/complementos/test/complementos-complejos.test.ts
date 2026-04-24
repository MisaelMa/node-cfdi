import { describe, it, expect } from 'vitest';
import { Cce11 } from '../src/4.0/cce11/Cce11';
import { ComercioExterior20 } from '../src/4.0/comercioexterior20/ComercioExterior20';
import { ConsumoDeCombustibles11 } from '../src/4.0/consumodecombustibles11/ConsumoDeCombustibles11';
import { Gceh } from '../src/4.0/gceh/Gceh';
import { CartaPorte30 } from '../src/4.0/cartaporte30/CartaPorte30';
import { CartaPorte31 } from '../src/4.0/cartaporte31/CartaPorte31';
import { Ecc12 } from '../src/4.0/ecc12/Ecc12';
import { Nomina12 } from '../src/4.0/nomina12/Nomina12';
import { NotariosPublicos } from '../src/4.0/notariospublicos/NotariosPublicos';
import { Ine } from '../src/4.0/ine/Ine';
import { Iedu } from '../src/4.0/iedu/Iedu';
import { Aerolineas } from '../src/4.0/aerolineas/Aerolineas';
import { Spei } from '../src/4.0/spei/Spei';

describe('Complementos complejos 4.0', () => {
  it('Cce11 - comercio exterior con emisor, receptor, mercancias', () => {
    const cce = new Cce11({ Version: '1.1', TipoOperacion: '2' });
    cce.Emisor(undefined, { Estado: 'DIF', Pais: 'MEX', CodigoPostal: '06600' });
    cce.Receptor({ NumRegIdTrib: '123456' }, { Estado: 'CA', Pais: 'USA', CodigoPostal: '90210' });
    cce.Propietario({ NumRegIdTrib: '789', ResidenciaFiscal: 'USA' });
    cce.Mercancias({ NoIdentificacion: 'PROD01', ValorDolares: '1000.00' });
    const r = cce.getComplement();
    expect(r.key).toBe('cce11:ComercioExterior');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/ComercioExterior11');
    expect(r.schemaLocation).toHaveLength(2);
    expect(r.complement['cce11:Emisor']).toBeDefined();
    expect(r.complement['cce11:Receptor']).toBeDefined();
    expect(r.complement['cce11:Propietario']).toHaveLength(1);
    expect(r.complement['cce11:Mercancias']!['cce11:Mercancia']).toHaveLength(1);
  });

  it('ComercioExterior20 - namespace cce20', () => {
    const cce = new ComercioExterior20({ Version: '2.0', TipoOperacion: '2' });
    cce.Mercancias({ NoIdentificacion: 'PROD01', ValorDolares: '500.00' });
    const r = cce.getComplement();
    expect(r.key).toBe('cce20:ComercioExterior');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/ComercioExterior20');
    expect(r.schemaLocation).toHaveLength(2);
  });

  it('ConsumoDeCombustibles11 - con determinados', () => {
    const cc = new ConsumoDeCombustibles11({ version: '1.1', tipoOperacion: 'monedero', numeroDeCuenta: '123', total: '5000' });
    cc.Concepto(
      { identificador: 'C01', fecha: '2024-01-01', rfc: 'AAA010101AAA', claveEstacion: 'E01', cantidad: '100', nombreCombustible: 'Magna', folioOperacion: 'F01', valorUnitario: '25', importe: '2500' },
      [{ impuesto: 'IVA', tasa: '0.16', importe: '400' }]
    );
    const r = cc.getComplement();
    expect(r.key).toBe('consumodecombustibles11:ConsumoDeCombustibles');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/ConsumoDeCombustibles11');
    const conceptos = r.complement['consumodecombustibles11:Conceptos'];
    expect(conceptos!['consumodecombustibles11:ConceptoConsumoDeCombustibles']).toHaveLength(1);
    expect(conceptos!['consumodecombustibles11:ConceptoConsumoDeCombustibles'][0]['consumodecombustibles11:Determinados']).toBeDefined();
  });

  it('Gceh - erogacion con documento relacionado', () => {
    const g = new Gceh({ Version: '1.0', NumeroContrato: 'C001' });
    g.erogacion({ TipoErogacion: 'Inversion', MontocuErogacion: '50000', Porcentaje: '100' });
    g.documentoRelacionado({ FolioFiscalVinculado: 'UUID-001', FechaFolioFiscalVinculado: '2024-01-01', Mes: '01' });
    const r = g.getComplement();
    expect(r.key).toBe('gceh:GastosHidrocarburos');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/GastosHidrocarburos10');
    expect(r.complement['gceh:Erogacion']).toHaveLength(1);
    expect(r.complement['gceh:Erogacion']![0]['gceh:DocumentoRelacionado']).toHaveLength(1);
  });

  it('Gceh - error si documentoRelacionado sin erogacion', () => {
    const g = new Gceh({ Version: '1.0', NumeroContrato: 'C001' });
    expect(() => g.documentoRelacionado({ FolioFiscalVinculado: 'UUID', FechaFolioFiscalVinculado: '2024-01-01', Mes: '01' })).toThrow();
  });

  it('CartaPorte30 - ubicaciones y mercancias', () => {
    const cp = new CartaPorte30({ Version: '3.0', TranspInternac: 'No' });
    cp.setUbicacion({ TipoUbicacion: 'Origen', RFCRemitenteDestinatario: 'AAA010101AAA', FechaHoraSalidaLlegada: '2024-01-01T00:00:00' }, { Estado: 'DIF', Pais: 'MEX', CodigoPostal: '06600' });
    cp.setMercancias({ PesoBrutoTotal: '100', UnidadPeso: 'KGM', NumTotalMercancias: '1' });
    cp.setMercancia({ BienesTransp: '11121900', Descripcion: 'Producto', Cantidad: '1', ClaveUnidad: 'H87', PesoEnKg: '100' });
    const r = cp.getComplement();
    expect(r.key).toBe('cartaporte30:CartaPorte');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/CartaPorte30');
    expect(r.complement['cartaporte30:Ubicaciones']!['cartaporte30:Ubicacion']).toHaveLength(1);
  });

  it('CartaPorte31 - namespace correcto', () => {
    const cp = new CartaPorte31({ Version: '3.1', TranspInternac: 'No' });
    const r = cp.getComplement();
    expect(r.key).toBe('cartaporte31:CartaPorte');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/CartaPorte31');
  });

  it('Ecc12 - concepto con traslados', () => {
    const ecc = new Ecc12({ Version: '1.2', TipoOperacion: 'monedero', NumeroDeCuenta: '123', SubTotal: '1000', Total: '1160' });
    ecc.Concepto(
      { Identificador: 'C01', Fecha: '2024-01-01', Rfc: 'AAA010101AAA', ClaveEstacion: 'E01', Cantidad: '50', TipoCombustible: 'Magna', NombreCombustible: 'Gasolina Magna', FolioOperacion: 'F01', ValorUnitario: '20', Importe: '1000' },
      [{ Impuesto: '002', TasaOCuota: '0.160000', Importe: '160' }]
    );
    const r = ecc.getComplement();
    expect(r.key).toBe('ecc12:EstadoDeCuentaCombustible');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/EstadoDeCuentaCombustible12');
    expect(r.complement['ecc12:Conceptos']!['ecc12:ConceptoEstadoDeCuentaCombustible']).toHaveLength(1);
  });

  it('Nomina12 - estructura completa', () => {
    const n = new Nomina12({ Version: '1.2', TipoNomina: 'O', FechaPago: '2024-01-15', FechaInicialPago: '2024-01-01', FechaFinalPago: '2024-01-15', NumDiasPagados: '15' });
    n.Emisor({ RegistroPatronal: 'RP001' });
    n.Receptor({ Curp: 'CURP180101HDFAAA01', TipoContrato: '01', TipoRegimen: '02', NumEmpleado: 'E001', PeriodicidadPago: '04', ClaveEntFed: 'DIF' });
    n.Percepciones({ TotalGravado: '10000', TotalExento: '2000' });
    n.Percepcion({ TipoPercepcion: '001', Clave: '001', Concepto: 'Sueldo', ImporteGravado: '10000', ImporteExento: '2000' });
    n.Deducciones({ TotalOtrasDeducciones: '500' });
    n.Deduccion({ TipoDeduccion: '001', Clave: '001', Concepto: 'ISR', Importe: '500' });
    n.Incapacidad({ DiasIncapacidad: '3', TipoIncapacidad: '01' });
    const r = n.getComplement();
    expect(r.key).toBe('nomina12:Nomina');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/nomina12');
    expect(r.complement['nomina12:Emisor']).toBeDefined();
    expect(r.complement['nomina12:Receptor']).toBeDefined();
    expect(r.complement['nomina12:Percepciones']!['nomina12:Percepcion']).toHaveLength(1);
    expect(r.complement['nomina12:Deducciones']!['nomina12:Deduccion']).toHaveLength(1);
    expect(r.complement['nomina12:Incapacidades']!['nomina12:Incapacidad']).toHaveLength(1);
  });

  it('NotariosPublicos - datos operacion y notario', () => {
    const np = new NotariosPublicos();
    np.DatosOperacion({ NumInstrumentoNotarial: '123', FechaInstNotarial: '2024-01-01', MontoOperacion: '1000000', Subtotal: '862068.97', IVA: '137931.03' });
    np.DatosNotario({ CURP: 'CURP180101HDFAAA01', NumNotaria: '1', EntidadFederativa: 'DIF' });
    np.DescInmueble({ TipoInmueble: 'Terreno', Calle: 'Reforma', Municipio: '001', Estado: 'DIF', Pais: 'MEX', CodigoPostal: '06600' });
    const r = np.getComplement();
    expect(r.key).toBe('notariospublicos:NotariosPublicos');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/notariospublicos');
    expect(r.complement['notariospublicos:DatosOperacion']).toBeDefined();
    expect(r.complement['notariospublicos:DatosNotario']).toBeDefined();
  });

  it('Ine - entidad y contabilidad', () => {
    const ine = new Ine({ Version: '1.1', TipoProceso: 'Ordinario', TipoComite: 'Ejecutivo Nacional' });
    ine.Entidad({ ClaveEntidad: 'AGU', Ambito: 'Local' });
    ine.Contabilidad({ IdContabilidad: '1' });
    const r = ine.getComplement();
    expect(r.key).toBe('ine:INE');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/ine');
  });

  it('Iedu - complemento de concepto', () => {
    const iedu = new Iedu({ version: '1.0', nombreAlumno: 'Juan', CURP: 'CURP180101HDFAAA01', nivelEducativo: 'Primaria', autRVOE: '201587' });
    const r = iedu.getComplement();
    expect(r.key).toBe('iedu:instEducativas');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/iedu');
  });

  it('Aerolineas - otros cargos', () => {
    const a = new Aerolineas({ Version: '1.0', TUA: '50.00' });
    a.OtrosCargos({ TotalCargos: '150.00' });
    a.Cargo({ CodigoCargo: 'YR', Importe: '100.00' });
    a.Cargo({ CodigoCargo: 'XY', Importe: '50.00' });
    const r = a.getComplement();
    expect(r.key).toBe('aerolineas:Aerolineas');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/aerolineas');
  });

  it('Spei - error si ordenante sin tercero', () => {
    const s = new Spei();
    expect(() => s.ordenante({ BancoEmisor: 'BBVA', Nombre: 'Juan', TipoCuenta: '40', Cuenta: '123', RFC: 'AAA010101AAA' })).toThrow();
  });
});
