import { Style as PdfStyle, ContentText } from 'pdfmake/interfaces';

export class Style {
  private style: Partial<PdfStyle> = {};
  constructor(style: Partial<PdfStyle> = {}) {
    this.style = style 
  }

  setFont(font: string): this {
    this.style.font = font;
    return this;
  }

  setFontSize(size: number): this {
    this.style.fontSize = size;
    return this;
  }

  setLineHeight(lineHeight: number): this {
    this.style.lineHeight = lineHeight;
    return this;
  }

  setBold(isBold: boolean = true): this {
    this.style.bold = isBold;
    return this;
  }

  setItalic(isItalic: boolean = true): this {
    this.style.italics = isItalic;
    return this;
  }

  setAlignment(alignment: 'left' | 'right' | 'center' | 'justify'): this {
    this.style.alignment = alignment;
    return this;
  }

  setColor(color: string): this {
    this.style.color = color;
    return this;
  }

  setBackground(color: string): this {
    this.style.background = color;
    return this;
  }

  setMargin(margin: number | [number, number, number, number]): this {
    this.style.margin = margin;
    return this;
  }

  setOpacity(opacity: number): this {
    this.style.opacity = opacity;
    return this;
  }

  setCharacterSpacing(spacing: number): this {
    this.style.characterSpacing = spacing;
    return this;
  }

  toJSON(): Partial<PdfStyle> {
    return this.style;
  }
}


