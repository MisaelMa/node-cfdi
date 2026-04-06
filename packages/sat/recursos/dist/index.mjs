import r from "fs";
import a from "path";
const F = {
  "4.0": {
    schema: "https://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd",
    xslt: "https://www.sat.gob.mx/sitio_internet/cfd/4/cadenaoriginal_4_0/cadenaoriginal_4_0.xslt"
  },
  "3.3": {
    schema: "https://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd",
    xslt: "https://www.sat.gob.mx/sitio_internet/cfd/3/cadenaoriginal_3_3/cadenaoriginal_3_3.xslt"
  }
};
class U {
  version;
  outputDir;
  constructor(t) {
    this.version = t.version, this.outputDir = t.outputDir;
  }
  /**
   * Descarga todos los recursos del SAT al directorio de salida.
   */
  async download() {
    const t = F[this.version], e = a.join(this.outputDir, "complementos");
    r.mkdirSync(this.outputDir, { recursive: !0 }), r.mkdirSync(e, { recursive: !0 });
    const s = await this._fetchText(t.schema), i = this.version === "4.0" ? "cfdv40.xsd" : "cfdv33.xsd", c = a.join(this.outputDir, i);
    r.writeFileSync(c, s, "utf-8");
    const { catalogUrl: n, tipoDatosUrl: o } = this._extractSchemaImports(s);
    let l = null;
    if (n)
      try {
        const h = await this._fetchText(n), u = a.basename(n).split("?")[0];
        l = a.join(this.outputDir, u), r.writeFileSync(l, h, "utf-8");
      } catch {
        l = null;
      }
    let m = null;
    if (o)
      try {
        const h = await this._fetchText(o), u = a.basename(o).split("?")[0];
        m = a.join(this.outputDir, u), r.writeFileSync(m, h, "utf-8");
      } catch {
        m = null;
      }
    const _ = await this._fetchText(t.xslt), x = this._cleanXml(_), f = this._extractXslIncludes(x), d = [];
    for (const h of f)
      try {
        const u = await this._fetchText(h), I = this._cleanXml(u), v = a.basename(h).split("?")[0], w = a.join(e, v);
        r.writeFileSync(w, I, "utf-8"), d.push(w);
      } catch {
      }
    const S = this._rewriteIncludes(x, f), p = a.join(this.outputDir, "cadenaoriginal.xslt");
    r.writeFileSync(p, S, "utf-8");
    const g = new Set(
      d.map((h) => a.basename(h))
    ), { unused: D, added: y } = this._diffComplementos(
      e,
      g
    );
    return {
      schema: c,
      xslt: p,
      catalogSchema: l,
      tipoDatosSchema: m,
      complementos: d,
      unused: D,
      added: y
    };
  }
  /**
   * Descarga texto desde una URL usando fetch nativo de Node 22.
   */
  async _fetchText(t) {
    const e = await fetch(t);
    if (!e.ok)
      throw new Error(
        `Error al descargar ${t}: ${e.status} ${e.statusText}`
      );
    return e.text();
  }
  /**
   * Limpia el texto descargado del SAT eliminando basura antes del XML.
   * Los archivos del SAT a veces incluyen texto como:
   * "This XML file does not appear to have any style information..."
   */
  _cleanXml(t) {
    const e = t.indexOf("<?xml"), s = t.indexOf("<xsl:stylesheet"), i = t.indexOf("<xs:schema"), c = t.indexOf("<schema"), n = [
      e,
      s,
      i,
      c
    ].filter((m) => m >= 0);
    if (n.length === 0)
      return t;
    const o = Math.min(...n), l = t.slice(o);
    return !l.startsWith("<?xml") && (l.includes("<xsl:stylesheet") || l.includes("<xsl:transform")) ? `<?xml version="1.0" encoding="UTF-8"?>
` + l : l;
  }
  /**
   * Extrae las URLs de los xs:import del esquema XSD.
   * Busca especificamente los catalogos (catCFDI) y tipoDatos (tdCFDI).
   */
  _extractSchemaImports(t) {
    const e = /<xs:import[^>]*schemaLocation=["']([^"']+)["'][^>]*>/gi;
    let s = null, i = null, c;
    for (; (c = e.exec(t)) !== null; ) {
      const n = c[1];
      n.includes("catCFDI") || n.includes("catalogos") ? s = n : (n.includes("tdCFDI") || n.includes("tipoDatos")) && (i = n);
    }
    return { catalogUrl: s, tipoDatosUrl: i };
  }
  /**
   * Extrae las URLs de xsl:include del XSLT.
   */
  _extractXslIncludes(t) {
    const e = /<xsl:include[^>]*href=["']([^"']+)["'][^>]*\/?>/gi, s = [];
    let i;
    for (; (i = e.exec(t)) !== null; ) {
      const c = i[1];
      (c.startsWith("http://") || c.startsWith("https://")) && s.push(c);
    }
    return s;
  }
  /**
   * Reescribe los href de xsl:include del XSLT principal para que
   * apunten a rutas locales dentro de la carpeta complementos/.
   *
   * Ejemplo:
   *   href="http://www.sat.gob.mx/sitio_internet/cfd/donat/donat11.xslt"
   *   -> href="./complementos/donat11.xslt"
   */
  /**
   * Compara los archivos .xslt existentes en el directorio de complementos
   * contra los que se descargaron del SAT.
   * - unused: archivos locales que ya no estan en el XSLT del SAT
   * - added: archivos nuevos del SAT que no existian localmente
   */
  _diffComplementos(t, e) {
    const s = r.existsSync(t) ? r.readdirSync(t).filter((o) => o.endsWith(".xslt")) : [], i = new Set(s), c = s.filter((o) => !e.has(o)), n = [...e].filter((o) => !i.has(o));
    return { unused: c, added: n };
  }
  _rewriteIncludes(t, e) {
    let s = t;
    for (const i of e) {
      const n = `./complementos/${a.basename(i).split("?")[0]}`;
      s = s.split(i).join(n);
    }
    return s;
  }
}
export {
  U as SatResources
};
