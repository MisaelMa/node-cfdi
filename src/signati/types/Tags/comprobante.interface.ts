import { XmlEmisor } from './emisor.inteface';
import { XmlReceptor } from './receptor.inteface';
import { XmlConcepto } from './concepts.interface';
import { XmlImpuestos } from './impuestos.interface';
import { anyKey, XmlComplements } from './complements.interface';
import { Ine, Aerolineas, Cce11, ConsumoDeCombustibles11, Decreto, Destruccion } from '../../complements';
import { TipoComprobante, TypeComprobante } from "../Catalogs/TipoComprobante";
import { ExportacionEnum, ExportacionType, FormaPago, FormaPagoType, MetodoPago, MetodoPagoType } from "../Catalogs";

export interface XmlComprobante {
    '_attributes': XmlComprobanteAttributes;
    'cfdi:CfdiRelacionados'?: XmlRelacionados;
    'cfdi:Emisor'?: XmlEmisor;
    'cfdi:Receptor'?: XmlReceptor;
    'cfdi:Conceptos': XmlConcepto;
    'cfdi:Impuestos'?: XmlImpuestos;
    'cfdi:Complemento'?: XmlComplements;
}

export interface XmlRelacionados {
    '_attributes'?: XmlRelacionadosAttributes;
    'cfdi:CfdiRelacionado'?: XmlRelacionado[];
}

export interface XmlRelacionadosAttributes {
    TipoRelacion: string;
}

export interface XmlRelacionado {
    '_attributes'?: XmlRelacionadoAttributes;
}

export interface XmlRelacionadoAttributes {
    UUID: string;
}

export interface XmlComprobanteAttributes extends Comprobante, anyKey {
    'xmlns:xsi'?: string; // http://www.w3.org/2001/XMLSchema-instance
    'xmlns:xs'?: string; // http://www.w3.org/2001/XMLSchema
    /*########XmlComplementsConcepts#########3*/
    'xmlns:cfdi'?: string; // http://www.sat.gob.mx/cfd/3
    'xmlns:ecc11'?: string; // http://www.sat.gob.mx/EstadoDeCuentaCombustible
    'xmlns:donat'?: string; // http://www.sat.gob.mx/donat
    'xmlns:divisas'?: string; // http://www.sat.gob.mx/divisas
    'xmlns:implocal'?: string; // http://www.sat.gob.mx/implocal
    'xmlns:leyendasFisc'?: string; // http://www.sat.gob.mx/leyendasFiscales
    'xmlns:pfic'?: string; // http://www.sat.gob.mx/pfic
    'xmlns:tpe'?: string; // http://www.sat.gob.mx/TuristaPasajeroExtranjero
    'xmlns:spei'?: string; // http://www.sat.gob.mx/spei
    'xmlns:detallista'?: string; // http://www.sat.gob.mx/detallista
    'xmlns:registrofiscal'?: string; // http://www.sat.gob.mx/registrofiscal
    'xmlns:nomina12'?: string; // http://www.sat.gob.mx/nomina12
    'xmlns:pagoenespecie'?: string; // http://www.sat.gob.mx/pagoenespecie
    'xmlns:valesdedespensa'?: string; // http://www.sat.gob.mx/valesdedespensa
    'xmlns:consumodecombustibles11'?: string; // http://www.sat.gob.mx/ConsumoDeCombustibles11
    'xmlns:aerolineas'?: string; // ="http://www.sat.gob.mx/aerolineas"
    'xmlns:notariospublicos'?: string; // http://www.sat.gob.mx/notariospublicos
    'xmlns:vehiculousado'?: string; // http://www.sat.gob.mx/vehiculousado
    'xmlns:servicioparcial'?: string; // http://www.sat.gob.mx/servicioparcialconstruccion
    'xmlns:decreto'?: string; // http://www.sat.gob.mx/renovacionysustitucionvehiculos
    'xmlns:destruccion'?: string; // http://www.sat.gob.mx/certificadodestruccion
    'xmlns:obrasarte'?: string; //  http://www.sat.gob.mx/arteantiguedades
    'xmlns:ine'?: string; // http://www.sat.gob.mx/ine
    'xmlns:cce11'?: string; // http://www.sat.gob.mx/ComercioExterior11
    'xmlns:pago10'?: string; // http://www.sat.gob.mx/Pagos
    'xmlns:gceh'?: string; // http://www.sat.gob.mx/GastosHidrocarburos10
    /*########XmlComplementsConcepts#########3*/
    'xmlns:iedu'?: string; // http://www.sat.gob.mx/iedu
    'xmlns:hidrocarburospetroliferos'?: string; // http://www.sat.gob.mx/hidrocarburospetroliferos
    'xmlns:ventavehiculos'?: string; // http://www.sat.gob.mx/ventavehiculos
    'xmlns:terceros'?: string; // http://www.sat.gob.mx/terceros
    'xmlns:aieps'?: string; // http://www.sat.gob.mx/acreditamiento
    'xsi:schemaLocation'?: string;

}

export interface Comprobante {
    xmlns?: XmlnsLinks;
    schemaLocation?: string[];
    Version?: string;
    Serie?: string;
    Folio?: string;
    Fecha: string;
    FormaPago?: FormaPago | FormaPagoType;
    NoCertificado: string;
    condicionesDePago?: string;
    SubTotal: string;
    Descuento?: string;
    Moneda: string;
    TipoCambio?: string;
    Total: string;
    TipoDeComprobante: TipoComprobante | TypeComprobante;
    Exportacion: ExportacionEnum | ExportacionType | string;
    MetodoPago?: MetodoPago | MetodoPagoType;
    LugarExpedicion: string;
    Confirmacion?: string;
    Certificado?: string;
    Sello?: string;
}

export interface XmlnsLinks extends anyKey {
    cfdi?: string; // http://www.sat.gob.mx/cfd/3
    xs?: string; // http://www.w3.org/2001/XMLSchema
    xsi?: string; // http://www.w3.org/2001/XMLSchema-instance
    /*########XmlComplementsConcepts#########3*/
    ecc11?: string; // http://www.sat.gob.mx/EstadoDeCuentaCombustible
    donat?: string; // http://www.sat.gob.mx/donat
    divisas?: string; // http://www.sat.gob.mx/divisas
    implocal?: string; // http://www.sat.gob.mx/implocal
    leyendasFisc?: string; // http://www.sat.gob.mx/leyendasFiscales
    pfic?: string; // http://www.sat.gob.mx/pfic
    tpe?: string; // http://www.sat.gob.mx/TuristaPasajeroExtranjero
    spei?: string; // http://www.sat.gob.mx/spei
    detallista?: string; // http://www.sat.gob.mx/detallista
    registrofiscal?: string; // http://www.sat.gob.mx/registrofiscal
    nomina12?: string; // http://www.sat.gob.mx/nomina12
    pagoenespecie?: string; // http://www.sat.gob.mx/pagoenespecie
    valesdedespensa?: string; // http://www.sat.gob.mx/valesdedespensa
    consumodecombustibles11?: string; // http://www.sat.gob.mx/ConsumoDeCombustibles11
    aerolineas?: string; // ="http://www.sat.gob.mx/aerolineas"
    notariospublicos?: string; // http://www.sat.gob.mx/notariospublicos
    vehiculousado?: string; // http://www.sat.gob.mx/vehiculousado
    servicioparcial?: string; // http://www.sat.gob.mx/servicioparcialconstruccion
    decreto?: string; // http://www.sat.gob.mx/renovacionysustitucionvehiculos
    destruccion?: string; // http://www.sat.gob.mx/certificadodestruccion
    obrasarte?: string; // http://www.sat.gob.mx/arteantiguedades
    ine?: string; // http://www.sat.gob.mx/ine
    cce11?: string; // http://www.sat.gob.mx/ComercioExterior11
    pago10?: string; // http://www.sat.gob.mx/Pagos
    gceh?: string; // http://www.sat.gob.mx/GastosHidrocarburos10
    /*########XmlComplementsConcepts#########3*/
    iedu?: string; // http://www.sat.gob.mx/iedu
    ventavehiculos?: string; // http://www.sat.gob.mx/ventavehiculos
    terceros?: string; // http://www.sat.gob.mx/terceros
    aieps?: string; // http://www.sat.gob.mx/acreditamiento
}



