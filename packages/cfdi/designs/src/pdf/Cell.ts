import { Content, TableCell, TableCellProperties } from 'pdfmake/interfaces';
import { Text } from './Text';
import { Style } from './Style';
type ICell = Content & TableCellProperties
export class Cell {
  private cell: Partial<ICell> = {
    
  }

  constructor(text: string | Text, style?: Style) {
    this.cell =  typeof text === 'string' ? { text, ...(style ?? {})} : { text: text.toJSON(), ...(style ?? {}) };
  }
 
  setColSpan(colSpan: number): this {
    // @ts-ignore
    this.cell.colSpan = colSpan;
    return this;
  }

  setStyle(style: Style): this {
    // @ts-ignore
    this.cell = { ...this.cell, ...style.toJSON() };
    return this;
  }

  setBorder(border: [boolean, boolean, boolean, boolean]): this {
    this.cell.border = border;
    return this;
  }

  setAlignment(alignment: 'left' | 'center' | 'right'): this {
    // @ts-ignore
    this.cell.alignment = alignment;
    return this;
  }
  toJSON(): TableCell {
    return this.cell as TableCell;
  }
}
