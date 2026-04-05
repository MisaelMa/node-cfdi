import { Content } from "pdfmake/interfaces";
import { Row } from "./Row";

export class Grid {
    private content: Content[] = [];
  
    addRow(row: Row): this {
      this.content.push(row.toJSON());
      return this;
    }
  
    addContent(content: string): this {
      this.content.push(content);
      return this;
    }
  
    toJSON(): Content[] {
      return this.content;
    }
  }