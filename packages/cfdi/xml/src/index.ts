export * from './cfdi';
export * from './elements/Relacionado';
export * from './elements/Emisor';
export * from './elements/Receptor';
export * from './elements/Concepto';
export { Concepto as Concepts } from './elements/Concepto';
export * from './elements/Impuestos';
export * from './types';

const DONATION_FLAG = Symbol.for('@cfdi/xml.donation-shown');
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
      '║  💛  ¿Te gusta @cfdi/xml?  ¡Apóyame con una donación!  💛 ║',
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
