import { ContentImage } from 'pdfmake/interfaces';

export class Image {
  private content: ContentImage;

  constructor(src: string) {
    this.content = { image: src };
  }

  setWidth(width: number): this {
    this.content.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.content.height = height;
    return this;
  }

  setFit(width: number, height: number): this {
    this.content.fit = [width, height];
    return this;
  }

  setAlignment(alignment: 'left' | 'center' | 'right'): this {
    this.content.alignment = alignment;
    return this;
  }

  setMargin(margin: [number, number, number, number]): this {
    this.content.margin = margin;
    return this;
  }

  setOpacity(opacity: number): this {
    this.content.opacity = opacity;
    return this;
  }

  /* setBorder(top: boolean, right: boolean, bottom: boolean, left: boolean): this {
    this.content.border = [top, right, bottom, left];
    return this;
  } */

  setStyle(style: string): this {
    this.content.style = style;
    return this;
  }

  toJSON(): ContentImage {
    return this.content;
  }
}
