const e = {}, v = {
  "4.0": {
    schema: "https://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd",
    xslt: "https://www.sat.gob.mx/sitio_internet/cfd/4/cadenaoriginal_4_0/cadenaoriginal_4_0.xslt"
  },
  "3.3": {
    schema: "https://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd",
    xslt: "https://www.sat.gob.mx/sitio_internet/cfd/3/cadenaoriginal_3_3/cadenaoriginal_3_3.xslt"
  }
};
class C {
  version;
  outputDir;
  constructor(t) {
    this.version = t.version, this.outputDir = t.outputDir;
  }
  /**
   * Descarga todos los recursos del SAT al directorio de salida.
   */
  async download() {
    const t = v[this.version], s = e.join(this.outputDir, "complementos");
    e.mkdirSync(this.outputDir, { recursive: !0 }), e.mkdirSync(s, { recursive: !0 });
    const n = await this._fetchText(t.schema), i = this.version === "4.0" ? "cfdv40.xsd" : "cfdv33.xsd", o = e.join(this.outputDir, i);
    e.writeFileSync(o, n, "utf-8");
    const { catalogUrl: c, tipoDatosUrl: a } = this._extractSchemaImports(n);
    let l = null;
    if (c)
      try {
        const r = await this._fetchText(c), u = e.basename(c).split("?")[0];
        l = e.join(this.outputDir, u), e.writeFileSync(l, r, "utf-8");
      } catch {
        l = null;
      }
    let h = null;
    if (a)
      try {
        const r = await this._fetchText(a), u = e.basename(a).split("?")[0];
        h = e.join(this.outputDir, u), e.writeFileSync(h, r, "utf-8");
      } catch {
        h = null;
      }
    const w = await this._fetchText(t.xslt), d = this._cleanXml(w), x = this._extractXslIncludes(d), m = [];
    for (const r of x)
      try {
        const u = await this._fetchText(r), y = this._cleanXml(u), I = e.basename(r).split("?")[0], p = e.join(s, I);
        e.writeFileSync(p, y, "utf-8"), m.push(p);
      } catch {
      }
    const _ = this._rewriteIncludes(d, x), f = e.join(this.outputDir, "cadenaoriginal.xslt");
    e.writeFileSync(f, _, "utf-8");
    const S = new Set(
      m.map((r) => e.basename(r))
    ), { unused: g, added: D } = this._diffComplementos(
      s,
      S
    );
    return {
      schema: o,
      xslt: f,
      catalogSchema: l,
      tipoDatosSchema: h,
      complementos: m,
      unused: g,
      added: D
    };
  }
  /**
   * Descarga texto desde una URL usando fetch nativo de Node 22.
   */
  async _fetchText(t) {
    const s = await fetch(t);
    if (!s.ok)
      throw new Error(
        `Error al descargar ${t}: ${s.status} ${s.statusText}`
      );
    return s.text();
  }
  /**
   * Limpia el texto descargado del SAT eliminando basura antes del XML.
   * Los archivos del SAT a veces incluyen texto como:
   * "This XML file does not appear to have any style information..."
   */
  _cleanXml(t) {
    const s = t.indexOf("<?xml"), n = t.indexOf("<xsl:stylesheet"), i = t.indexOf("<xs:schema"), o = t.indexOf("<schema"), c = [
      s,
      n,
      i,
      o
    ].filter((h) => h >= 0);
    if (c.length === 0)
      return t;
    const a = Math.min(...c), l = t.slice(a);
    return !l.startsWith("<?xml") && (l.includes("<xsl:stylesheet") || l.includes("<xsl:transform")) ? `<?xml version="1.0" encoding="UTF-8"?>
` + l : l;
  }
  /**
   * Extrae las URLs de los xs:import del esquema XSD.
   * Busca especificamente los catalogos (catCFDI) y tipoDatos (tdCFDI).
   */
  _extractSchemaImports(t) {
    const s = /<xs:import[^>]*schemaLocation=["']([^"']+)["'][^>]*>/gi;
    let n = null, i = null, o;
    for (; (o = s.exec(t)) !== null; ) {
      const c = o[1];
      c.includes("catCFDI") || c.includes("catalogos") ? n = c : (c.includes("tdCFDI") || c.includes("tipoDatos")) && (i = c);
    }
    return { catalogUrl: n, tipoDatosUrl: i };
  }
  /**
   * Extrae las URLs de xsl:include del XSLT.
   */
  _extractXslIncludes(t) {
    const s = /<xsl:include[^>]*href=["']([^"']+)["'][^>]*\/?>/gi, n = [];
    let i;
    for (; (i = s.exec(t)) !== null; ) {
      const o = i[1];
      (o.startsWith("http://") || o.startsWith("https://")) && n.push(o);
    }
    return n;
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
  _diffComplementos(t, s) {
    const n = e.existsSync(t) ? e.readdirSync(t).filter((a) => a.endsWith(".xslt")) : [], i = new Set(n), o = n.filter((a) => !s.has(a)), c = [...s].filter((a) => !i.has(a));
    return { unused: o, added: c };
  }
  _rewriteIncludes(t, s) {
    let n = t;
    for (const i of s) {
      const c = `./complementos/${e.basename(i).split("?")[0]}`;
      n = n.split(i).join(c);
    }
    return n;
  }
}
export {
  C as SatResources
};
