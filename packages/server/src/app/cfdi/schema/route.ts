
import { processXSD }  from '@cfdi/schema'
export async function GET(request: Request) {

  const result = await processXSD()
  return Response.json({ message: 'Hello World',result})
}