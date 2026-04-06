var m = /* @__PURE__ */ ((o) => (o.ProveedorNacional = "04", o.ProveedorExtranjero = "05", o.ProveedorGlobal = "15", o))(m || {}), d = /* @__PURE__ */ ((o) => (o.ProfesionalesHonorarios = "85", o.Arrendamiento = "06", o.OtrosConIVA = "03", o.OtrosSinIVA = "04", o))(d || {});
function e(o, n) {
  if (!Number.isFinite(o) || o < 0)
    throw new Error(`${n}: el monto debe ser un número finito mayor o igual a cero`);
  const r = Math.round(o * 100) / 100;
  if (Math.abs(o - r) > 1e-9)
    throw new Error(
      `${n}: los montos deben tener como máximo 2 decimales (formato de pesos)`
    );
  return r.toFixed(2);
}
function t(o) {
  return (o ?? "").trim();
}
function c(o) {
  const n = e(o.montoIva16, "montoIva16"), r = e(o.montoIva0, "montoIva0"), i = e(o.montoExento, "montoExento"), a = e(o.montoRetenido, "montoRetenido"), s = e(o.montoIvaNoDeduc, "montoIvaNoDeduc");
  return [
    o.tipoTercero,
    o.tipoOperacion,
    t(o.rfc),
    t(o.idFiscal),
    t(o.nombreExtranjero),
    t(o.paisResidencia),
    t(o.nacionalidad),
    n,
    r,
    i,
    a,
    s
  ].join("|");
}
function f(o) {
  return o.operaciones.length ? o.operaciones.map((n) => c(n)).join(`
`) : "";
}
export {
  d as TipoOperacion,
  m as TipoTercero,
  f as buildDiotTxt
};
