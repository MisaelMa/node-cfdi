import { describe, it, expect } from 'vitest';
import { Implocal } from '../src/4.0/implocal/Implocal';
import { LeyendasFisc } from '../src/4.0/leyendasfisc/LeyendasFisc';
import { Tpe } from '../src/4.0/tpe/Tpe';
import { ValesDeDespensa } from '../src/4.0/valesdedespensa/ValesDeDespensa';
import { VehiculoUsado } from '../src/4.0/vehiculousado/VehiculoUsado';
import { ServicioParcial } from '../src/4.0/servicioparcial/ServicioParcial';
import { Destruccion } from '../src/4.0/destruccion/Destruccion';
import { Ieeh } from '../src/4.0/ieeh/Ieeh';
import { Decreto } from '../src/4.0/decreto/Decreto';
import { Spei } from '../src/4.0/spei/Spei';
import { VentaVehiculos } from '../src/4.0/ventavehiculos/VentaVehiculos';

describe('Complementos medios 4.0', () => {
  it('Implocal - retenciones y traslados', () => {
    const imp = new Implocal({ version: '1.0', TotaldeRetenciones: '100.00', TotaldeTraslados: '50.00' });
    imp.retenciones({ ImpLocRetenido: 'ISR', TasadeRetencion: '10', Importe: '100.00' });
    imp.traslados({ ImpLocTrasladado: 'IVA', TasadeTraslado: '16', Importe: '50.00' });
    const r = imp.getComplement();
    expect(r.key).toBe('implocal:ImpuestosLocales');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/implocal');
    expect(r.complement['implocal:RetencionesLocales']).toHaveLength(1);
    expect(r.complement['implocal:TrasladosLocales']).toHaveLength(1);
  });

  it('LeyendasFisc - agregar leyendas', () => {
    const lf = new LeyendasFisc();
    lf.leyenda({ textoLeyenda: 'Leyenda de prueba', disposicionFiscal: 'Art 1' });
    lf.leyenda({ textoLeyenda: 'Segunda leyenda' });
    const r = lf.getComplement();
    expect(r.key).toBe('leyendasFisc:LeyendasFiscales');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/leyendasFiscales');
    expect(r.complement._attributes.version).toBe('1.0');
    expect(r.complement['leyendasFisc:Leyenda']).toHaveLength(2);
  });

  it('Tpe - datos de transito', () => {
    const tpe = new Tpe({ version: '1.0', fechadeTransito: '2024-01-01T00:00:00', tipoTransito: 'Entrada' });
    tpe.datosTransito({ Via: 'Aerea', TipoId: 'Pasaporte', NumeroId: 'P123', Nacionalidad: 'USA', EmpresaTransporte: 'Airline' });
    const r = tpe.getComplement();
    expect(r.key).toBe('tpe:TuristaPasajeroExtranjero');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/TuristaPasajeroExtranjero');
    expect(r.complement['tpe:datosTransito']).toHaveLength(1);
  });

  it('ValesDeDespensa - agregar conceptos', () => {
    const vd = new ValesDeDespensa({ version: '1.0', tipoOperacion: 'monedero', numeroDeCuenta: '123456', total: '1000.00' });
    vd.concepto({ identificador: '001', fecha: '2024-01-01', rfc: 'AAA010101AAA', curp: 'CURP180101HDFAAA01', nombre: 'Juan', importe: '500.00' });
    const r = vd.getComplement();
    expect(r.key).toBe('valesdedespensa:ValesDeDespensa');
    expect(r.complement['valesdedespensa:Conceptos']!['valesdedespensa:Concepto']).toHaveLength(1);
  });

  it('VehiculoUsado - informacion aduanera', () => {
    const vu = new VehiculoUsado({ Version: '1.0', montoAdquisicion: '100000', montoEnajenacion: '80000', claveVehicular: 'CV01', marca: 'Toyota', tipo: 'Sedan', modelo: '2020', NIV: 'NIV123', valor: '90000' });
    vu.informacionAduanera({ numero: 'PED001', fecha: '2024-01-01' });
    const r = vu.getComplement();
    expect(r.key).toBe('vehiculousado:VehiculoUsado');
    expect(r.complement['vehiculousado:InformacionAduanera']).toBeDefined();
  });

  it('ServicioParcial - inmueble', () => {
    const sp = new ServicioParcial({ Version: '1.0', NumPerLicoAut: 'LIC001' });
    sp.inmueble({ Calle: 'Reforma', Municipio: '001', Estado: 'DIF', CodigoPostal: '06600' });
    const r = sp.getComplement();
    expect(r.key).toBe('servicioparcial:parcialesconstruccion');
    expect(r.complement['servicioparcial:Inmueble']).toBeDefined();
  });

  it('Destruccion - vehiculo e info aduanera', () => {
    const d = new Destruccion({ Version: '1.0', Serie: '012', NumFolDesVeh: '0221' });
    d.VehiculoDestruido({ Marca: 'Nissan', TipooClase: 'Sedan', Año: '2019', Modelo: 'Versa', NumPlacas: 'ABC123', NumFolTarjCir: 'TC001' });
    d.InformacionAduanera({ NumPedImp: 'PED001', Fecha: '2024-01-01', Aduana: 'Aduana Norte' });
    const r = d.getComplement();
    expect(r.key).toBe('destruccion:certificadodedestruccion');
    expect(r.complement['destruccion:VehiculoDestruido']).toBeDefined();
    expect(r.complement['destruccion:InformacionAduanera']).toBeDefined();
  });

  it('Ieeh - documentos relacionados', () => {
    const ieeh = new Ieeh({ Version: '1.0', NumeroContrato: 'C001', ContraprestacionPagadaOperador: '1000', Porcentaje: '50' });
    ieeh.docRelacionado({ FolioFiscalVinculado: 'UUID-001', FechaFolioFiscalVinculado: '2024-01-01', Mes: '01' });
    ieeh.docRelacionado({ FolioFiscalVinculado: 'UUID-002', FechaFolioFiscalVinculado: '2024-02-01', Mes: '02' });
    const r = ieeh.getComplement();
    expect(r.key).toBe('ieeh:IngresosHidrocarburos');
    expect(r.complement['ieeh:DocumentoRelacionado']).toHaveLength(2);
  });

  it('Decreto - renovacion vehicular', () => {
    const d = new Decreto({ Version: '1.0', TipoDeDecreto: 'Renovacion' });
    d.RenovVehicular({ VehEnaj: 'VE01', TipooClaseVehEnaj: 'Sedan', MarcaVehEnaj: 'Ford', ModeloVehEnaj: 'Focus', NumPlacasVehEnaj: 'XYZ789', FechaRegVehEnaj: '2020-01-01', VehNuevo: 'VN01', TipooClaseVehNuevo: 'SUV', MarcaVehNuevo: 'Toyota', ModeloVehNuevo: 'RAV4', AnioModeloVehNuevo: '2024', PrecioVehNuevo: '500000', MontoDesc: '50000', FechaFact: '2024-01-01' });
    const r = d.getComplement();
    expect(r.key).toBe('decreto:renovacionysustitucionvehiculos');
    expect(r.complement['decreto:DecretoRenovVehiculos']).toBeDefined();
  });

  it('Spei - tercero con ordenante y beneficiario', () => {
    const s = new Spei();
    s.tercero({ FechaOperacion: '2024-01-01', Hora: '12:00:00', ClaveSPEI: 'SPEI01', sello: 'sello', numeroCertificado: 'cert' });
    s.ordenante({ BancoEmisor: 'BBVA', Nombre: 'Juan', TipoCuenta: '40', Cuenta: '123456', RFC: 'AAA010101AAA' });
    s.beneficiario({ BancoReceptor: 'Banamex', Nombre: 'Pedro', TipoCuenta: '40', Cuenta: '654321', RFC: 'BBB020202BBB', Concepto: 'Pago', MontoPago: '1000' });
    const r = s.getComplement();
    expect(r.key).toBe('spei:Complemento_SPEI');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/spei');
    expect(r.complement['spei:SPEI_Tercero']).toHaveLength(1);
    expect(r.complement['spei:SPEI_Tercero']![0]['spei:Ordenante']).toBeDefined();
    expect(r.complement['spei:SPEI_Tercero']![0]['spei:Beneficiario']).toBeDefined();
  });

  it('VentaVehiculos - con info aduanera', () => {
    const vv = new VentaVehiculos({ version: '1.1', ClaveVehicular: 'CV01', Niv: 'NIV001' });
    vv.InformacionAduanera({ numero: 'PED001', fecha: '2024-01-01' });
    const r = vv.getComplement();
    expect(r.key).toBe('ventavehiculos:VentaVehiculos');
    expect(r.xmlns).toBe('http://www.sat.gob.mx/ventavehiculos');
    expect(r.complement['ventavehiculos:InformacionAduanera']).toHaveLength(1);
  });
});
