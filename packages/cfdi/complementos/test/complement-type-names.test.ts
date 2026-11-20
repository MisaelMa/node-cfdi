import { describe, expectTypeOf, it } from 'vitest';
import type {
  ComplementType,
  ComplementTypeConcept,
  ComlementType,
  ComlementTypeConcept,
} from '../src';

describe('nombres de tipos de complemento (#117)', () => {
  it('exporta ComplementType / ComplementTypeConcept y mantiene alias deprecados', () => {
    expectTypeOf<ComlementType>().toEqualTypeOf<ComplementType>();
    expectTypeOf<ComlementTypeConcept>().toEqualTypeOf<ComplementTypeConcept>();
  });
});
