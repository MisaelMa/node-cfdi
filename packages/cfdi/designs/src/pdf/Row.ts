import { Content, ContentColumns, ContentStack } from 'pdfmake/interfaces';
import { Column } from './Column';


export class Row {
  private columns: any[] = [];
  private columnGap: number = 10;

  constructor(options?: any) {
    if (options.children) {
      this.columns = options.children;
    }
  }
  addColumn(column: Column): this {
    this.columns.push(column.toJSON());
    return this;
  }

 setGap(gap: number): this {
     
    this.columnGap = gap
    return this;
  }

  toJSON(): Content {
    return { columns: this.columns, columnGap: this.columnGap };
  }
}


