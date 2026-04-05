import { describe, expect, it, test } from 'vitest';
import { XmlToJson } from '../src/xmlToJson'
import path from 'path';

const files_path = path.resolve(__dirname, '..', '..', '..', 'files','xml');

describe(' to json', () => {
    
  it('un concepto', () => {
    const xml = path.resolve(files_path,'un-concepto.xml')
    const json = XmlToJson(xml)
    
    expect(json).toBeDefined();

    expect(json).toEqual({
      "Comprobante": {
        "Conceptos": [
          {
            "ClaveProdServ": "86121500",
            "Cantidad": "1",
            "ClaveUnidad": "E48",
            "Unidad": "Pieza",
            "Descripcion": "Mensualidad - diciembre",
            "ValorUnitario": "5000",
            "Importe": "5000",
            "Descuento": "0"
          }
        ]
      }
    });
  });

  it('dos conceptos', () => {
    const xml = path.resolve(files_path,'dos-conceptos.xml')
    const json = XmlToJson(xml)

    expect(json).toBeDefined();

    expect(json).toEqual({
      "Comprobante": {
        "Conceptos": [
          {
            "ClaveProdServ": "86121500",
            "Cantidad": "1",
            "ClaveUnidad": "E48",
            "Unidad": "Pieza",
            "Descripcion": "Mensualidad - diciembre",
            "ValorUnitario": "5000",
            "Importe": "5000",
            "Descuento": "0"
          },
          {
            "ClaveProdServ": "86121500",
            "Cantidad": "1",
            "ClaveUnidad": "E48",
            "Unidad": "Pieza",
            "Descripcion": "Mensualidad - diciembre",
            "ValorUnitario": "5000",
            "Importe": "5000",
            "Descuento": "0"
          }
        ]
      }
    });
  });
   
  it ('con complemento', () => {
    const xml = path.resolve(files_path,'conceptos.xml')
    const json = XmlToJson(xml)
   // console.log(JSON.stringify(json, null, 2));
    expect(json).toBeDefined();
    expect(json).toEqual({
      "Comprobante": {
        "Conceptos": [
          {
            "ClaveProdServ": "86121500",
            "Cantidad": "1",
            "ClaveUnidad": "E48",
            "Unidad": "Pieza",
            "Descripcion": "Mensualidad - diciembre",
            "ValorUnitario": "5000",
            "Importe": "5000",
            "Descuento": "0",
            "Impuestos": {
              "Traslados": [
                {
                  "Base": "1",
                  "Impuesto": "002",
                  "TipoFactor": "Exento"
                }
              ]
            },
            "ComplementoConcepto": {
              "instEducativas": {
                "xmlns:iedu": "http://www.sat.gob.mx/iedu",
                "rfcPago": "CACX7605101P8",
                "autRVOE": "118141",
                "nivelEducativo": "Primaria",
                "CURP": "XEXX010101HNEXXXA4",
                "nombreAlumno": "RUBINHO LOPEZ ADILENE",
                "version": "1.0"
              }
            }
          }
        ]
      }
    })
    
  })
   
});
