// Entrypoint NODE de @cfdi/xsd.
//
// Actua como composition root: registra el adaptador que lee los schemas desde
// disco. `Schema` en si es puro (ver `schema.ts`); quien decide de donde salen
// los JSON es este archivo. El entrypoint browser (`browser.ts`) no registra
// nada, y por eso no arrastra `fs`.
import Schema from './schema';
import { nodeSchemaReader } from './loader.node';

Schema.setReader(nodeSchemaReader);

export { default as Schema } from './schema';
export type { SchemaReader } from './schema';
export { nodeSchemaReader } from './loader.node';
