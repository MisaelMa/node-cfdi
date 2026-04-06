var w = /* @__PURE__ */ ((s) => (s.Finkok = "Finkok", s.SW = "SW", s.ComercioDigital = "ComercioDigital", s.Prodigia = "Prodigia", s.Diverza = "Diverza", s))(w || {});
const k = "http://schemas.xmlsoap.org/soap/envelope/", f = "http://facturacion.finkok.com/stamp", S = "http://facturacion.finkok.com/cancel", $ = "https://facturacion.finkok.com/servicios/soap/stamp.wsdl", x = "https://demo-facturacion.finkok.com/servicios/soap/stamp.wsdl";
function p(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function d(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}
function a(s, t) {
  const n = new RegExp(
    `<(?:[\\w.-]+:)?${t}[^>]*>([\\s\\S]*?)</(?:[\\w.-]+:)?${t}>`,
    "i"
  ), o = s.match(n);
  if (o)
    return d(o[1].trim());
}
function m(s, t) {
  const n = new RegExp(`${t}="([^"]*)"`, "i");
  return s.match(n)?.[1];
}
function b(s) {
  const t = s.match(/<(?:[^:>]+:)?TimbreFiscalDigital\b[^>]*\/?>/)?.[0] ?? s.match(/<TimbreFiscalDigital\b[^>]*\/?>/)?.[0];
  if (!t)
    throw new Error("El XML timbrado no contiene TimbreFiscalDigital.");
  const n = m(t, "UUID"), o = m(t, "FechaTimbrado"), e = m(t, "SelloCFD") ?? "", i = m(t, "SelloSAT") ?? "", c = m(t, "NoCertificadoSAT") ?? "", r = m(t, "CadenaOriginal") ?? "";
  if (!n || !o)
    throw new Error("No se pudieron leer UUID o FechaTimbrado del timbre.");
  return {
    uuid: n,
    fechaTimbrado: o,
    selloCFD: e,
    selloSAT: i,
    noCertificadoSAT: c,
    cadenaOriginalSAT: r
  };
}
function u(s) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="${k}">
  <soapenv:Header/>
  <soapenv:Body>
    ${s}
  </soapenv:Body>
</soapenv:Envelope>`;
}
class U {
  constructor(t) {
    this.config = t;
  }
  config;
  finkokOrigin() {
    const t = this.config.baseUrl?.trim();
    if (!t)
      return this.config.sandbox ? "https://demo-facturacion.finkok.com" : "https://facturacion.finkok.com";
    const n = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    try {
      return new URL(n).origin;
    } catch {
      return this.config.sandbox ? "https://demo-facturacion.finkok.com" : "https://facturacion.finkok.com";
    }
  }
  stampUrl() {
    const t = this.config.baseUrl?.trim();
    return t && /\.wsdl$/i.test(t) && /stamp/i.test(t) ? /^https?:\/\//i.test(t) ? t : `https://${t}` : this.config.sandbox ? x : $;
  }
  cancelUrl() {
    const t = this.config.baseUrl?.trim();
    return t && /\.wsdl$/i.test(t) && /cancel/i.test(t) ? /^https?:\/\//i.test(t) ? t : `https://${t}` : `${this.finkokOrigin()}/servicios/soap/cancel.wsdl`;
  }
  authStamp() {
    return `
      <stamp:username>${p(this.config.user)}</stamp:username>
      <stamp:password>${p(this.config.password)}</stamp:password>`;
  }
  authCancel() {
    return `
      <cancel:username>${p(this.config.user)}</cancel:username>
      <cancel:password>${p(this.config.password)}</cancel:password>`;
  }
  async postSoap(t, n) {
    const o = await fetch(t, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8"
      },
      body: n
    }), e = await o.text();
    if (!o.ok)
      throw new Error(`Finkok HTTP ${o.status}: ${e.slice(0, 500)}`);
    return e;
  }
  async timbrar(t) {
    const n = Buffer.from(t.xmlCfdi, "utf8").toString("base64"), o = `
    <stamp:stamp xmlns:stamp="${f}">
      <stamp:xml>${n}</stamp:xml>
      ${this.authStamp()}
    </stamp:stamp>`, e = await this.postSoap(this.stampUrl(), u(o)), i = a(e, "CodEstatus"), c = a(e, "MensajeIncidencia") ?? a(e, "error");
    if (c || i && !/timbrado satisfactoriamente/i.test(i))
      throw new Error(c ?? i ?? "Error desconocido en timbrado Finkok.");
    const r = a(e, "xml");
    if (!r)
      throw new Error("Respuesta de timbrado sin nodo xml.");
    const l = Buffer.from(r, "base64").toString("utf8");
    return { ...b(l), xmlTimbrado: l };
  }
  async cancelar(t, n, o, e) {
    const i = e !== void 0 && e !== "" ? ` FolioSustitucion="${p(e)}"` : "", c = `
    <cancel:cancel xmlns:cancel="${S}">
      <cancel:UUIDS>
        <cancel:UUID UUID="${p(t)}" Motivo="${p(o)}"${i}/>
      </cancel:UUIDS>
      ${this.authCancel()}
      <cancel:taxpayer_id>${p(n)}</cancel:taxpayer_id>
    </cancel:cancel>`, r = await this.postSoap(this.cancelUrl(), u(c)), l = a(r, "error");
    if (l)
      throw new Error(l);
    const h = a(r, "Acuse") ?? "", g = a(r, "EstatusUUID") ?? a(r, "EstatusCancelacion") ?? a(r, "CodEstatus") ?? "";
    return { uuid: t, estatus: g, acuse: h };
  }
  async consultarEstatus(t) {
    const n = `
    <stamp:query_pending xmlns:stamp="${f}">
      ${this.authStamp()}
      <stamp:uuid>${p(t)}</stamp:uuid>
    </stamp:query_pending>`, o = await this.postSoap(this.stampUrl(), u(n)), e = a(o, "error");
    if (e)
      throw new Error(e);
    const i = a(o, "status") ?? "", c = a(o, "xml");
    return {
      uuid: a(o, "uuid") ?? t,
      estatus: i,
      xml: c ? d(c) : void 0
    };
  }
}
export {
  U as FinkokProvider,
  w as PacProviderType
};
