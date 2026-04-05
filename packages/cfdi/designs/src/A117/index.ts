import { Column } from '../pdf/Column';
import { PDF } from '../pdf/PDF';
import { Row } from '../pdf/Row';
import { Style } from '../pdf/Style';
import { Image } from '../pdf/Image';
import { Text } from '../pdf/Text';
import { Table } from '../pdf/Table';
import { Cell } from '../pdf/Cell';
import { logo} from '@cfdi/utils'
export  default class PDF117 {
  public pdf = new PDF();
  public design() {
    const row = new Row()
      .setGap(10)
      .addColumn(
        new Column({
          mode: 'stack',
          children: new Image(logo)
            .setHeight(100)
            .setWidth(100)
            .setAlignment('left')
            .toJSON(),
        })
      )
   .addColumn(new Column({ children: '', width: 40 }))
      .addColumn(
        new Column({ width: 200 })
          .setContent({
            text: 'HERRERIA & ELECTRICOS S DE CV\n',
            style: {
              bold: true,
              color: '#a76d09',
            },
          })
          .setContent({
            text: [
              {
                text: 'R.F.C: ',
                style: {
                  bold: true,
                  color: '#a76d09',
                },
              },
              { text: 'H&E951128469\n' },
            ],
          })
          .setContent({
            text: [
              {
                text: 'REGIMEN: ',
                style: {
                  bold: true,
                  color: '#a76d09',
                },
              },
              { text: '601 - GENERAL DE LEY PERSONAS MORALES\n' },
            ],
          })
          .setContent({
            text: [
              {
                text: 'LUGAR DE EXPEDICION: ',
                style: {
                  bold: true,
                  color: '#a76d09',
                },
              },
              {
                text: 'CONSTITUYENTES y 115 AV MZA.25 LT.2 Y 3, EJIDO NORTE, 77714 PLAYA DEL CARMEN, Q.R.\n',
              },
            ],
          })
          .setStyle(new Style({ fontSize: 9, color: '#a76d09' }))
      )
          .addColumn(
        new Column({ width: 200, mode: 'stack' }).setContent([
          {
            alignment: 'center',
            margin: [100, 0, 0, 0],
            text: 'FACTURA',
            style: {
              fontSize: 9,
              bold: true,
              color: '#FF5733',
            },
          },
          {
            margin: [80, 0, 0, 10],
            alignment: 'center',
            width: 10,
            table: {
              body: [
                [
                  {
                    text: 'FOLIO',
                    style: {
                      bold: true,
                      fontSize: 9,
                      alignment: 'center',
                      color: '#a76d09',
                      margin: [0, 0, 0, 0],
                    },
                  },
                ],
                [
                  {
                    text: 'A - MYLF-26',
                  },
                ],
              ],
            },
            layout: {
              // @ts-ignore
              paddingLeft: (i: any, node: any) => {
                return 20;
              },
              // @ts-ignore
              paddingRight: (i: any, node: any) => {
                return 20;
              },
              // @ts-ignore
              paddingTop: (i: any, node: any) => {
                return 0;
              },
              // @ts-ignore
              paddingBottom: (i: any, node: any) => {
                return 0;
              },
              // @ts-ignore
              fillColor: (rowIndex: number, node: any, columnIndex: any) => {
                return rowIndex === 0 ? '#eeeeee' : null;
              },
            },
          },
          {
            alignment: 'center',
            margin: [80, 0, 0, 0],
            table: {
              heights: 10,
              body: [
                [
                  {
                    text: 'FECHA',
                    style: {
                      bold: true,
                      fontSize: 9,
                      alignment: 'center',
                      margin: [0, 0, 0, 0],
                    },
                  },
                ],
                [
                  {
                    text: '2022-02-26T06:06:26',
                  },
                ],
              ],
            },
            layout: {
              // @ts-ignore
              paddingTop: (i: any, node: any) => {
                return 0;
              },
              // @ts-ignore
              paddingBottom: (i: any, node: any) => {
                return 0;
              },
              // @ts-ignore
              fillColor: (rowIndex: number, node: any, columnIndex: any) => {
                return rowIndex === 0 ? '#eeeeee' : null;
              },
            },
          },
        ])
      ); 

    const styleInfo = new Style({ bold: true, color: 'purple' });
    const styleLabel = new Style({ bold: true, color: '#a76d09' });

    const text = new Text('Datos del Cliente\n')
      .setBold(true)
      .setMargin([0, 20, 0, 10])
      .setStyle(new Style({ fontSize: 10, color: '#0941a7' }))
      .addText('Razon Social: ', styleLabel)
      .addText('PUBLIC EN GENERAL\n', styleInfo)
      .addText('R.F.C.: ', styleLabel)
      .addText('XAXX010101000\n', styleInfo)
      .addText('Uso CFDI: ', styleLabel)
      .addText('P01\n', styleInfo);

    const table = new Table();
    table.setStyle(new Style({ fontSize: 9 }));
    table.setWidths([45, 10, 50, 160, 40, 50, 53, 40]);
    table.setMargin([0, 7, 0, 7]);

    table.setHeader(
      [
        new Cell('CANTIDAD').setColSpan(2).toJSON(),
        new Cell('').toJSON(),
        new Text('CLAVE SAT', new Style({ fillColor: '#C0C0C0' })).toJSON(),
        new Cell('CONCEPTO/DESCRIPCIÓN').toJSON(),
        new Text('UNIDAD').toJSON(),
        new Text('P.UNITARIO').toJSON(),
        new Text('DESCUENTO').toJSON(),
        new Text('IMPORTE').toJSON(),
      ],
      new Style({
        fillColor: 'black',
        color: '#a76d09',
        fontSize: 9,
      })
    );

    table.addRow([
      new Cell('1', new Style({ fillColor: 'red' })).toJSON(),
      new Cell('2').toJSON(),
      new Text('10001000', new Style({ fillColor: 'purple' })).toJSON(),
      new Text('HERRERIA & ELECTRICOS S DE CV').toJSON(),
      new Text('UNIDAD').toJSON(),
      new Text('100.00').toJSON(),
      new Text('0.00').toJSON(),
      new Text('100.00').toJSON(),
    ]);
    table.addRow([
      new Cell('1', new Style({ fillColor: 'red' })).toJSON(),
      new Cell('2').toJSON(),
      new Text('10001000', new Style({ fillColor: 'purple' })).toJSON(),
      new Text('HERRERIA & ELECTRICOS S DE CV').toJSON(),
      new Text('UNIDAD').toJSON(),
      new Text('100.00').toJSON(),
      new Text('0.00').toJSON(),
      new Text('100.00').toJSON(),
    ]);

    const labelStrong = new Style({ fontSize: 9, bold: true });
    const quality = new Text('CANTIDAD CON LETRA:\n', labelStrong).addText(
      'OCHOCIENTOS TREINTA Y NUEVE PESOS 99/100 M.N.',
      new Style({ fontSize: 9 })
    );

    const desglose = new Text('SUBTOTAL: ', labelStrong)
      .addText('$17240009.13\n', new Style({ fontSize: 9 }))
      .addText('DESCUENTO: ', labelStrong)
      .addText('$0.00\n', new Style({ fontSize: 9 }))
      .addText('IMPUESTOS: ', labelStrong)
      .addText('$275.87\n', new Style({ fontSize: 9 }))
      .addText('TOTAL: ', labelStrong)
      .addText('$2000.00', new Style({ fontSize: 9 }));

    table.addRow([
      new Cell(quality).setColSpan(6).toJSON(),
      new Cell('2', new Style({ fillColor: 'red' })).toJSON(),
      new Text('10001000', new Style({ fillColor: 'purple' })).toJSON(),
      new Text('HERRERIA & ELECTRICOS S DE CV').toJSON(),
      new Text('UNIDAD').toJSON(),
      new Text('100.00').toJSON(),
      new Cell(desglose).setColSpan(2).toJSON(),
      new Text('100.00').toJSON(),
    ]);

    const styleDetails = new Style({ bold: true, color: '#a76d09' });
    const details = new Row()
      .addColumn(
        new Column({ width: '50%', mode: 'stack' })
          .setContent(
            new Text('Forma de pago: ', styleDetails)
              .addText('Efectivo')
              .toJSON()
          )
          .setContent(
            new Text('Método de pago: ', styleDetails)
              .addText('PUE - Pago en una sola exhibición')
              .toJSON()
          )
          .setContent(
            new Text('No. de cuenta: ', styleDetails)
              .addText('123456789')
              .toJSON()
          )
      )
      .addColumn(
        new Column({ width: '50%', mode: 'stack' })
          .setContent(new Text('Moneda:', styleDetails).addText('MXN').toJSON())
          .setContent(
            new Text('Tipo de comprobante: ', styleDetails)
              .addText('I - Ingreso')
              .toJSON()
          )
      );

    const table2 = new Table();
    table2.setWidths([250, 250]);
    table2.setStyle(new Style({ fontSize: 9 }));

    table2.addRow(
      [
        new Cell('No. CSD del Emisor')
        .setBorder([false, false, false, false])
        .setStyle(new Style({ bold: true, color: 'orange'  }))
        .setAlignment('center')
        .toJSON(),
        new Cell('Fecha y hora de certificacion')
        .setBorder([false, false, false, false])
        .setStyle(new Style({ bold: true, color: 'green'  }))
        .setAlignment('center')
        .toJSON(),
      ],
      new Style({
        color: '#a76d09',
        fontSize: 9,
      })
    );
    table2.addRow(
      [
        new Cell('30001000000400002463')
        .setBorder([false, true, false, false])
        .setAlignment('center')
        .toJSON(),
        new Cell('2022-02-26T18:05:05')
        .setBorder([false, true, false, false])
        .setAlignment('center')
        .toJSON(),
      ],
      new Style({
        color: '#a76d09',
        fontSize: 9,
      })
    );

    table2.addRow(
      [
        new Cell('Folio Fiscal')
        .setBorder([false, false, false, false])
        .setAlignment('center')
        .toJSON(),
        new Cell('No. CSD del SAT')
        .setBorder([false, false, false, false])
        .setAlignment('center')
        .toJSON(),
      ],
      new Style({
        color: '#a76d09',
        fontSize: 9,
      })
    );

    table2.addRow(
      [
        new Cell('DC2ED983-D108-402E-A2FD-C08EDDA23C47')
        .setBorder([false, true, false, false])
        .setAlignment('center')
        .toJSON(),
        new Cell('30001000000400002495')
        .setBorder([false, true, false, false])
        .setAlignment('center')
        .toJSON(),
      ],
      new Style({
        color: '#a76d09',
        fontSize: 9,
      })
    );

    const styleLabelDetailsSat = new Style({ bold: true, fontSize: 7, margin: [50, 50, 100, 50] });
    const styleDetailsSat = new Style({  fontSize: 7 });
    const detailsSat = new Row()
    .addColumn(
      new Column({ width: '20%', mode: 'stack' })
        .setContent({
          qr: 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=dc2ed983-d108-402e-a2fd-c08edda23c47&re=H&E951128469&rr=XAXX010101000&tt=000000000000002000.000000&fe=h8ZyAw==',
          "fit": 100,          // Tamaño en puntos (100pt = ~35mm)
          "foreground": "#0941a7",   // Color del QR
          "alignment": "left"  // Alineación opcional
        })
    )
    .addColumn(
      new Column({ width: '80%', mode: 'stack' })
        .setContent(
          new Text('SELLO DIGITAL DEL EMISOR\n', styleLabelDetailsSat)
            .addText(`YHV2O4OPL7jZIQiuKTgygUb75wrYXRNkgQjKWXPUr19MRfE60v+ug5xHe/bb8hW3DK8Iw9MGiqh/+z5dM2ACWlFk77SqJpEMnBVRkgwmWA/84ltCtSmtQP8roBJHy3JarVPVXwNWgo2qVAaK9Hch5XJZbASlMnPp0JESkze6deZTB22XJRdKkXa1kKZcSx/v/X/+5m99RMUNjtOKerU4jpG0cigO0M/q3j0evKjR6f1uTtW77nYEHZc/++PaExEgO7CaK4Hvk5QNHLD3gngd8UZEG5gTCcZm45B7EyiKJOSOKlF7CEXc7UgY1mYQhbeFQht2+AB9fHYIF1Zzh8ZyAw==\n`, styleDetailsSat)
            .addText('SELLO DEL SAT\n', styleLabelDetailsSat)
            .addText(`IUgJIUBUfH6d
            +AmgqQMM370OpyNnlFwLguCoSHJ5qPmPdVjymZjvji1gQiEJSroQXtrZIOQzlADTjsBDespCLE9CQSIaGLJFrUsaH7tJXibft+cBwcLDbZ/
            TTsuff8AV87f06GcVDSXSm6EZKp/dbOVh3lA6/c3QqVCESfKDY+5XLwmG4CkQWlRGEcx7tCVOCLVICNUloz6tGkaHjNOFocKk/
            DFrrvN0fBy8U1vqXK438WIbTqbRNvgGF2Wzkv8GJuiDPjMJEiiHv5Vi0Al26nAZaFFhgu5k1dcfQwxjRgMc7hmEidJ2ngb+96VFhuqlM
            +8lHkfoeFoprXjt+Zu4g==\n`, styleDetailsSat)
            .addText(`CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACION DIGITAL DEL SAT\n`, styleLabelDetailsSat)
            .addText(`||1.1|dc2ed983-d108-402e-a2fd-c08edda23c47|2022-02-26T18:05:05|SPR190613I52|
            YHV2O4OPL7jZIQiuKTgygUb75wrYXRNkgQjKWXPUr19MRfE60v+ug5xHe/bb8hW3DK8Iw9MGiqh/
            +z5dM2ACWlFk77SqJpEMnBVRkgwmWA/84ltCtSmtQP8roBJHy3JarVPVXwNWgo2qVAaK9Hch5XJZbASlMnPp0JESkze6deZTB22XJR
            dKkXa1kKZcSx/v/X/+5m99RMUNjtOKerU4jpG0cigO0M/q3j0evKjR6f1uTtW77nYEHZc/+
            +PaExEgO7CaK4Hvk5QNHLD3gngd8UZEG5gTCcZm45B7EyiKJOSOKlF7CEXc7UgY1mYQhbeFQht2+AB9fHYIF1Zzh8ZyAw==|
            30001000000400002495||`, styleDetailsSat)
            .toJSON()
        )
    );

    this.pdf
      .addContent(row.toJSON())
      .addContent(text.toJSON())
      .addContent(table.toJSON())
      .addContent(details.toJSON())
      .addContent(table2.toJSON()) 
      .addContent(detailsSat.toJSON()) 
      .setStyles({ header: { fontSize: 18, bold: true } })
      .setDefaultStyle({ fontSize: 12 });
  }

  public getPDF(): PDF {
    return this.pdf;
  }
}
