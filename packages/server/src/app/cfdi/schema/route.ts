
import {PDF117} from '@cfdi/designs/dist/index.cjs'
import { xsdService }  from '@cfdi/schema'
export async function GET(request: Request) {
 
  const result = await xsdService.processXSD()
  return Response.json({ message: 'Hello World',result})
}