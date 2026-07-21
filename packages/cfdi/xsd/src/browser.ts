// Entrypoint BROWSER-SAFE de @cfdi/xsd.
//
// Expone la misma clase `Schema` que el entrypoint de Node, pero SIN registrar
// el adaptador de lectura de disco (`loader.node.ts`). Resultado: el grafo de
// imports no alcanza `fs`, y los elements de @cfdi/xml pueden importar
// `@cfdi/xsd` sin condicionales — el bundler resuelve aca via la condicion
// "browser" declarada en los `exports` del package.json.
//
// Sin reader registrado, `Schema.of().setConfig({ path })` lanza un error
// explicito en vez de reventar con un "Cannot resolve 'fs'". La validacion
// contra los XSD es autoridad del server.
export { default as Schema } from './schema';
export type { SchemaReader } from './schema';
