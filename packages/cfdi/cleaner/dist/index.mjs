import l from "node:fs";
const i = /* @__PURE__ */ new Set([
  "http://www.sat.gob.mx/cfd/3",
  "http://www.sat.gob.mx/cfd/4",
  "http://www.sat.gob.mx/TimbreFiscalDigital",
  "http://www.sat.gob.mx/implocal",
  "http://www.sat.gob.mx/Pagos",
  "http://www.sat.gob.mx/Pagos20",
  "http://www.sat.gob.mx/nomina12",
  "http://www.sat.gob.mx/nomina",
  "http://www.sat.gob.mx/ComercioExterior11",
  "http://www.sat.gob.mx/ComercioExterior20",
  "http://www.sat.gob.mx/CartaPorte20",
  "http://www.sat.gob.mx/CartaPorte30",
  "http://www.sat.gob.mx/CartaPorte31",
  "http://www.sat.gob.mx/iedu",
  "http://www.sat.gob.mx/donat",
  "http://www.sat.gob.mx/divisas",
  "http://www.sat.gob.mx/leyendasFiscales",
  "http://www.sat.gob.mx/pfic",
  "http://www.sat.gob.mx/TuristaPasajeroExtranjero",
  "http://www.sat.gob.mx/registrofiscal",
  "http://www.sat.gob.mx/pagoenespecie",
  "http://www.sat.gob.mx/aerolineas",
  "http://www.sat.gob.mx/valesdedespensa",
  "http://www.sat.gob.mx/notariospublicos",
  "http://www.sat.gob.mx/vehiculousado",
  "http://www.sat.gob.mx/servicioparcialconstruccion",
  "http://www.sat.gob.mx/renovacionysustitucionvehiculos",
  "http://www.sat.gob.mx/certificadodestruccion",
  "http://www.sat.gob.mx/arteantiguedades",
  "http://www.sat.gob.mx/ine",
  "http://www.sat.gob.mx/ventavehiculos",
  "http://www.sat.gob.mx/detallista",
  "http://www.sat.gob.mx/EstadoDeCuentaCombustible12",
  "http://www.sat.gob.mx/ConsumoDeCombustibles11",
  "http://www.sat.gob.mx/GastosHidrocarburos10",
  "http://www.sat.gob.mx/IngresosHidrocarburos10",
  "http://www.w3.org/2001/XMLSchema-instance"
]);
function g(e) {
  return e.replace(/<cfdi:Addenda[\s\S]*?<\/cfdi:Addenda>/gi, "");
}
function x(e) {
  return e.replace(
    /(<cfdi:Comprobante\b)([\s\S]*?)(\/?>)/,
    (a, t, o, r) => {
      const s = o.replace(
        /\s+xmlns:[a-zA-Z0-9_-]+="([^"]*)"/g,
        (w, n) => i.has(n) ? w : ""
      );
      return `${t}${s}${r}`;
    }
  );
}
function b(e) {
  return e.replace(
    /xsi:schemaLocation="([^"]*)"/g,
    (a, t) => {
      const o = t.trim().split(/\s+/), r = [];
      for (let s = 0; s < o.length - 1; s += 2) {
        const w = o[s], n = o[s + 1];
        i.has(w) && r.push(w, n);
      }
      return `xsi:schemaLocation="${r.join(" ")}"`;
    }
  );
}
function u(e) {
  const a = {}, t = /xmlns:([a-zA-Z0-9_-]+)="([^"]*)"/g;
  let o;
  for (; (o = t.exec(e)) !== null; )
    a[o[1]] = o[2];
  return e.replace(
    /(<cfdi:Complemento[^>]*>)([\s\S]*?)(<\/cfdi:Complemento>)/g,
    (r, s, w, n) => {
      const m = w.replace(
        /<([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)([\s\S]*?)(?:<\/\1:\2>|\/>)/g,
        (p, h) => {
          const c = a[h];
          return !c || !i.has(c) ? "" : p;
        }
      );
      return `${s}${m}${n}`;
    }
  );
}
function d(e) {
  return e.replace(/<\?xml-stylesheet[^?]*\?>/gi, "");
}
function f(e) {
  return e.replace(/>[ \t\r\n]+</g, `>
<`).trim();
}
class S {
  /**
   * Limpia un XML de CFDI en memoria.
   *
   * @param xml - Contenido XML del CFDI como string UTF-8
   * @returns XML limpio con solo contenido oficial del SAT
   */
  clean(a) {
    let t = a;
    return t = d(t), t = g(t), t = u(t), t = x(t), t = b(t), t = f(t), t;
  }
  /**
   * Limpia un CFDI leyendo el archivo desde disco.
   *
   * @param filePath - Ruta absoluta al archivo XML
   * @returns XML limpio con solo contenido oficial del SAT
   */
  cleanFile(a) {
    const t = l.readFileSync(a, "utf-8");
    return this.clean(t);
  }
}
export {
  S as CfdiCleaner,
  i as SAT_NAMESPACES,
  f as collapseWhitespace,
  g as removeAddenda,
  x as removeNonSatNamespaces,
  u as removeNonSatNodes,
  b as removeNonSatSchemaLocations,
  d as removeStylesheetAttributes
};
