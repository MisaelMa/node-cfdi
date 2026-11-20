import { describe, expectTypeOf, it } from 'vitest';
import type { ComplementsReturn, XmlCce11, XmlLeyendasFiscales } from '../src';

describe('ComplementsReturn<T> tipa complement como T (#119)', () => {
  it('complement es exactamente T y permite indexar por claves del complemento', () => {
    expectTypeOf<ComplementsReturn<XmlCce11>['complement']>().toEqualTypeOf<XmlCce11>();
    expectTypeOf<ComplementsReturn<XmlLeyendasFiscales>['complement']>().toEqualTypeOf<XmlLeyendasFiscales>();
  });

  it('claves ajenas al complemento no compilan', () => {
    const r = {} as ComplementsReturn<XmlCce11>;
    // solo verificacion de tipos: la funcion nunca se ejecuta
    const _typeOnly = () => {
      // @ts-expect-error la clave no existe en XmlCce11
      return r.complement['nomina12:Emisor'];
    };
    expectTypeOf(_typeOnly).toBeFunction();
  });
});
