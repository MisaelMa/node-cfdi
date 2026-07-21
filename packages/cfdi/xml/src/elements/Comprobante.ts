import {
  CFDIComprobante,
  ComprobanteAttributes,
  Config,
  TagComprobante,
  XmlCdfi,
  XmlComprobante,
  XmlComprobanteAttributes,
  XmlVersion,
  XmlnsLinks,
} from '../types';
import { ComlementType, XmlComplements } from '@cfdi/complementos';

import { Concepto } from './Concepto';
import { Emisor } from './Emisor';
import { Impuestos } from './Impuestos';
import { Receptor } from './Receptor';
import { Relacionado } from './Relacionado';
import { Schema } from '@cfdi/xsd';
import { schemaBuild } from '../utils/XmlHelp';
import { sortObject } from '../utils/Map';
import xmlJS from 'xml-js';

export class Comprobante {
  protected xml: XmlCdfi = {
    _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
  } as XmlCdfi;
  protected tc: TagComprobante = 'cfdi:Comprobante';
  protected version = '4.0';
  protected XMLSchema = 'http://www.w3.org/2001/XMLSchema-instance';
  protected cfd = 'http://www.sat.gob.mx/cfd/4';
  protected locations = [
    'http://www.sat.gob.mx/cfd/4',
    'http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd',
  ];

  schema = Schema.of();
  constructor(options?: Config) {
    const { debug, schema } = options || { debug: false };
    // `setConfig` carga los XSD desde disco (fs) para validar. Sin `schema.path`
    // no hay nada que cargar y, además, evitamos tocar `fs` — esto permite usar
    // el builder en el browser (arma el JSON; la validación la hace el server).
    if (schema?.path) {
      this.schema.setConfig({
        debug: debug,
        path: schema.path,
      });
    }
    this.restartCfdi();
  }

  /**
   *xmlns
   *
   * @param xmlns
   * XmlnsLinks
   */
  protected xmlns(xmlns: XmlnsLinks): void {
    if (!xmlns.xsi) {
      this.addXmlns('xsi', this.XMLSchema);
    }
    if (!xmlns.cfdi) {
      this.addXmlns('cfdi', this.cfd);
    }

    for (const xmln in xmlns) {
      this.addXmlns(xmln, xmlns[xmln]);
    }
  }

  /**
   *addXmlns
   *
   * @param xmlnsKey
   * string
   * @param xmlns
   * string
   */
  protected addXmlns(xmlnsKey: string, xmlns: string): void {
    this.xml['cfdi:Comprobante']._attributes[`xmlns:${xmlnsKey}`] = xmlns;
  }

  /**
   *addSchemaLocation
   *
   * @param locations
   * string[]
   */
  protected addSchemaLocation(locations: string[]): void {
    const SCHEMA_LOCATION = 'xsi:schemaLocation';

    if (!this.xml['cfdi:Comprobante']._attributes[SCHEMA_LOCATION]) {
      this.xml['cfdi:Comprobante']._attributes[SCHEMA_LOCATION] = '';
    }

    const currentLocations =
      this.xml['cfdi:Comprobante']._attributes[SCHEMA_LOCATION] || '';

    const listLocations = currentLocations.split(' ');

    const uniqueLocations = Array.from(
      new Set([...listLocations, ...locations].filter(Boolean))
    );

    const schemaLocation = schemaBuild(uniqueLocations);

    this.xml['cfdi:Comprobante']._attributes[SCHEMA_LOCATION] = schemaLocation;
  }

  /**
   *setAttributesXml
   *
   * @param attr
   * XmlVersion
   */
  public setAttributesXml(attr: XmlVersion = {} as XmlVersion): void {
    const { version = '1.0', encoding = 'utf-8' } = attr;
    this.xml._declaration._attributes = {
      version,
      encoding,
    };
  }

  public setAttributes(atrr: ComprobanteAttributes = {}): void {
    const { xmlns, schemaLocation } = atrr || {};
    this.xmlns(xmlns || {});
    this.addSchemaLocation(schemaLocation || this.locations);
  }

  public comprobante(attribute: CFDIComprobante): void {
    const order = [
      'xsi:schemaLocation',
      'Version',
      'Serie',
      'Folio',
      'Fecha',
      'Sello',
      'FormaPago',
      'NoCertificado',
      'Certificado',
      'CondicionesDePago',
      'SubTotal',
      'Descuento',
      'Moneda',
      'TipoCambio',
      'Total',
      'TipoDeComprobante',
      'Exportacion',
      'MetodoPago',
      'LugarExpedicion',
      'Confirmacion',
      'xmlns:cfdi',
      'xmlns:xsi',
    ];
    const sortComprobante = sortObject(
      {
        ...this.xml['cfdi:Comprobante']._attributes,
        ...{ Version: this.version },
        ...attribute,
        Sello: '',
        NoCertificado: '',
        Certificado: '',
        SubTotal: attribute.SubTotal,
        Descuento: attribute.Descuento,
        Total: attribute.Total,
      },
      order
    );
    this.xml['cfdi:Comprobante']._attributes =
      sortComprobante as XmlComprobanteAttributes;

    const comprobante = this.schema.cfdi.comprobante;

    comprobante.validateInit(this.xml['cfdi:Comprobante']._attributes);
  }
  /**
   *informacionGlobal
   *
   * @param payload
   * informacionGlobal
   * @param payload.Periodicidad
   * string
   * @param payload.Meses
   * string
   * @param payload.Año
   * string
   */
  public informacionGlobal(payload: {
    Periodicidad: string;
    Meses: string;
    Año: string | number;
  }): void {
    this.schema.cfdi.informacionGlobal.validate(payload);
    this.xml['cfdi:Comprobante'] = {
      'cfdi:InformacionGlobal': {
        _attributes: payload,
      },
      ...this.xml['cfdi:Comprobante'],
    };
  }

  /**
   *relacionados
   *
   * @param relationCfdi
   * Relacionado
   */
  public relacionados(relationCfdi: Relacionado): void {
    this.xml['cfdi:Comprobante'] = {
      'cfdi:CfdiRelacionados': relationCfdi.getRelation(),
      ...this.xml['cfdi:Comprobante'],
    };
  }

  /**
   *emisor
   *
   * @param emisor
   * Emisor
   */
  public emisor(emisor: Emisor): void {
    this.xml['cfdi:Comprobante']['cfdi:Emisor'] = emisor.emisor;
  }

  /**
   *receptor
   *
   * @param receptor
   * Receptor
   */
  public receptor(receptor: Receptor): void {
    this.xml['cfdi:Comprobante']['cfdi:Receptor'] = receptor.receptor;
  }

  /**
   *concepto
   *
   * @param concept
   * Concepts
   */
  public concepto(concept: Concepto): void {
    if (concept.isComplement()) {
      const properties = concept.getComplementProperties();
      this.addXmlns(properties.xmlnskey, properties.xmlns);
      this.addSchemaLocation(properties.schemaLocation);
    }

    if (!this.xml['cfdi:Comprobante']['cfdi:Conceptos']) {
      this.xml['cfdi:Comprobante']['cfdi:Conceptos'] = {
        'cfdi:Concepto': [],
      };
    }

    this.xml['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto'].push(
      concept.getConcept()
    );
  }

  /**
   *impuesto
   *
   * @param impuesto
   * Impuestos
   */
  public impuesto(impuesto: Impuestos): void {
    this.xml['cfdi:Comprobante']['cfdi:Impuestos'] = impuesto.impuesto;
  }

  /**
   *complemento
   *
   * @param complements
   * ComlementType
   */
  public complemento(complements: ComlementType): void {
    if (!this.xml['cfdi:Comprobante']['cfdi:Complemento']) {
      this.xml['cfdi:Comprobante']['cfdi:Complemento'] = {} as XmlComplements;
    }
    const complement = complements.getComplement();
    this.addXmlns(complement.xmlnskey, complement.xmlns);
    this.addSchemaLocation(complement.schemaLocation);
    this.xml['cfdi:Comprobante']['cfdi:Complemento'][complement.key] = complement.complement
  }

  public setCertificado(certificado: string): void {
    if (!certificado) return;

    this.xml['cfdi:Comprobante']._attributes.Certificado = certificado;
  }

  public setNoCertificado(noCertificado: string): void {
    if (!noCertificado) return;

    this.xml['cfdi:Comprobante']._attributes.NoCertificado = noCertificado;
  }

  public setSello(sello: string): void {
    if (!sello) return;

    this.xml['cfdi:Comprobante']._attributes.Sello = sello;
  }

  protected restartCfdi(): void {
    this.xml = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8',
        },
      },
    } as XmlCdfi;
    this.xml['cfdi:Comprobante'] = {
      _attributes: {} as XmlComprobanteAttributes,
      'cfdi:Emisor': {},
      'cfdi:Receptor': {},
    } as XmlComprobante;
    this.setAttributes();
  }

  get xmlObject(): XmlCdfi {
    return this.xml;
  }

  /**
   * getJsonCdfi
   *
   * Devuelve el objeto JSON del CFDI ya armado (lo que se envía al server).
   * Puro: no toca certificados ni `fs`, por eso vive en la base y funciona en
   * el browser.
   */
  public getJsonCdfi(): XmlCdfi {
    return this.xml;
  }

  /**
   * getXmlCdfi
   *
   * Serializa el CFDI a string XML (sin sellar). Usa `xml-js`, que es
   * browser-safe. Reinicia el comprobante interno tras serializar.
   */
  public getXmlCdfi(): string {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const cfdi = xmlJS.js2xml({ ...this.xml }, options);
    this.restartCfdi();
    return cfdi;
  }
}
