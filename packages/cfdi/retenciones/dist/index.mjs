const u = "http://www.sat.gob.mx/esquemas/retencionpago/1", m = "http://www.sat.gob.mx/esquemas/retencionpago/2";
var s = /* @__PURE__ */ ((e) => (e.Arrendamiento = "14", e.Dividendos = "16", e.Intereses = "17", e.Fideicomiso = "18", e.EnajenacionAcciones = "19", e.Otro = "99", e))(s || {});
const o = "retenciones";
function n(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function i(e, t) {
  return t === void 0 || t === "" ? "" : ` ${e}="${n(t)}"`;
}
function R(e) {
  return `<${o}:Emisor Rfc="${n(e.Rfc)}"` + i("NomDenRazSocE", e.NomDenRazSocE) + ` RegimenFiscalE="${n(e.RegimenFiscalE)}"` + i("CURPE", e.CurpE) + "/>";
}
function $(e) {
  const t = e.NacionalidadR, r = t === "Nacional" ? e.nacional : void 0, a = t === "Extranjero" ? e.extranjero : void 0;
  let c = "";
  return r && (c += `<${o}:Nacional RFCRecep="${n(r.RfcRecep)}"` + i("NomDenRazSocR", r.NomDenRazSocR) + i("CURPR", r.CurpR) + "/>"), a && (c += `<${o}:Extranjero` + i("NumRegIdTrib", a.NumRegIdTrib) + ` NomDenRazSocR="${n(a.NomDenRazSocR)}"/>`), `<${o}:Receptor Nacionalidad="${n(t)}">${c}</${o}:Receptor>`;
}
function l(e) {
  if (!e?.length)
    return "";
  const t = e.map((r) => r.innerXml).join("");
  return `<${o}:Complemento>${t}</${o}:Complemento>`;
}
function E(e) {
  const t = e.totales, r = e.periodo, a = ` xmlns:${o}="${m}" Version="${n(e.Version)}" CveRetenc="${n(e.CveRetenc)}"` + i("DescRetenc", e.DescRetenc) + ` FechaExp="${n(e.FechaExp)}" LugarExpRet="${n(e.LugarExpRet)}"` + i("NumCert", e.NumCert) + i("FolioInt", e.FolioInt), c = R(e.emisor) + $(e.receptor) + `<${o}:Periodo MesIni="${n(r.MesIni)}" MesFin="${n(r.MesFin)}" Ejerc="${n(r.Ejerc)}"/><${o}:Totales montoTotOperacion="${n(t.montoTotOperacion)}" montoTotGrav="${n(t.montoTotGrav)}" montoTotExent="${n(t.montoTotExent)}" montoTotRet="${n(t.montoTotRet)}"/>` + l(e.complemento);
  return `<?xml version="1.0" encoding="UTF-8"?><${o}:Retenciones${a}>${c}</${o}:Retenciones>`;
}
export {
  u as RETENCION_PAGO_NAMESPACE_V1,
  m as RETENCION_PAGO_NAMESPACE_V2,
  s as TipoRetencion,
  E as buildRetencion20Xml
};
