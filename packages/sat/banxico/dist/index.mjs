var u = /* @__PURE__ */ ((o) => (o.USD = "USD", o.EUR = "EUR", o.GBP = "GBP", o.JPY = "JPY", o.CAD = "CAD", o))(u || {});
const h = /* @__PURE__ */ new Map([
  ["USD", "SF43718"],
  ["EUR", "SF46410"],
  ["GBP", "SF46407"],
  ["JPY", "SF46406"],
  ["CAD", "SF60632"]
]), w = "https://www.banxico.org.mx/SieAPIRest/service/v1/series", p = 3e4;
function c(o) {
  const t = h.get(o);
  if (!t)
    throw new Error(`No hay serie Banxico configurada para la moneda: ${o}`);
  return t;
}
function m(o) {
  return o !== void 0 && o.trim() !== "" ? o.trim() : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function l(o, t) {
  const i = t.bmx?.series?.[0], r = i?.datos?.[i.datos.length - 1], n = r?.fecha, s = r?.dato;
  if (!n || s === void 0 || s === "")
    throw new Error("Respuesta Banxico sin observaciones en la serie solicitada");
  if (s === "N/E")
    throw new Error("Banxico reportó dato no disponible (N/E) para la fecha o serie");
  const a = Number.parseFloat(s.replace(/,/g, ""));
  if (!Number.isFinite(a))
    throw new Error(`Valor de tipo de cambio inválido: ${s}`);
  return {
    fecha: n,
    moneda: o,
    tipoCambio: a
  };
}
class b {
  token;
  timeoutMs;
  constructor(t) {
    if (!t.apiToken?.trim())
      throw new Error("BanxicoConfig.apiToken es obligatorio");
    this.token = t.apiToken.trim(), this.timeoutMs = t.timeout ?? p;
  }
  async fetchJson(t) {
    const e = new AbortController(), i = setTimeout(() => e.abort(), this.timeoutMs);
    try {
      const r = await fetch(t, {
        signal: e.signal,
        headers: { Accept: "application/json" }
      });
      if (!r.ok)
        throw new Error(`Banxico HTTP ${r.status}: ${r.statusText}`);
      return await r.json();
    } catch (r) {
      throw r instanceof Error && r.name === "AbortError" ? new Error(`Tiempo de espera agotado (${this.timeoutMs} ms) al consultar Banxico`) : r;
    } finally {
      clearTimeout(i);
    }
  }
  buildUrl(t) {
    const e = new URL(`${w}/${t}`);
    return e.searchParams.set("token", this.token), e.toString();
  }
  async obtenerTipoCambio(t, e) {
    const i = c(t), r = m(e), n = this.buildUrl(`${i}/datos/${r}/${r}`), s = await this.fetchJson(n);
    return l(t, s);
  }
  async obtenerTipoCambioActual(t) {
    const e = c(t), i = this.buildUrl(`${e}/datos/oportuno`), r = await this.fetchJson(i);
    return l(t, r);
  }
}
export {
  b as BanxicoClient,
  u as Moneda,
  h as SERIE_BANXICO
};
