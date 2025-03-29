
import {PDF117} from '@cfdi/designs/dist/index.cjs'

export async function GET(request: Request) {
 /*  const a = new PDF117(
    '/Users/amir/Documents/proyectos/amir/node/cfdi/packages/files/xml/5E2D6AFF-2DD7-43D1-83D3-14C1ACA396D9.xml',
  ); */
  const pdf = new PDF117()
  pdf.design()
  //console.log(pdf.design())
  // pdf.design()
  const pdfBuffer = await pdf.getPDF().getBuffer()
  console.log(pdfBuffer)
  //return Response.json({ message: 'Hello World' })

   return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="documento.pdf"',
    },
  }); 
}