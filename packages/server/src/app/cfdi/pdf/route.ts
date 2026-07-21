
import PDF117 from '@cfdi/designs/src/B333/index'
import PDF111 from '@cfdi/designs/src/B333'
export async function GET(request: Request) {
  const pdf = new PDF117();

  //console.log(pdf.design())
  pdf.design()
  const pdfBuffer = await pdf.getPDF().getBuffer()
  //return Response.json({ message: 'Hello World' })

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="documento.pdf"',
    },
  });
}
