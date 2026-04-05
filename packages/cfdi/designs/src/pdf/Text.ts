import { ContentText } from 'pdfmake/interfaces';
import { Style } from './Style';

export class Text {
    private content: ContentText;
  
    constructor(text: string, style?: Style) {
      this.content = { text };
      if (style) {
        this.content.style = style.toJSON();
      }
    }

    setBold(bold: boolean): this {
      this.content.bold = bold;
      return this;
    }
  
    setMargin(margin: [number, number, number, number]): this {
      this.content.margin = margin;
      return this;
    }
  
   
  
    setStyle(style: Style): this {
      this.content.style = style.toJSON();
      return this;
    }

    addText(text: string, style?: Style): this {
      if (!Array.isArray(this.content.text)) {
        let previousText = this.content.text;
        let previousStyle = this.content.style ?? {};
        delete this.content.style;
        this.content.text = [{ text: previousText, style: previousStyle }];
      }
  
      const fragment: ContentText = { text, ...(style ?? {}) };
      (this.content.text as ContentText[]).push(fragment);
  
      return this;
    }
  
    toJSON(): ContentText {
      return this.content;
    }
  }