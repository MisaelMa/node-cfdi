import { describe, expect, it, test } from 'vitest';
import { XmlToJson } from '../src/xmlToJson'
import path from 'path';

const files_path = path.resolve(__dirname, '..', '..', '..', 'files','xml');

describe('xml to json', () => {
    
  it('json', () => {
    const xml = path.resolve(files_path,'5E2D6AFF-2DD7-43D1-83D3-14C1ACA396D9.xml')
    const json = XmlToJson(xml, {original: true})
    console.log(JSON.stringify(json, null, 2))

    expect(json).toBeDefined();
  });
  it('json', () => {
    const xml = path.resolve(files_path,'5E2D6AFF-2DD7-43D1-83D3-14C1ACA396D9.xml')
    const json = XmlToJson(xml)
    console.log(JSON.stringify(json, null, 2))

    expect(json).toBeDefined();
   /*  expect(json).toEqual({
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:cfdi": "http://www.sat.gob.mx/cfd/3",
      "xsi:schemaLocation": " http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd",
      "Version": "3.3",
      "Serie": "I",
      "Folio": "ACAPDC-50",
      "Fecha": "2021-02-17T02:12:14",
      "Sello": "HGJg9lit0Gr54foL1tBT+h/HnpjO9WdqJJldQPKoRUYGgo27ImMBgMoyn31Kz0qOxZA2IbW7Hl5MmxKd5ImdT3nPCRlX7E7wKMUkUdLzb95DvUXl4y2jX33Cd1g65i/9YJB5ItGj8BMFq79K7Yyxm2U/Z+Txfv1zeSRkQk0HT4VyM7mCUnru55AH3OBe692c7X2AAna4eNViZBi+C7fA1zmA4NuI6qTpQdsFgEy+dkCZRFNJIBgZ6VHtcwolA5uBGPKjWyndADpiYuPLhzLWn2TQEkWXW0geGoNFfFnPukbXqQTlZyBCZiEcRfQKWCzqpv8SM4PBhnXbPR0lKTFD2g==",
      "FormaPago": "04",
      "NoCertificado": "30001000000400002326",
      "Certificado": "MIIFijCCA3KgAwIBAgIUMzAwMDEwMDAwMDA0MDAwMDIzMjYwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWRpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMTkwNTI5MTgxMTQ4WhcNMjMwNTI5MTgxMTQ4WjCBsTEdMBsGA1UEAxMUQUxCQSBYS0FSQUpBTSBNRU5ERVoxHTAbBgNVBCkTFEFMQkEgWEtBUkFKQU0gTUVOREVaMR0wGwYDVQQKExRBTEJBIFhLQVJBSkFNIE1FTkRFWjEWMBQGA1UELRMNWEFNQTYyMDIxMERRNTEbMBkGA1UEBRMSWEFNQTYyMDIxME1TTEtOTDA0MR0wGwYDVQQLExRBTEJBIFhLQVJBSkFNIE1FTkRFWjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK2HkPEtxQ+eUC6J428PU1OHXmr7cHtTlE5+Zk0eYykm1tVNivygT+kz7FTgw1b0yoFh96Xp3tXBSeAmsO+DShFFyYMB6x3lllIEmMZD5JbMaCpzyPMRzAq6850Am3/ShjigUPRorUhdLO1Yes2CyySzYlhA08fq3FmOCQ4eQmSPN7422T+Srhm6pFYaVjwS0MlskslCIi+ANqL5RWg75tNjpJzLQXPJyG0KU1AaqXgUT1e+aTn38AyNVQc30QAjiI50CTUq5MJFixoCB9vol421L7peEIAox3DRVw9H/wns9973XLedyuj5r8ZZfs4BinkVh+mykTyZE63rEv14uncCAwEAAaMdMBswDAYDVR0TAQH/BAIwADALBgNVHQ8EBAMCBsAwDQYJKoZIhvcNAQELBQADggIBAAR/KOWy29oitYdYzuGe1o+JOx/AowEJuu9S4/thFE9ugvHiceFK3cUD8v4M4/AS9D+NVrcMpJocNwpUsW/GiGFqOHNcFVnoSsaeEUMSIW949/0lCeMusR10VnpUaXmYFVYZkFV0PsDYUHna+lqmHDLwzSpfyU20UapgpkPe7Ib6/5CmsPQ7GcF7HBrshO8MyLyYSi193MTDKO86thq5iBnTrt4qyCgI7+Hpk770C4wMskpitf0Z9BUUrBxAk+ZoH1fw1ysZtK+v4vS/wquib2SK+MpvlYEfam/613EE/PEAlBTXPDaWTxporKJJxnv/iOsm97FmvRuwAnB13r5cxc/UJFjD2bFm38/2wOUG1H3srG8xhVSTKUYQjvJU+V10dQe0O/QkWx9sPHlY67CdB5SlsCBl0mkB7mA2fsPyuP28EQtEenjm48wpBXgb4exOYq4flMPZ7LpO79SmnQPSeTIt8CIlc0HomkMCl30HQzGSMoItxGSO9Rrx3ogpNNcdhpD6p59TkYd2zM7argPP/lfbl7/3EbbN5miC1JgNgRfAq02CREdMEAK9Z6ErVWUUl8gd0Tva/C3ykCJdTdNgfEI8gONS2ky/axDNDHL8d4+I6tGItfM4drtukL9Trh8/5RPuPvKHg1tKonDp50mxu4ubXBDF2LAnsOshAB44fn+r",
      "SubTotal": "5000",
      "Descuento": "0",
      "Moneda": "MXN",
      "Total": "5000",
      "TipoDeComprobante": "I",
      "MetodoPago": "PUE",
      "LugarExpedicion": "77728",
      "Emisor": {
        "Rfc": "XAMA620210DQ5",
        "Nombre": "AMIR MISAEL MARIN COH",
        "RegimenFiscal": "621"
      },
      "Receptor": {
        "Nombre": "AMIR MISAEL MARIN",
        "Rfc": "XAXX010101000",
        "UsoCFDI": "G03"
      },
      "Conceptos": {
        "Concepto": [
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
      },
      "Impuestos": {
        "TotalImpuestosTrasladados": "0.16",
        "Traslados": {
          "Traslado": [
            {
              "Base": "1",
              "Impuesto": "002",
              "TipoFactor": "Tasa",
              "TasaOCuota": "0.160000",
              "Importe": "0.16"
            }
          ]
        }
      },
      "Complemento": {
        "ImpuestosLocales": {
          "version": "1.0",
          "TotaldeRetenciones": "0.000000",
          "TotaldeTraslados": "48.000000",
          "TrasladosLocales": {
            "ImpLocTrasladado": "IMPUESTO DE HOSPEDAJE",
            "TasadeTraslado": "4",
            "Importe": "48.00"
          }
        },
        "CartaPorte": {
          "RegistroISTMO": "Sí",
          "UbicacionPoloOrigen": "01",
          "UbicacionPoloDestino": "01",
          "Version": "3.1",
          "IdCCP": "CCCBCD94-870A-4332-A52A-A52AA52AA52A",
          "TranspInternac": "No",
          "TotalDistRec": "1",
          "Ubicaciones": {
            "Ubicacion": [
              {
                "TipoUbicacion": "Origen",
                "IDUbicacion": "OR101010",
                "RFCRemitenteDestinatario": "URE180429TM6",
                "NombreRemitenteDestinatario": "NombreRemitenteDestinatario1",
                "FechaHoraSalidaLlegada": "2023-08-01T00:00:00",
                "Domicilio": {
                  "Calle": "Calle1",
                  "NumeroExterior": "211",
                  "NumeroInterior": "212",
                  "Colonia": "1957",
                  "Localidad": "13",
                  "Referencia": "casa blanca",
                  "Municipio": "011",
                  "Estado": "CMX",
                  "Pais": "MEX",
                  "CodigoPostal": "13250"
                }
              },
              {
                "TipoUbicacion": "Destino",
                "IDUbicacion": "DE202020",
                "RFCRemitenteDestinatario": "URE180429TM6",
                "NombreRemitenteDestinatario": "NombreRemitenteDestinatario2",
                "FechaHoraSalidaLlegada": "2023-08-01T00:00:01",
                "DistanciaRecorrida": "1",
                "Domicilio": {
                  "Calle": "Calle2",
                  "NumeroExterior": "214",
                  "NumeroInterior": "215",
                  "Colonia": "0347",
                  "Localidad": "23",
                  "Referencia": "casa negra",
                  "Municipio": "004",
                  "Estado": "COA",
                  "Pais": "MEX",
                  "CodigoPostal": "25350"
                }
              }
            ]
          },
          "Mercancias": {
            "PesoBrutoTotal": "1.0",
            "UnidadPeso": "XBX",
            "NumTotalMercancias": "1",
            "LogisticaInversaRecoleccionDevolucion": "Sí",
            "Mercancia": [
              {
                "FraccionArancelaria": "6309000100",
                "BienesTransp": "11121900",
                "Descripcion": "Accesorios de equipo de telefonía",
                "Cantidad": "1.0",
                "ClaveUnidad": "XBX",
                "MaterialPeligroso": "No",
                "PesoEnKg": "1",
                "DenominacionGenericaProd": "DenominacionGenericaProd1",
                "DenominacionDistintivaProd": "DenominacionDistintivaProd1",
                "Fabricante": "Fabricante1",
                "FechaCaducidad": "2003-04-02",
                "LoteMedicamento": "LoteMedic1",
                "FormaFarmaceutica": "01",
                "CondicionesEspTransp": "01",
                "RegistroSanitarioFolioAutorizacion": "RegistroSanita1",
                "CantidadTransporta": {
                  "Cantidad": "1",
                  "IDOrigen": "OR101010",
                  "IDDestino": "DE202020"
                }
              }
            ],
            "Autotransporte": {
              "PermSCT": "TPAF01",
              "NumPermisoSCT": "NumPermisoSCT1",
              "IdentificacionVehicular": {
                "ConfigVehicular": "VL",
                "PesoBrutoVehicular": "1",
                "PlacaVM": "plac892",
                "AnioModeloVM": "2020"
              },
              "Seguros": {
                "AseguraRespCivil": "AseguraRespCivil",
                "PolizaRespCivil": "123456789"
              },
              "Remolques": {
                "Remolque": [
                  {
                    "SubTipoRem": "CTR004",
                    "Placa": "VL45K98"
                  }
                ]
              }
            }
          },
          "FiguraTransporte": {
            "TiposFigura": {
              "TipoFigura": "01",
              "RFCFigura": "URE180429TM6",
              "NumLicencia": "NumLicencia1",
              "NombreFigura": "NombreFigura1",
              "Domicilio": {
                "Calle": "Calle1",
                "NumeroExterior": "NumeroExterior1",
                "NumeroInterior": "NumeroInterior1",
                "Colonia": "Colonia1",
                "Localidad": "Localidad1",
                "Referencia": "Referencia1",
                "Municipio": "Municipio1",
                "Estado": "Estado1",
                "Pais": "AFG",
                "CodigoPostal": "CodigoPosta1"
              }
            }
          }
        },
        "VehiculoUsado": {
          "Version": "1.0",
          "montoAdquisicion": "10000.00",
          "montoEnajenacion": "0.00",
          "claveVehicular": "AAAABBB",
          "marca": "FORD",
          "tipo": "Mustang",
          "modelo": "1989",
          "numeroMotor": "123123123",
          "numeroSerie": "12312323",
          "NIV": "1234ASD",
          "valor": "5000.00"
        },
        "TimbreFiscalDigital": {
          "xsi:schemaLocation": "http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd",
          "Version": "1.1",
          "UUID": "5e2d6aff-2dd7-43d1-83d3-14c1aca396d9",
          "FechaTimbrado": "2021-02-17T14:13:10",
          "RfcProvCertif": "SPR190613I52",
          "SelloCFD": "HGJg9lit0Gr54foL1tBT+h/HnpjO9WdqJJldQPKoRUYGgo27ImMBgMoyn31Kz0qOxZA2IbW7Hl5MmxKd5ImdT3nPCRlX7E7wKMUkUdLzb95DvUXl4y2jX33Cd1g65i/9YJB5ItGj8BMFq79K7Yyxm2U/Z+Txfv1zeSRkQk0HT4VyM7mCUnru55AH3OBe692c7X2AAna4eNViZBi+C7fA1zmA4NuI6qTpQdsFgEy+dkCZRFNJIBgZ6VHtcwolA5uBGPKjWyndADpiYuPLhzLWn2TQEkWXW0geGoNFfFnPukbXqQTlZyBCZiEcRfQKWCzqpv8SM4PBhnXbPR0lKTFD2g==",
          "NoCertificadoSAT": "30001000000400002495",
          "SelloSAT": "cftZzLlTrJFLWOV9hUqy7NvnTqcId5UwZxybaztZYVgFWF46rV3uCEtxN+ZPKAJOhuYZs2FJlz1e8pS1uxl4lyViSdBELqxeZMeuICf6GqwneLe0QEY39jYHvpaGFnF9AT1KyXWdO2JQIdbiH/dbX2XV498hnnUrEaJbQOl8ovb5ZebTueu4zMcj8QE9nqmEavb7PB3O0w9vvmNl4hoo6XkCvDArlW1FlJdpaFaHDnjfjt+SriyZAszwjaUFvgkgHU7MJCYh37HQd1qVLLbHeGlwiwGOhQ9vu4ziu6zZ9wpb1lPHWfVCymFTAM3LaWuUvA19cReTEgR9yHX1OcNlOg==",
          "xmlns:tfd": "http://www.sat.gob.mx/TimbreFiscalDigital",
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
        }
      }
    }); */
  });
});
