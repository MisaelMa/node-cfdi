import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

import * as browserEntry from '../src/browser';
import * as complementos from '@cfdi/complementos';

// #114: @cfdi/xml/browser re-exporta las clases de @cfdi/complementos para que el
// front no tenga que declarar @cfdi/complementos como dependencia directa.
describe('@cfdi/xml/browser re-exporta @cfdi/complementos', () => {
  it.each(['Iedu', 'VentaVehiculos', 'Pago20', 'Nomina12'])('expone %s', (name) => {
    expect((complementos as Record<string, unknown>)[name]).toBeTypeOf('function');
    expect((browserEntry as Record<string, unknown>)[name]).toBe(
      (complementos as Record<string, unknown>)[name]
    );
  });

  it('expone todas las clases de complementos sin pisar los exports propios', () => {
    const missing = Object.keys(complementos).filter((k) => !(k in browserEntry));
    expect(missing).toEqual([]);
  });

  it('el subpath ./browser declara sus propios tipos (dist/browser.d.ts)', () => {
    const pkg = JSON.parse(
      readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8')
    );
    expect(pkg.exports['./browser'].types).toBe('./dist/browser.d.ts');
  });
});
