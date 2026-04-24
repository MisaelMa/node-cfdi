/*import {Map} from 'immutable'
const invoice = Map<string, number>();
const newInvoice = invoice.set('x', 1);
export const Greeter = (name: string) => `Hello ${name}`;
*/

export * from './signati/index';
export * from './signati/tags/Relacionado';
export * from './signati/tags/Emisor';
export * from './signati/tags/Receptor';
export * from './signati/tags/Concepts';
export * from './signati/tags/Impuestos';
export * from './signati/complements/index';
export * from './signati/types/index';

const DONATION_FLAG = Symbol.for('@signati/core.donation-shown');
const env = (typeof process !== 'undefined' && process.env) || {};
const isProd = env.NODE_ENV === 'production';
const isTest =
  env.NODE_ENV === 'test' || !!env.VITEST || !!env.JEST_WORKER_ID;
const alreadyShown = (globalThis as any)[DONATION_FLAG] === true;

if (!isProd && !isTest && !alreadyShown) {
  (globalThis as any)[DONATION_FLAG] = true;
  console.log(
    [
      '╔══════════════════════════════════════════════════════════╗',
      '║  💛  ¿Te gusta @signati/core?  ¡Apóyame con una donación! ║',
      '╠══════════════════════════════════════════════════════════╣',
      '║  ☕  Buy Me a Coffee:                                     ║',
      '║      https://buymeacoffee.com/recreandodev               ║',
      '║                                                          ║',
      '║  ✉️   Correo:                                             ║',
      '║      amisael.amir.misael@gmail.com                       ║',
      '║      (escríbeme y te paso mi número de cuenta)           ║',
      '║                                                          ║',
      '║  🛠️   Este mensaje solo aparece en modo desarrollo        ║',
      '╚══════════════════════════════════════════════════════════╝',
    ].join('\n')
  );
}
