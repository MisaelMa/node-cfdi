import { PDF } from '../pdf/PDF';
import { Style } from '../pdf/Style';
import { Text } from '../pdf/Text';
import { Column } from '../pdf/Column';
import { Row } from '../pdf/Row';
import { Table } from '../pdf/Table';
import { Cell } from '../pdf/Cell';

export default class PDF111 {
  public pdf = new PDF();

  public design(): void {
    const boldStyle = new Style({ fontSize: 10, bold: true });
    const regularStyle = new Style({ fontSize: 10 });

    const text = new Text('\nORDEN DE COMPRA', new Style({ fontSize: 13 }));

    const text2 = new Text('\nSolicitante:', boldStyle).addText(
      ' Sistemas',
      regularStyle
    );
    const text3 = new Text('\nProveedor:', boldStyle).addText(
      ' Coppe',
      regularStyle
    );
    const text4 = new Text('\nEmpresa:', boldStyle).addText(
      ' driana Salvador Jeronimo',
      regularStyle
    );

    const column1 = new Column({ width: 200 })
      .setContent(text2.toJSON())
      .setContent(text3.toJSON())
      .setContent(text4.toJSON());

    const text5 = new Text('\nArticulos Solicitados:', boldStyle).addText(
      ' 1',
      regularStyle
    );
    const text6 = new Text('\nFecha de Pedido:', boldStyle).addText(
      ' 06/07/2020',
      regularStyle
    );
    const text7 = new Text('\nFecha de Entrega:', boldStyle).addText(
      ' 06/07/2020',
      regularStyle
    );

    const column2 = new Column({ width: 250 })
      .setContent(new Text('').toJSON())
      .setContent(text5.toJSON())
      .setContent(text6.toJSON())
      .setContent(text7.toJSON());

    const table = new Table();
    table.setHeader([
      new Cell('Folio').setBorder([true, true, true, true]).toJSON(),
    ]);
    table.addRow([new Cell('109209437').toJSON()]);
    const column3 = new Column({ width: 150, mode: 'stack' }).setContent(
      table.toJSON()
    );

    const row = new Row({
      children: [column1.toJSON(), column2.toJSON(), column3.toJSON()],
    });

    const table2 = new Table();
    table2.setWidths([40, 153, 50, 80, 60, 50, 50]);
    table2.setHeaderRow(1);
    table2.setHeader([
      new Cell('N')
        .setStyle(new Style({ fillColor: '#dddddd' }))
        .setBorder([true, true, true, true])
        .toJSON(),
      new Cell('Concepto/Descricion')
       .setStyle(new Style({ fillColor: '#dddddd' }))
       .setBorder([true, true, true, true])
       .toJSON(),

       new Cell('C.pedida')
       .setStyle(new Style({ fillColor: '#dddddd' }))
       .setBorder([true, true, true, true])
       .toJSON(),
      
       new Cell('Unidad')
       .setStyle(new Style({ fillColor: '#dddddd' }))
       .setBorder([true, true, true, true])
       .toJSON(),
      
       new Cell('C.Recibida')
       .setStyle(new Style({ fillColor: '#dddddd' }))
       .setBorder([true, true, true, true])
       .toJSON(),

       new Cell('Precio')
       .setStyle(new Style({ fillColor: '#dddddd' }))
       .setBorder([true, true, true, true])
       .toJSON(),
       new Cell('Valor')
       .setStyle(new Style({ fillColor: '#dddddd' }))
       .setBorder([true, true, true, true])
       .toJSON(),
      
    ]);
    table2.addRow(['1', 'cat', 'nomina', 'servicio', '19891', '090', '090'])

    const header = new Text('\n\n\n\n ', new Style({ fontSize: 10, bold: true, color: '#a76d09' }));
    const table3  = new Table();
    table3.setWidths([500]);
    table3.setHeader([
      new Cell(header).setBorder( [false, false, false, true]).setAlignment('center').toJSON(),
    ]);
    this.pdf.addContent(text.toJSON()).addContent(row.toJSON()).addContent(table2.toJSON()).addContent(table3.toJSON()).addContent({
      style: 'tableExample',
      table: {
        widths: [280, 240],
        body: [
          [
            {
              border: [false, false, false, false],
              text: [
                {
                  alignment: 'left',
                  text: 'AUTORIZADO POR (Nombre y Firma) ',
                  style: {
                    bold: true,
                  },
                },
              ],
            },
            {
              border: [false, false, false, false],
              text: [
                {
                  alignment: 'right',
                  text: 'SOLICITADO POR (Nombre y Firma) ',
                  style: {
                    bold: true,
                  },
                },
              ],
            },
          ],
        ],
      },
    },)
  }

  public getPDF(): PDF {
    return this.pdf;
  }
}
