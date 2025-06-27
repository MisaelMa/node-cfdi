import { PDF } from '../pdf/PDF';
import { Style } from '../pdf/Style';
import { Text } from '../pdf/Text';
import { Column } from '../pdf/Column';
import { Row } from '../pdf/Row';
import { Table } from '../pdf/Table';
import { Cell } from '../pdf/Cell';
import { logo } from '@cfdi/utils';
export default class PDFB123 {
  public pdf = new PDF();
  public design(): void {
 
    this.pdf.setContent({
        columns: [
          {
            text: [
              {
                text: 'Folio Fiscal',
                style: {
                  bold: true,
                  color: '#a76d09',
                }
              },
              { text: 'foliofiscal\n' },

            ]
          },


          {
            text: [
              {
                alignment: 'right',
                text: '098675 ',
                style: {
                  bold: true,
                  color: '#a76d09',
                }

              },


            ]
          }
        ]
      }).addContent(

      {
        columns: [
          {
            text: [
              {
                text: 'No. CSD del Emisor:',
                style: {
                  bold: true,
                  color: '#a76d09',
                }
              },
              { text: 'No. CSD del Emisor:\n' },

            ]
          },


          {
            text: [
              {
                alignment: 'right',
                text: 'palya del carmen ',
                style: {
                  bold: true,
                  color: '#a76d09',
                }

              },


            ]
          }
        ]
      }).addContent(
      {
        alignment: 'right',
        text: 'hora',
        style: {
          bold: true,
          color: '#a76d09',
        }

      }).addContent(
      {
        columns: [
          {
            width: 100,
            image: logo,
            height: 100,
            alignment: 'left'
          },
          {
            width: 40,
            text: ''
          },
          {
            margin: [0, 0, 0, 0],
            width: 200,
            text: [
              {
                text: 'Nombre Razon social empresa\n',
                style: {
                  bold: true,
                  color: '#a76d09',
                },


              },
              {
                text: [
                  {
                    text: 'R.F.C: ',
                    style: {
                      bold: true,
                      color: '#a76d09',
                    }
                  },
                  { text: 'rfc empresa\n' },

                ]
              },

              {
                text: [
                  {
                    text: 'Domicilio empresa: ',
                    style: {
                      bold: true,
                      color: '#a76d09',
                    }
                  },
                  { text: ' MZA 026 LOTE 003 EJIDO PLAYA DEL CARMEN, QROO, ENTRE CALLE 74 NORTE Y CALLE 72 NORTE, 77710\n' }

                ]
              },
              {
                text: [
                  {
                    text: 'Cliente: ',
                    style: {
                      bold: true,
                      color: '#a76d09',
                    }
                  },
                  { text: ' jose alberto\n' }
                ]
              },
              {
                text: [
                  {
                    text: 'Rfc cliente ',
                    style: {
                      bold: true,
                      color: '#a76d09',
                    }
                  },
                  { text: ' rfcjose\n' }
                ]
              },
              {
                text: [
                  {
                    text: 'domicilio cliente: ',
                    style: {
                      bold: true,
                      color: '#a76d09',
                    }
                  },
                  { text: ' Avenida ordieas\n' }
                ]
              }
            ],
            style: {
              fontSize: 9,
            }
          },
        ],

      }).addContent(
      {
        style: 'tableExample',
        table: {
          widths: [50, 40, 180, 120, 60, 60],
          headerRows: 1,
          body: [

            [{
              text: 'cantidad',
              fillColor: '#dddddd',
              border: [false, false, false, false]
            }, {
              text: 'Unidad',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [false, false, false, false]
            }, {
              text: 'descricion',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [false, false, false, false]
            }, {
              text: 'Clave servicio/producto',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [false, false, false, false]
            }, {
              text: 'Precio Unitario',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [false, false, false, false]
            }, {
              text: 'Importe',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [false, false, false, false]
            }],
            ['1', 'cat', 'nomina', 'servicio', '19891', '090'],

          ]
        },
        layout: 'noBorders'

      }).addContent(
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [250, 200, 60],
          headerRows: 1,
          // keepWithHeaderRows: 1,
          body: [

            [
              {
                text: 'Cantidad con letras:\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
                border: [false, true, false, false]
              },
              {


                text: 'Subtotal:',
                style: 'tableHeader',
                border: [false, true, false, false],
                alignment: 'center'


              },
              {
                text: '090',
                style: 'tableHeader',
                border: [false, true, false, false],
                alignment: 'center'
              }
            ],

          ]
        }
      }).addContent(
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [250, 200, 60],
          headerRows: 1,
          // keepWithHeaderRows: 1,
          body: [

            [
              {
                text: 'Cantidad con letras:\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
                border: [false, false, false, false]
              },
              {
                border: [false, true, false, true],
                text: [


                  {
                    text: 'DESCUENTO:\n ',
                    style: 'tableHeader',

                  },

                  {
                    text: 'IMPUESTOS:\n ',
                    style: 'tableHeader',
                  },

                  {
                    text: 'TOTAL: ',
                    style: 'tableHeader',
                  },
                ],
                style: {
                  fontSize: 9
                }
              },
              {
                border: [false, true, false, true],
                text: [


                  { text: ' $ 310.35\n', style: 'tableHeader', },
                  { text: ' $ 115.86\n', style: 'tableHeader', },
                  { text: ' $ 839.99', style: 'tableHeader', }
                ],
                style: {
                  fontSize: 9
                }
              }
            ],
          ]
        }
      }).addContent(
      {
        alignment: 'justify',

        columns: [

          {


            style: 'tableExample',
            fontSize: 9,
            table: {
              widths: [410, 200],
              headerRows: 1,
              body: [
                [{ text: '', style: 'tableHeader', border: [false, false, false, false] }, {
                  text: '',
                  style: 'tableHeader',
                  border: [false, false, false, false]
                }],
                ['', '',],
              ],


            },
            layout: 'noBorders'
          },


        ]
      }).addContent(
      {
        alignment: 'justify',

        columns: [

          {
            width: 430,
            fontSize: 9,
            table: {
              widths: [410, 200],
              headerRows: 1,
              body: [
                [{
                  text: 'SELLO DIGITAL DEL EMISOR',
                  color: '#0941a7',
                  alignment: 'justify',
                  style: 'tableHeader',
                  border: [false, false, false, false]
                }],
                ['aYjYNUhTvNVosLnPJsV5h/lAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MGuv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8=`,'],
                [{
                  text: 'SELLO SAT',
                  color: '#0941a7',
                  style: 'tableHeader',
                  border: [false, false, false, false]
                }],
                ['GlU7AYil3GqVeUD9oJvqVKc2Uq/K2R7lkc2m6WPuhddjYvWm0foFfMVwzn2KfS7o6KZIddDXdAglhknZsz3ub3X0/aPW4DSwvDYXOF2yCCqd64vbt5MfWqpPqN2zmjzJVFe5ntIPQ21jveXAjR44pJIHNG3rUUUdhVnag6NFTqviaAV75z6OywesoMQCFcsoEjvKozzKGpT7Imuoa94aGIhj0TP5m1hk4OnROOcEBPo11mPf4elDKBDzk+iuCw4wiV/GHaeL0D4zBcVOL/Igz12MKRmYtNdmBfSCv3TI7bJ7qQUV1RckO2Rj1CpFrpa7xr/Vw6lEwitpkCwQ00SKBg==',],
                [{
                  text: 'CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACION DIGITAL DEL SAT',
                  color: '#0941a7',
                  style: 'tableHeader',
                  border: [false, false, false, false]
                }],
                ['||1.1|5D178E7E-C81C-11E8-89A8-237CD11664D5|2018-10-04T16:27:58|FMO1007168C6|eaYjYNUhTvNVosLnPJsV5h/xlAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MG\n' +
                  'uv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8=|00001000000401477845||',],
              ]

            },
            layout: 'noBorders'
          },
          {
            stack: [
              {
                image: logo,
                width: 100,
                height: 100
              },
              {
                text: [
                  {
                    text: 'Fecha y hora de certificacion\n',
                    style: {
                      bold: true,
                      color: '#a76d09',
                    }
                  },
                  { text: 'fechay horal\n' },

                ]
              }
            ]
          },
        ]
      })
  }
  public getPDF(): PDF {
    return this.pdf;
  }
}
