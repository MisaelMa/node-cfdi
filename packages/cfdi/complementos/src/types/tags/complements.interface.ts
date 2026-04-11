import { Complemento } from '../../Complemento';

// 4.0 type imports
import { XmlAerolineas } from '../../4.0/aerolineas/type/aerolineas.xslt';
import { XmlCartaPorte20 } from '../../4.0/cartaporte20/types/CartaPorte20.xslt';
import { XmlCartaPorte30 } from '../../4.0/cartaporte30/type/cartaporte30.xslt';
import { XmlCartaPorte31 } from '../../4.0/cartaporte31/type/cartaporte31.xslt';
import { XmlCce11 } from '../../4.0/cce11/type/cce11.xslt';
import { XmlCce20 } from '../../4.0/comercioexterior20/type/comercioexterior20.xslt';
import { XmlConsumodecombustibles } from '../../4.0/consumodecombustibles11/type/consumodecombustibles11.xslt';
import { XmlDecreto } from '../../4.0/decreto/type/decreto.xslt';
import { XmlDestruccion } from '../../4.0/destruccion/type/destruccion.xslt';
import { XmlDetallista } from '../../4.0/detallista/type/detallista.xslt';
import { XmlDivisas } from '../../4.0/divisas/type/divisas.xslt';
import { XmlDonat } from '../../4.0/donat/type/donat.xslt';
import { XmlEcc12 } from '../../4.0/ecc12/type/ecc12.xslt';
import { XmlGceh } from '../../4.0/gceh/type/gceh.xslt';
import { XmlIedu } from '../../4.0/iedu/type/iedu.xslt';
import { XmlIeeh } from '../../4.0/ieeh/type/ieeh.xslt';
import { XmlImplocal } from '../../4.0/implocal/type/implocal.xslt';
import { XmlIne } from '../../4.0/ine/type/ine.xslt';
import { XmlLeyendasFiscales } from '../../4.0/leyendasfisc/type/leyendasfisc.xslt';
import { XmlNomina12 } from '../../4.0/nomina12/type/nomina12.xslt';
import { XmlNotariosPublicos } from '../../4.0/notariospublicos/type/notariospublicos.xslt';
import { XmlObrasarte } from '../../4.0/obrasarte/type/obrasarte.xslt';
import { XmlPagoenespecie } from '../../4.0/pagoenespecie/type/pagoenespecie.xslt';
import { XmlPagos20 } from '../../4.0/pago20/types/pago20.xslt';
import { XmlPfic } from '../../4.0/pfic/type/pfic.xslt';
import { XmlRegistrofiscal } from '../../4.0/registrofiscal/type/registrofiscal.xslt';
import { XmlServicioparcial } from '../../4.0/servicioparcial/type/servicioparcial.xslt';
import { XmlSpei } from '../../4.0/spei/type/spei.xslt';
import { XmlTfd } from '../../4.0/tfd/type/tfd.xslt';
import { XmlTpe } from '../../4.0/tpe/type/tpe.xslt';
import { XmlValesDeDespensa } from '../../4.0/valesdedespensa/type/valesdedespensa.xslt';
import { XmlVehiculousado } from '../../4.0/vehiculousado/type/vehiculousado.xslt';
import { XmlVentaVehiculos } from '../../4.0/ventavehiculos/type/ventavehiculos.xslt';

// 4.0 class imports
import { Cce11 } from '../../4.0/cce11/Cce11';
import { ComercioExterior20 } from '../../4.0/comercioexterior20/ComercioExterior20';
import { ConsumoDeCombustibles11 } from '../../4.0/consumodecombustibles11/ConsumoDeCombustibles11';
import { CartaPorte30 } from '../../4.0/cartaporte30/CartaPorte30';
import { CartaPorte31 } from '../../4.0/cartaporte31/CartaPorte31';
import { Decreto } from '../../4.0/decreto/Decreto';
import { Destruccion } from '../../4.0/destruccion/Destruccion';
import { Detallista } from '../../4.0/detallista/Detallista';
import { Divisas } from '../../4.0/divisas/Divisas';
import { Donat } from '../../4.0/donat/Donat';
import { Ecc12 } from '../../4.0/ecc12/Ecc12';
import { Gceh } from '../../4.0/gceh/Gceh';
import { Iedu } from '../../4.0/iedu/Iedu';
import { Ieeh } from '../../4.0/ieeh/Ieeh';
import { Implocal } from '../../4.0/implocal/Implocal';
import { LeyendasFisc } from '../../4.0/leyendasfisc/LeyendasFisc';
import { Nomina12 } from '../../4.0/nomina12/Nomina12';
import { NotariosPublicos } from '../../4.0/notariospublicos/NotariosPublicos';
import { ObrasArte } from '../../4.0/obrasarte/ObrasArte';
import { PagoEnEspecie } from '../../4.0/pagoenespecie/PagoEnEspecie';
import { Pfic } from '../../4.0/pfic/Pfic';
import { RegistroFiscal } from '../../4.0/registrofiscal/RegistroFiscal';
import { ServicioParcial } from '../../4.0/servicioparcial/ServicioParcial';
import { Spei } from '../../4.0/spei/Spei';
import { Tfd } from '../../4.0/tfd/Tfd';
import { Tpe } from '../../4.0/tpe/Tpe';
import { ValesDeDespensa } from '../../4.0/valesdedespensa/ValesDeDespensa';
import { VehiculoUsado } from '../../4.0/vehiculousado/VehiculoUsado';
import { VentaVehiculos } from '../../4.0/ventavehiculos/VentaVehiculos';

export interface AnyKey {
  [key: string]: any;
}

export interface XmlComplements extends AnyKey {
  'aerolineas:Aerolineas'?: XmlAerolineas;
  'cartaporte20:CartaPorte'?: XmlCartaPorte20;
  'cartaporte30:CartaPorte'?: XmlCartaPorte30;
  'cartaporte31:CartaPorte'?: XmlCartaPorte31;
  'cce11:ComercioExterior'?: XmlCce11;
  'cce20:ComercioExterior'?: XmlCce20;
  'consumodecombustibles11:ConsumoDeCombustibles'?: XmlConsumodecombustibles;
  'decreto:renovacionysustitucionvehiculos'?: XmlDecreto;
  'destruccion:certificadodedestruccion'?: XmlDestruccion;
  'detallista:detallista'?: XmlDetallista;
  'divisas:Divisas'?: XmlDivisas;
  'donat:Donatarias'?: XmlDonat;
  'ecc12:EstadoDeCuentaCombustible'?: XmlEcc12;
  'gceh:GastosHidrocarburos'?: XmlGceh;
  'ieeh:IngresosHidrocarburos'?: XmlIeeh;
  'implocal:ImpuestosLocales'?: XmlImplocal;
  'ine:INE'?: XmlIne;
  'leyendasFisc:LeyendasFiscales'?: XmlLeyendasFiscales;
  'nomina12:Nomina'?: XmlNomina12;
  'notariospublicos:NotariosPublicos'?: XmlNotariosPublicos;
  'obrasarte:obrasarteantiguedades'?: XmlObrasarte;
  'pago20:Pagos'?: XmlPagos20;
  'pagoenespecie:PagoEnEspecie'?: XmlPagoenespecie;
  'pfic:PFintegranteCoordinado'?: XmlPfic;
  'registrofiscal:CFDIRegistroFiscal'?: XmlRegistrofiscal;
  'servicioparcial:parcialesconstruccion'?: XmlServicioparcial;
  'spei:Complemento_SPEI'?: XmlSpei;
  'tfd:TimbreFiscalDigital'?: XmlTfd;
  'tpe:TuristaPasajeroExtranjero'?: XmlTpe;
  'valesdedespensa:ValesDeDespensa'?: XmlValesDeDespensa;
  'vehiculousado:VehiculoUsado'?: XmlVehiculousado;
}

export interface XmlComplementsConcepts extends AnyKey {
  'iedu:instEducativas'?: XmlIedu;
  'ventavehiculos:VentaVehiculos'?: XmlVentaVehiculos;
}

export declare type ComlementType =
  | Cce11
  | ComercioExterior20
  | ConsumoDeCombustibles11
  | CartaPorte30
  | CartaPorte31
  | Decreto
  | Destruccion
  | Detallista
  | Divisas
  | Donat
  | Ecc12
  | Gceh
  | Ieeh
  | Implocal
  | LeyendasFisc
  | Nomina12
  | NotariosPublicos
  | ObrasArte
  | PagoEnEspecie
  | Pfic
  | RegistroFiscal
  | ServicioParcial
  | Spei
  | Tfd
  | Tpe
  | ValesDeDespensa
  | VehiculoUsado
  | VentaVehiculos
  | Complemento;

export declare type ComplementTypeXml<T> =
  | XmlAerolineas
  | XmlCartaPorte20
  | XmlCartaPorte30
  | XmlCartaPorte31
  | XmlCce11
  | XmlCce20
  | XmlConsumodecombustibles
  | XmlDecreto
  | XmlDestruccion
  | XmlDetallista
  | XmlDivisas
  | XmlDonat
  | XmlEcc12
  | XmlGceh
  | XmlIeeh
  | XmlImplocal
  | XmlLeyendasFiscales
  | XmlNomina12
  | XmlNotariosPublicos
  | XmlObrasarte
  | XmlPagoenespecie
  | XmlPfic
  | XmlRegistrofiscal
  | XmlServicioparcial
  | XmlSpei
  | XmlTfd
  | XmlTpe
  | XmlValesDeDespensa
  | XmlVehiculousado
  | XmlVentaVehiculos
  | T;

export declare type ComlementTypeConcept = Iedu | VentaVehiculos;

export interface ComplementsReturn<T = any> extends ComplementProperties {
  complement: ComplementTypeXml<T>;
}

export interface ComplementProperties {
  key: string;
  xmlns: string;
  xmlnskey: string;
  schemaLocation: string[];
}

export interface XmlComplementsAttributes extends AnyKey {
  'xmlns:cfdi'?: string;
  'xmlns:aerolineas'?: string;
  'xmlns:cartaporte20'?: string;
  'xmlns:cartaporte30'?: string;
  'xmlns:cartaporte31'?: string;
  'xmlns:cce11'?: string;
  'xmlns:cce20'?: string;
  'xmlns:consumodecombustibles11'?: string;
  'xmlns:decreto'?: string;
  'xmlns:destruccion'?: string;
  'xmlns:detallista'?: string;
  'xmlns:divisas'?: string;
  'xmlns:donat'?: string;
  'xmlns:ecc12'?: string;
  'xmlns:gceh'?: string;
  'xmlns:ieeh'?: string;
  'xmlns:implocal'?: string;
  'xmlns:ine'?: string;
  'xmlns:leyendasFisc'?: string;
  'xmlns:nomina12'?: string;
  'xmlns:notariospublicos'?: string;
  'xmlns:obrasarte'?: string;
  'xmlns:pago20'?: string;
  'xmlns:pagoenespecie'?: string;
  'xmlns:pfic'?: string;
  'xmlns:registrofiscal'?: string;
  'xmlns:servicioparcial'?: string;
  'xmlns:spei'?: string;
  'xmlns:tfd'?: string;
  'xmlns:tpe'?: string;
  'xmlns:valesdedespensa'?: string;
  'xmlns:vehiculousado'?: string;
  /* Concept complements */
  'xmlns:iedu'?: string;
  'xmlns:ventavehiculos'?: string;
}

export interface XmlnsComplementsLinks extends AnyKey {
  aerolineas?: string;
  cartaporte20?: string;
  cartaporte30?: string;
  cartaporte31?: string;
  cce11?: string;
  cce20?: string;
  consumodecombustibles11?: string;
  decreto?: string;
  destruccion?: string;
  detallista?: string;
  divisas?: string;
  donat?: string;
  ecc12?: string;
  gceh?: string;
  ieeh?: string;
  implocal?: string;
  ine?: string;
  leyendasFisc?: string;
  nomina12?: string;
  notariospublicos?: string;
  obrasarte?: string;
  pago20?: string;
  pagoenespecie?: string;
  pfic?: string;
  registrofiscal?: string;
  servicioparcial?: string;
  spei?: string;
  tfd?: string;
  tpe?: string;
  valesdedespensa?: string;
  vehiculousado?: string;
  /* Concept complements */
  iedu?: string;
  ventavehiculos?: string;
}
