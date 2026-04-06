import { TDocumentDefinitions, Content, BufferOptions } from 'pdfmake/interfaces';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// @ts-ignore
pdfMake.addVirtualFileSystem(pdfFonts);


interface ContentPDF extends TDocumentDefinitions{
    content: Content[];
}
export class PDF {
  definition: ContentPDF = {
    pageSize: 'A4',
    pageMargins: [20, 25, 20, 25],
    content: [],
  };

  setContent(content: any): this {
    this.definition.content = Array.isArray(content) ? content : [content];
    return this;
  }

  addContent(content: any): this {
    this.definition.content.push(content);
    return this;
  }

  setStyles(styles: Record<string, any>): this {
    this.definition.styles = styles;
    return this;
  }

  setDefaultStyle(style: Record<string, any>): this {
    this.definition.defaultStyle = style;
    return this;
  }

  toJSON(): TDocumentDefinitions {
    return this.definition;
  }

  getDocument() {
    //return pdfMake.createPdf(this.definition);
  return pdfMake.createPdf(this.definition );

  }

  public async save(path: string, name: string) {
    const dir = path + `${name.replace('.pdf', '')}.pdf`;
    try {
      const buffer = await this.getBuffer();
      writeFileSync(dir, buffer, { encoding: 'binary' });
      return {
        save: true,
        path: dir,
      };
    } catch (e) {
      return {
        save: false,
        error: e,
      };
    }
  }

  public async getBlob(options?: BufferOptions): Promise<Blob> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getBlob((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getBase64(options?: BufferOptions): Promise<string> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getBase64((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getBuffer(options?: BufferOptions): Promise<Buffer> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getBuffer((result) => {
        resolve(result);
      }, options); 
    });
  }

  public async getDataUrl(options?: BufferOptions): Promise<string> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getDataUrl((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getStream(options?: BufferOptions) {
    const doc = await this.getDocument();
    return doc!.getStream(options);
  }
}
function writeFileSync(dir: string, buffer: Buffer<ArrayBufferLike>, arg2: { encoding: string; }) {
  throw new Error('Function not implemented.');
}

