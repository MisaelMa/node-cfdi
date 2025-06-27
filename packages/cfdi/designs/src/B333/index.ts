import { PDF } from '../pdf/PDF';
import { Style } from '../pdf/Style';
import { Text } from '../pdf/Text';
import { Column } from '../pdf/Column';
import { Row } from '../pdf/Row';
import { Table } from '../pdf/Table';
import { Cell } from '../pdf/Cell';
import { logo } from '@cfdi/utils';
export default class PDFB333 {
  public pdf = new PDF();

  public design(): void {
  
    this.pdf.setContent(

      {
        style: 'tableExample',
        table: {
          widths: ['*', 'auto'],
          body: [
            [{
              columns: [
                {
                  width: 100,
                  image: logo,
                  height: 100,
                  alignment: 'left'
                },
                {
                  width: 50,
                  text: ''
                },
                {
                  margin: [0, 0, 0, 0],
                  width: 243,
                  text: [

                    {
                      text: [
                        {
                          text: 'NOMBRE O RAZON SOCIAL DE LA EMPRESA\n\n ',
                          style: {
                            bold: true,
                            color: '#a76d09',
                          }
                        },

                      ]
                    },
                    {
                      text: [
                        {
                          text: 'DOMICILIO FISCAL:\n',
                          style: {
                            bold: true,
                            color: '#a76d09',
                            fontSize: 10,

                          }
                        },
                        { fontSize: 10, text: ' av oquideas entre ruta5\nCANCUN QUINTANRRO\n ' }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'RFC:\n',
                          style: {
                            fontSize: 10,

                            bold: true,
                            color: '#a76d09',
                          }
                        },
                        { text: ' 98765436899\n', fontSize: 10, }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'REGIMEN FISCAL:\n',
                          style: {
                            bold: true,
                            color: '#a76d09',
                            fontSize: 10,

                          }
                        },
                        { text: '601 General  de ley de personas morales\n', fontSize: 10, }
                      ]
                    },
                  ]
                },
              ]
            },

            {
              margin: [0, 0, 0, 0],
              width: 243,
              text: [

                {
                  text: [
                    {
                      text: 'FACTURA\n ',
                      style: {
                        alignment: 'center',
                        bold: true,
                        color: '#a76d09',
                        fontSize: 10
                      }
                    },

                  ]
                },
                {
                  text: [
                    {
                      text: 'Tipo De Comprobante:        ',
                      style: {
                        bold: true,
                        color: '#a76d09',
                        fontSize: 8
                      }
                    },
                    { fontSize: 8, text: ' Ingreso\n' }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Fecha:        ',
                      style: {
                        fontSize: 8,
                        bold: true,
                        color: '#a76d09',
                      }
                    },
                    { fontSize: 8, text: ' 2020/07/08 13:28:12\n' }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Lugar de expedicon:\n',
                      style: {
                        fontSize: 8,
                        bold: true,
                        color: '#a76d09',
                      }
                    },
                    { fontSize: 8, text: 'Playa del carmen, solidaridad,quintan Roo\n' }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Forma De Pago:\n',
                      style: {
                        fontSize: 8,
                        bold: true,
                        color: '#a76d09',
                      }
                    },
                    { fontSize: 8, text: 'Pago en una sola Exhibicion\n' }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Metodo de pago:\n',
                      style: {
                        fontSize: 8,
                        bold: true,
                        color: '#a76d09',
                      }
                    },
                    { fontSize: 8, text: 'Tranferencia electronica\n' }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Forma de pago Sat:',
                      style: {
                        fontSize: 8,
                        bold: true,
                        color: '#a76d09',
                      }
                    },
                    { fontSize: 8, text: '\n' }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Uso CFDI:',
                      style: {
                        fontSize: 8,
                        bold: true,
                        color: '#a76d09',
                      }
                    },
                    { fontSize: 8, text: '\n' }
                  ]
                },


              ]
            },],
          ]
        }
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [546],

          body: [

            [{ text: 'Facturado a: (   1)  Industrial azteca s.a  de cv', fillColor: '#eeeeee', border: [true, true, true, true] }],
            [{
              margin: [0, 0, 0, 0],
              width: 243,
              text: [

                {
                  text: [


                    { text: '\nCalle: avenida granjas no 17 entre san sebastian \n' },
                    {
                      text: [
                        {
                          text: 'RFC:',
                          style: {
                            bold: true,
                            color: '#a76d09',
                          }
                        },
                        { text: 'JACE34567MJ5\n' }
                      ]
                    },


                  ]
                },
              ],
            }

            ]
          ]
        },
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [546],

          body: [

            [{ text: 'Enviar a:', fillColor: '#eeeeee', border: [true, true, true, true] }],
            [{
              margin: [0, 0, 0, 0],
              width: 243,
              text: [

                {
                  text: [


                    { text: '\nCalle: avenida granjas no 17 entre san sebastian \n' },
                    {
                      text: [
                        {
                          text: 'RFC:',
                          style: {

                            bold: true,
                            color: '#a76d09',
                          }
                        },
                        { text: 'JACE34567MJ5\n' }
                      ]
                    },


                  ]
                },
              ],
            }

            ]
          ]
        },
      }).addContent(
      {

        text: '\n'
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [50, 40, 162, 120, 70, 60],

          body: [

            [{ fontSize: 10, text: 'cantidad', border: [true, true, false, true], fillColor: '#eeeeee', }, { fontSize: 10, text: 'Unidad', style: 'tableHeader', fillColor: '#eeeeee', border: [false, true, false, true] }, { fontSize: 10, text: 'descricion', fillColor: '#eeeeee', style: 'tableHeader', border: [false, true, false, true] }, { fontSize: 10, text: 'Clave servicio/producto', style: 'tableHeader', fillColor: '#eeeeee', border: [false, true, false, true] }, { fontSize: 10, text: 'Precio Unitario', style: 'tableHeader', fillColor: '#eeeeee', border: [false, true, false, true] }, { fontSize: 10, text: 'Importe', style: 'tableHeader', fillColor: '#eeeeee', border: [false, true, true, true] }],
            [{ alignment: 'center', text: '1', border: [false, true, false, true] }, { text: 'lt', style: 'tableHeader', border: [false, true, false, true] }, { text: 'juete de niña', style: 'tableHeader', border: [false, true, false, true] }, { text: 'Clave servicio/producto', style: 'tableHeader', border: [false, true, false, true] }, { text: 'Precio Unitario', style: 'tableHeader', border: [false, true, false, true] }, { text: 'Importe', style: 'tableHeader', border: [false, true, false, true] }],
            [{ alignment: 'center', text: '1', border: [false, true, false, true] }, { text: 'lt', style: 'tableHeader', border: [false, true, false, true] }, { text: 'juete de niña', style: 'tableHeader', border: [false, true, false, true] }, { text: 'Clave servicio/producto', style: 'tableHeader', border: [false, true, false, true] }, { text: 'Precio Unitario', style: 'tableHeader', border: [false, true, false, true] }, { text: 'Importe', style: 'tableHeader', border: [false, true, false, true] }],
          ]

        },


      }).addContent(
      {
        margin: [0, 7, 0, 7],
        table: {

          widths: ['auto', '*', 'auto'],
          body: [
            [
              {
                border: [false, false, false, false],
                alignment: 'center',

                table: {
                  body: [
                    [

                      {
                        image: logo,
                        width: 100,
                        height: 100,
                      },


                    ],
                  ]
                },
                layout: 'noBorders'
              },
              {
                border: [false, false, false, false],
                style: 'tableExample',
                table: {


                  body: [

                    [{ text: 'Cantidad con Letras', fillColor: '#eeeeee', border: [true, true, true, true] }],
                    [{
                      margin: [0, 0, 0, 0],
                      width: 243,
                      text: [

                        {
                          text: [


                            { text: '\nOCHOCIENTOS TREINTA Y NUEVE PESOS 99/100 M.N.\n\n' },



                          ]
                        },
                      ],
                    }

                    ]
                  ]
                },
              },

              {
                border: [false, false, false, false],
                style: 'tableExample',
                table: {
                  headerRows: 1,
                  alignment: 'center',
                  body: [
                    [{ text: 'Subtotal', alignment: 'center', }, { text: 'FACTURA', alignment: 'center' }],
                    [{ text: 'Descuento', alignment: 'center' }, { text: 'F3EE54R', alignment: 'center' }],
                    [{ text: 'I.V.A 16%', alignment: 'center' }, { text: 'F3EE54R', alignment: 'center' }],
                    [{ text: 'Total', alignment: 'center' }, { text: 'F3EE54R', alignment: 'center' }],


                  ]
                },
                layout: 'lightHorizontalLines'

              }
            ],
          ]
        }
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [546],

          body: [

            [{ text: 'Este Documento es una Representacion Impresa de un CFDI', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }],

          ]
        },
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [81, 143, 155, 140],

          body: [

            [{ text: 'Folio Fiscal:', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }, { text: 'xxxxxxxxxxxxxxxx', border: [true, true, true, true] }, { text: 'Fecha y Hora de Expedicon', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }, { text: '08/07/2020 17:16:10', border: [true, true, true, true] }],

          ]
        },
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [546],

          body: [

            [{ text: 'Sello Digital del CFDI', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }],
            [{
              margin: [0, 0, 0, 0],
              width: 243,
              text: [

                {
                  alignment: 'justify',
                  text: [


                    { text: 'eaYjYNUhTvNVosLnPJsV5h/xlAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MGuv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8= \n' },



                  ]
                },
              ],
            }

            ]
          ]
        },
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [270, 267],

          body: [

            [{ fontSize: 10, text: 'Numero de Serie del Certificado de Sello Digital', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }, { fontSize: 10, text: 'Numero de Serie del Certificado de Sello Digital del Sat', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] },],
            [{ text: 'xxxxxxxxxxxxxxxx', alignment: 'center', border: [true, true, true, true] }, { text: 'xxxxxxxxxxxxxx', alignment: 'center', border: [true, true, true, true] }]
          ]
        },
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [546],

          body: [

            [{ text: 'Cadena Orginal del Complemento de Certificacion Digital del SAT', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }],
            [{
              margin: [0, 0, 0, 0],
              width: 243,
              text: [

                {
                  alignment: 'justify',
                  text: [


                    { text: 'eaYjYNUhTvNVosLnPJsV5h/xlAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MGuv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8= \n' },



                  ]
                },
              ],
            }

            ]
          ]
        },
      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [546],

          body: [

            [{ text: 'Sello Digital del SAT', alignment: 'center', fillColor: '#eeeeee', border: [true, true, true, true] }],
            [{
              margin: [0, 0, 0, 0],
              width: 243,
              text: [

                {
                  alignment: 'justify',
                  text: [


                    { text: 'eaYjYNUhTvNVosLnPJsV5h/xlAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MGuv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8= \n' },



                  ]
                },
              ],
            }

            ]
          ]
        },
      })

    }

    public getPDF(): PDF {
      return this.pdf;
    }
  }
  
  
