import { Content, ContentColumns, ContentStack } from 'pdfmake/interfaces';
import { Style } from './Style';
interface IColumn {
  width: string | number;
  text: Content;
  style?: Style;
}
export class Column {
  private columnConfig: IColumn = { width: 'auto', text: [] };
  private mode: 'text' | 'stack' | 'image' = 'text';
  constructor(options?: {
    children?: Content | Content[];
    width?: string | number;
    mode?: 'text' | 'stack' ;
  }) {
    const { children = [], width = 'auto', mode = 'text' } = options || {};
    this.mode = mode;
    this.columnConfig[this.mode] = [];
    this.columnConfig.width = width;
    this.addContent(children);
  }

  private addContent(content: Content | Content[]): this {
    if (Array.isArray(content)) {
      const currentContent = this.columnConfig[this.mode];
      this.columnConfig[this.mode] = [...currentContent, ...content];
    } else {
      this.columnConfig[this.mode].push(content);
    }
    return this;
  }
  setContent(content: Content | Content[]): this {
    this.addContent(content);
    return this;
  }

  setStack(content: Content | Content[]): this {
    this.addContent(content);
    return this;
  }
  setWidth(width: string | number): this {
    this.columnConfig.width = width;
    return this;
  }

  setStyle(style: Style): this {
    this.columnConfig.style = style;
    return this;
  }

  toJSON(): IColumn {
    return this.columnConfig;
  }
}
