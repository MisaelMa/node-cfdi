import { ContentTable, Size, TableCell, TableLayout } from 'pdfmake/interfaces';
import { Style } from './Style';

export class Table {
  private content: ContentTable;

  constructor() {
    this.content = {
      table: {
        body: [],
      },
    };
  }

  setHeaderRow(headers: number): this {
    this.content.table.headerRows = headers;
    return this;
  }

  setHeader(headers: (string | TableCell)[], style?: Style): this {
    const headerRow = headers.map(cell => {
        if (typeof cell === 'string') {
          return { text: cell, ...(style ?? {}) };
        } else {
          const cellStyle = style ? style.toJSON() : {};
          return {
            ...(cell as unknown as Object),
            // @ts-ignore
            style: { ...cellStyle, ...(cell.style ?? {}) },
          };
        }
      });
    this.content.table.body.unshift(headerRow as TableCell[]);
    return this;
  }

  addRow(cells: (string | TableCell)[], style?: Style): this {
    const rows = cells.map(cell => {
      if (typeof cell === 'string') {
        return { text: cell, ...(style ?? {}) };
      } else {
        const cellStyle = style ? style.toJSON() : {};
        return {
          ...(cell as unknown as Object),
          // @ts-ignore
          style: { ...cellStyle, ...(cell.style ?? {}) },
        };
      }
    });
    this.content.table.body.push(rows as TableCell[]);
    return this;
  }

  setLayout(layout: TableLayout): this {
    this.content.layout = layout;
    return this;
  }

  setStyle(style: Style): this {
    this.content = { ...this.content, style : style.toJSON()};
    return this;
  }

  setMargin(margin: number | [number, number, number, number]): this {
    this.content.margin = margin;
    return this;
  }
  setWidths(widths: "*" | "auto" | Size[] | undefined ): this {
    this.content.table.widths = widths;
    return this;
  }

  toJSON(): ContentTable {
    return this.content;
  }
}
