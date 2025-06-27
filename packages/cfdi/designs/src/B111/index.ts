import { PDF } from '../pdf/PDF';
import { Style } from '../pdf/Style';
import { Text } from '../pdf/Text';
import { Column } from '../pdf/Column';
import { Row } from '../pdf/Row';
import { Table } from '../pdf/Table';
import { Cell } from '../pdf/Cell';
import { logo } from '@cfdi/utils';

export default class PDFB111 {
  public pdf = new PDF();

  public design(): void {
    const table = new Table();
    table.setWidths([230, 100, 200]);

    this.pdf.setContent({
      style: 'tableExample',
      table: {
        widths: [230, 100, 200],
        body: [
          [
            {
              text: [
                {
                  text: 'Datos de la empresa\n\n\n\n',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  },
                },
                {
                  text: 'Nombre o razon social\n',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  },
                },
                {
                  text: [
                    {
                      text: 'Dirrecion\n',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: 'Telefonos\n',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: 'pagina web',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },
              ],
            },

            [
              {
                alignment: 'center',
                border: [false, false, false, true],
                table: {
                  body: [
                    [
                      {
                        image: logo,
                        width: 80,
                        height: 80,
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
            ],

            {
              style: 'tableExample',
              table: {
                headerRows: 1,
                alignment: 'center',
                border: [false, false, false, false],
                body: [
                  [
                    {
                      text: 'FACTURA',
                      alignment: 'center',
                      style: { bold: true, color: '#a76d09' },
                    },
                  ],
                  [{ text: 'F3EE54R', alignment: 'center' }],
                  [
                    {
                      text: 'FOLIO FISCAL',
                      alignment: 'center',
                      style: { bold: true, color: '#a76d09' },
                    },
                  ],

                  [
                    {
                      text: 'N° DE SERIE DE CERTIFICACION',
                      alignment: 'center',
                      style: { bold: true, color: '#a76d09' },
                    },
                  ],
                  [
                    {
                      text: 'F3EE54R',
                      alignment: 'center',
                      style: { color: 'red' },
                    },
                  ],
                  [
                    {
                      text: 'FECHA Y HORA DE CERTIFICACION',
                      alignment: 'center',
                      style: { bold: true, color: '#a76d09' },
                    },
                  ],
                  [
                    {
                      text: '18:12:12 02/07/2020',
                      alignment: 'center',
                      style: { color: 'red' },
                    },
                  ],
                ],
              },
              layout: {
                // @ts-ignore
                fillColor: function (rowIndex, node, columnIndex) {
                  return rowIndex % 2 === 0 ? '#CCCCCC' : null;
                },
              },
            },
          ],
        ],
      },
    });

    this.pdf.addContent({
      style: 'tableExample',
      table: {
        widths: [270, 269],
        body: [
          [
            {
              text: [
                {
                  text: 'Datos del Emisor\n\n',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  },
                },
                {
                  text: 'Nombre fiscal:',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  },
                },
                { text: 'nombre fiscal\n' },
                {
                  text: [
                    {
                      text: 'Rfc:',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },
                { text: 'rfc\n' },
                {
                  text: [
                    {
                      text: 'Dirección: ',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },
                { text: 'Dirrrecion\n' },
                {
                  text: [
                    {
                      text: 'Regimen fiscal:',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },
                { text: 'regimen fiscal\n' },
              ],
            },
            {
              text: [
                {
                  text: 'Datos del Cliente\n\n',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  },
                },
                {
                  text: 'Nombre Fiscal: ',
                  style: {
                    bold: true,
                    color: '#a76d09',
                  },
                },

                { text: 'nombre fiscal\n' },
                {
                  text: [
                    {
                      text: 'Rfc:',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },

                { text: 'Rfc\n' },
                {
                  text: [
                    {
                      text: 'Dirección:',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },

                { text: 'Dirrecion\n' },
                {
                  text: [
                    {
                      text: 'Regimen Fiscal:',
                      style: {
                        bold: true,
                        color: '#a76d09',
                      },
                    },
                  ],
                },

                { text: 'regimen fiscal\n' },
              ],
            },
          ],
        ],
      },
    });

    this.pdf.addContent({
      style: 'tableExample',
      table: {
        widths: [50, 40, 173, 120, 60, 60],
        body: [
          [
            {
              text: 'cantidad',
              fillColor: '#dddddd',
              border: [true, true, true, true],
            },
            {
              text: 'Unidad',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [true, true, true, true],
            },
            {
              text: 'descricion',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [true, true, true, true],
            },
            {
              text: 'Clave servicio/producto',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [true, true, true, true],
            },
            {
              text: 'Precio Unitario',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [true, true, true, true],
            },
            {
              text: 'Importe',
              style: 'tableHeader',
              fillColor: '#dddddd',
              border: [true, true, true, true],
            },
          ],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
          ['1', 'cat', 'nomina', 'servicio', '19891', '090'],
        ],
      },
    })

     this.pdf.addContent({
      table: {
        widths: [99, 302, 129],
        
        body: [
          [
            {
              alignment: 'center',

              table: {
                body: [
                  [
                    {
                      image: logo,
                      width: 50,
                      height: 50,
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
            {
              text: 'Cantidad con letras:\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
            },
            {
              style: 'tableExample',
              table: {
                alignment: 'center',
                body: [
                  [
                    { text: 'Subtotal', alignment: 'center' },
                    { text: 'FACTURA', alignment: 'center' },
                  ],
                  [
                    { text: 'Descuento', alignment: 'center' },
                    { text: 'F3EE54R', alignment: 'center' },
                  ],
                  [
                    { text: 'I.V.A 16%', alignment: 'center' },
                    { text: 'F3EE54R', alignment: 'center' },
                  ],
                  [
                    { text: 'Total', alignment: 'center' },
                    { text: 'F3EE54R', alignment: 'center' },
                  ],
                ],
              },
            },
          ],
        ],
      },
    }); 

      this.pdf.addContent( {
        style: 'tableExample',
        table: {
          widths: [548],
          body: [
            [
              {
                text: [
                  {
                    text: 'SELLO DIGITAL\n',
                    style: {
                      bold: true,
                      color: '#0941a7',
                    },
                  },
                  {
                    text: 'aYjYNUhTvNVosLnPJsV5h/lAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MGuv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8=`,\n\n',
                  },
                  {
                    text: 'SELLO SAT\n',
                    style: {
                      bold: true,
                      color: '#0941a7',
                    },
                  },
                  {
                    text: 'GlU7AYil3GqVeUD9oJvqVKc2Uq/K2R7lkc2m6WPuhddjYvWm0foFfMVwzn2KfS7o6KZIddDXdAglhknZsz3ub3X0/aPW4DSwvDYXOF2yCCqd64vbt5MfWqpPqN2zmjzJVFe5ntIPQ21jveXAjR44pJIHNG3rUUUdhVnag6NFTqviaAV75z6OywesoMQCFcsoEjvKozzKGpT7Imuoa94aGIhj0TP5m1hk4OnROOcEBPo11mPf4elDKBDzk+iuCw4wiV/GHaeL0D4zBcVOL/Igz12MKRmYtNdmBfSCv3TI7bJ7qQUV1RckO2Rj1CpFrpa7xr/Vw6lEwitpkCwQ00SKBg==\n\n',
                  },
                  {
                    text: [
                      {
                        text: 'CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACION DIGITAL DEL SAT\n',
                        style: {
                          bold: true,
                          color: '#0941a7',
                        },
                      },
                    ],
                  },
                  {
                    text:
                      '||1.1|5D178E7E-C81C-11E8-89A8-237CD11664D5|2018-10-04T16:27:58|FMO1007168C6|eaYjYNUhTvNVosLnPJsV5h/xlAW/HSs45Qzhl2W5V2DPqrdoFfp9mH7wUcS5v3jP6Oql4Y7ncYOcLqakqfGeclJJP/6T1XmbcvPPdBq1DGWh6DaisHS2QCMOW3MG\n' +
                      'uv8Hc/0j7JwYbXFpTKKM3cudwTmzh76MUoqnssDUfuFIVJ8=|00001000000401477845||',
                  },
                ],
              },
            ],
          ],
        },
      }) 
  }

  public getPDF(): PDF {
    return this.pdf;
  }
}
