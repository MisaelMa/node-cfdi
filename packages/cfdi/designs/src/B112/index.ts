import { PDF } from '../pdf/PDF';
import { Style } from '../pdf/Style';
import { Text } from '../pdf/Text';
import { Column } from '../pdf/Column';
import { Row } from '../pdf/Row';
import { Table } from '../pdf/Table';
import { Cell } from '../pdf/Cell';
import { logo } from '@cfdi/utils';
export default class PDFB112 {
  public pdf = new PDF();

  public design(): void {

    this.pdf.setContent({


      style: 'tableExample',
      table: {

        widths: [545],
        body: [
          [
            {
              border: [false, false, false, false],
              fillColor: '#000080',
              text: [

                {
                  alignment: 'center',
                  text: 'FACTURA ELECTRÓNICA (CFDI)',
                  style: {
                    bold: true,
                    color: '#00FFFF',
                    fontSize: 13,
                  }
                },

              ]
            }
          ]
        ]
      }
    })



 this.pdf.addContent(

    {

      style: 'tableExample',
      table: {

        widths: [545],
        body: [
          [
            {
              border: [false, false, false, false],
              text: [

                {
                  alignment: 'left',
                  text: '\nNOMBRE O RAZON SOCIAL DE LA EMPRESA',
                  style: {
                    bold: true,
                    fontSize: 12,
                  }
                },

              ]
            }
          ]
        ]
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
          width: 20,
          text: ''
        },
        {
          margin: [0, 0, 0, 0],
          width: 243,
          text: [

            {
              text: [
                {
                  text: 'R.F.C:\n ',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  }
                },
                { text: ' GUCE910701NHA\n' }
              ]
            },
            {
              text: [
                {
                  text: 'Dirrecion:\n',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  }
                },
                { text: ' av oquideas entre ruta5\n' }
              ]
            },
            {
              text: [
                {
                  text: 'Telefono:\n',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  }
                },
                { text: ' 98765436899\n' }
              ]
            },
          ]
        },
        {
          width: 500,

          style: 'tableExample',
          table: {
            body: [
              [{ text: 'FACTURA', alignment: 'right', style: { bold: true, color: '#a76d09' } }],
              [{ text: 'F3EE54R', alignment: 'right' }],
              [{ text: 'FOLIO FISCAL', alignment: 'right', style: { bold: true, color: '#a76d09' } }],
              [{ text: 'XXXXXXXXXX', alignment: 'right' }],
              [{ text: 'N° DE SERIE DE CERTIFICACION', alignment: 'right', style: { bold: true, color: '#a76d09' } }],
              [{ text: 'XXXXXXXXX', alignment: 'right' }],
              [{ text: 'FECHA Y HORA DE CERTIFICACION', alignment: 'right', style: { bold: true, color: '#a76d09' } }],
              [{ text: '18:12:12 02/07/2020', alignment: 'right' }],
            ]
          },
          layout: 'noBorders'
        },


      ]
    }).addContent(
    {
      style: 'tableExample',
      table: {

        body: [
          [
            {
              border: [false, false, false, false],
              style: { bold: true, color: '#a76d09' },
              text: 'Lugar de Expedicion: '
            },
            {
              border: [false, false, false, false],

              text: 'solidaridad,playa del carmen  '
            },
          ]
        ]
      }
    }).addContent(

    {

      style: 'tableExample',
      table: {

        widths: [545],
        body: [
          [
            {
              border: [false, true, false, false],
              text: [
                {
                  border: [false, true, false, false],
                  linecolors: '#000080',
                  style: { bold: true, color: '#a76d09' },
                  text: 'Receptor: '
                },
                {
                  border: [false, false, false, false],
                  text: 'PEMEX GAS Y PETROQUIMICA BASICA\n  '
                },
                {
                  border: [false, false, false, false],
                  linecolors: '#000080',
                  style: { bold: true, color: '#a76d09' },
                  text: 'RFC del Clinete: '
                },
                {
                  border: [false, false, false, false],
                  text: 'PGP920716MT6\n  '
                },
                {
                  border: [false, false, false, false],
                  linecolors: '#000080',
                  style: { bold: true, color: '#a76d09' },
                  text: 'Dirrecion: '
                },
                {
                  border: [false, false, false, false],
                  text: 'AVENIDA MARINA NACIONAL 329 PETROLEOS MEXICANOS,Distrito Federal C.P. 86125, México \n'
                },
                {
                  border: [false, false, false, false],
                  linecolors: '#000080',
                  style: { bold: true, color: '#a76d09' },
                  text: 'Telefono: '
                },
                {
                  border: [false, false, false, false],
                  text: '9890808090 \n'
                },
              ]
            }
          ]
        ]
      }
    }).addContent(
    {
      style: 'tableExample',
      table: {
        widths: [50, 40, 173, 120, 60, 60],
        headerRows: 1,
        body: [

          [{ text: 'cantidad', fillColor: '#dddddd', border: [true, true, true, true] }, { text: 'Unidad', style: 'tableHeader', fillColor: '#dddddd', border: [true, true, true, true] }, { text: 'descricion', style: 'tableHeader', fillColor: '#dddddd', border: [true, true, true, true] }, { text: 'Clave servicio/producto', style: 'tableHeader', fillColor: '#dddddd', border: [true, true, true, true] }, { text: 'Precio Unitario', style: 'tableHeader', fillColor: '#dddddd', border: [true, true, true, true] }, { text: 'Importe', style: 'tableHeader', fillColor: '#dddddd', border: [true, true, true, true] }],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],

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
              stack: [
                {
                  text: 'CANTIDAD CON LETRA',
                  style: {
                    bold: true,
                    fontSize: 9
                  }
                },
                {
                  text: 'OCHOCIENTOS TREINTA Y NUEVE PESOS 99/100 M.N.\n\n',
                  style: {
                    fontSize: 9
                  }
                },
                {
                  text: 'METODO DE PAGO',
                  style: {
                    bold: true,
                    fontSize: 9
                  }
                },
                {
                  text: 'NO INDENTIFICADO\n',
                  style: {
                    fontSize: 9
                  }
                },
                {
                  text: 'REGIMEN',
                  style: {
                    bold: true,
                    fontSize: 9
                  }
                },
                {
                  text: 'PERSONA MORAL',
                  style: {
                    fontSize: 9
                  }
                }
              ]
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
        widths: [548],

        body: [
          [{
            border: [false, false, false, false],
            text: [

              {
                text: 'SELLO DIGITAL\n',
                style: {
                  bold: true,
                  color: '#0941a7',
                  fontSize: 10,
                }
              },
              { fontSize: 10, text: 'aYjYNUhTvNVosLnPJsV5h/lAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MGuv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8=`,\n\n' },
              {
                text: 'SELLO SAT\n',
                style: {
                  fontSize: 10,
                  bold: true,
                  color: '#0941a7',
                }

              },
              { fontSize: 10, text: 'GlU7AYil3GqVeUD9oJvqVKc2Uq/K2R7lkc2m6WPuhddjYvWm0foFfMVwzn2KfS7o6KZIddDXdAglhknZsz3ub3X0/aPW4DSwvDYXOF2yCCqd64vbt5MfWqpPqN2zmjzJVFe5ntIPQ21jveXAjR44pJIHNG3rUUUdhVnag6NFTqviaAV75z6OywesoMQCFcsoEjvKozzKGpT7Imuoa94aGIhj0TP5m1hk4OnROOcEBPo11mPf4elDKBDzk+iuCw4wiV/GHaeL0D4zBcVOL/Igz12MKRmYtNdmBfSCv3TI7bJ7qQUV1RckO2Rj1CpFrpa7xr/Vw6lEwitpkCwQ00SKBg==\n\n' },
              {
                text: [
                  {
                    text: 'CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACION DIGITAL DEL SAT\n',
                    style: {
                      bold: true,
                      color: '#0941a7',
                      fontSize: 10,
                    }
                  },
                ]
              },
              {
                fontSize: 10, text: '||1.1|5D178E7E-C81C-11E8-89A8-237CD11664D5|2018-10-04T16:27:58|FMO1007168C6|eaYjYNUhTvNVosLnPJsV5h/xlAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MG\n' +
                  'uv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8=|00001000000401477845||'
              },


            ]
          },
          ]
        ]
      }
    }).addContent(
    {

      style: 'tableExample',
      table: {

        widths: [548],

        body: [
          [
            {
              border: [false, false, false, true],
              alignment: 'center',
              text: [
                {
                  border: [false, false, true, false],
                  linecolors: '#000080',
                  style: { fontSize: 10, bold: true, color: '#a76d09' },
                  text: ' N° DE SERIE DE CERTIFICACION:',
                },
                {
                  border: [false, false, false, false],
                  fontSize: 10,
                  text: 'XXXXXXXXX\n  '
                },
                {
                  border: [false, false, false, false],
                  linecolors: '#000080',
                  style: { fontSize: 10, bold: true, color: '#a76d09' },
                  text: 'FECHA Y HORA DE CERTIFICACION:'
                },
                {
                  border: [false, false, false, false],
                  fontSize: 10,
                  text: '03/07/2020\n  '
                },
              ]
            }
          ]
        ]
      }
    }).addContent(
    {
      style: 'tableExample',
      table: {
        widths: [180, 200, 150],
        headerRows: 1,
        body: [

          [{ text: ' PAGO EN UNA SOLA EXHIBICION', fontSize: 7, alignment: 'left', border: [false, false, false, false] },
          { text: 'Esta es una representación impresa de un CFDI', fontSize: 7, alignment: 'center', border: [false, false, false, false] },
          { text: 'Efectos fscales al pago', fontSize: 7, alignment: 'right', border: [false, false, false, false] }]


        ]
      },


    })
  }

  public getPDF(): PDF {
    return this.pdf;
  }
}
