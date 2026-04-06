var C = /* @__PURE__ */ ((a) => (a.Normal = "N", a.Complementaria = "C", a))(C || {}), d = /* @__PURE__ */ ((a) => (a.Cierre = "C", a.Apertura = "A", a))(d || {}), x = /* @__PURE__ */ ((a) => (a.Deudora = "D", a.Acreedora = "A", a))(x || {}), p = /* @__PURE__ */ ((a) => (a.V1_1 = "1.1", a.V1_3 = "1.3", a))(p || {});
const u = "http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/BalanzaComprobacion";
function b(a, s, e = "1.3") {
  const i = e === "1.3" ? u : u.replace("1_3", "1_1"), l = s.map(
    (t) => `  <BCE:Ctas NumCta="${t.numCta}" SaldoIni="${t.saldoIni.toFixed(2)}" Debe="${t.debe.toFixed(2)}" Haber="${t.haber.toFixed(2)}" SaldoFin="${t.saldoFin.toFixed(2)}"/>`
  ).join(`
`);
  return `<?xml version="1.0" encoding="utf-8"?>
<BCE:Balanza xmlns:BCE="${i}"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             Version="${e}"
             RFC="${a.rfc}"
             Mes="${a.mes}"
             Anio="${a.anio}"
             TipoEnvio="${a.tipoEnvio}">
${l}
</BCE:Balanza>`;
}
const c = "http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/CatalogoCuentas";
function w(a, s, e = "1.3") {
  const i = e === "1.3" ? c : c.replace("1_3", "1_1"), l = s.map((t) => {
    const n = t.subCtaDe ? ` SubCtaDe="${t.subCtaDe}"` : "";
    return `  <catalogocuentas:Ctas CodAgrup="${t.codAgrup}" NumCta="${t.numCta}" Desc="${t.desc}"${n} Nivel="${t.nivel}" Natur="${t.natur}"/>`;
  }).join(`
`);
  return `<?xml version="1.0" encoding="utf-8"?>
<catalogocuentas:Catalogo xmlns:catalogocuentas="${i}"
                          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                          Version="${e}"
                          RFC="${a.rfc}"
                          Mes="${a.mes}"
                          Anio="${a.anio}"
                          TipoEnvio="${a.tipoEnvio}">
${l}
</catalogocuentas:Catalogo>`;
}
const m = "http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/PolizasPeriodo";
function A(a, s, e, i = "1.3") {
  const l = i === "1.3" ? m : m.replace("1_3", "1_1"), t = s.map((n) => {
    const r = n.detalle.map(
      (o) => `      <PLZ:Transaccion NumCta="${o.numCta}" Concepto="${o.concepto}" Debe="${o.debe.toFixed(2)}" Haber="${o.haber.toFixed(2)}"/>`
    ).join(`
`);
    return `    <PLZ:Poliza NumUnIdenPol="${n.numPoliza}" Fecha="${n.fecha}" Concepto="${n.concepto}">
${r}
    </PLZ:Poliza>`;
  }).join(`
`);
  return `<?xml version="1.0" encoding="utf-8"?>
<PLZ:Polizas xmlns:PLZ="${l}"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             Version="${i}"
             RFC="${a.rfc}"
             Mes="${a.mes}"
             Anio="${a.anio}"
             TipoEnvio="${a.tipoEnvio}"
             TipoSolicitud="${e}">
${t}
</PLZ:Polizas>`;
}
const $ = "http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/AuxiliarCtas";
function g(a, s, e, i = "1.3") {
  const l = i === "1.3" ? $ : $.replace("1_3", "1_1"), t = s.map((n) => {
    const r = n.transacciones.map(
      (o) => `      <AuxiliarCtas:DetalleAux Fecha="${o.fecha}" NumUnIdenPol="${o.numPoliza}" Concepto="${o.concepto}" Debe="${o.debe.toFixed(2)}" Haber="${o.haber.toFixed(2)}"/>`
    ).join(`
`);
    return `    <AuxiliarCtas:Cuenta NumCta="${n.numCta}" DesCta="${n.desCta}" SaldoIni="${n.saldoIni.toFixed(2)}" SaldoFin="${n.saldoFin.toFixed(2)}">
${r}
    </AuxiliarCtas:Cuenta>`;
  }).join(`
`);
  return `<?xml version="1.0" encoding="utf-8"?>
<AuxiliarCtas:AuxiliarCtas xmlns:AuxiliarCtas="${l}"
                           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                           Version="${i}"
                           RFC="${a.rfc}"
                           Mes="${a.mes}"
                           Anio="${a.anio}"
                           TipoEnvio="${a.tipoEnvio}"
                           TipoSolicitud="${e}">
${t}
</AuxiliarCtas:AuxiliarCtas>`;
}
export {
  x as NaturalezaCuenta,
  d as TipoAjuste,
  C as TipoEnvio,
  p as VersionContabilidad,
  g as buildAuxiliarXml,
  b as buildBalanzaXml,
  w as buildCatalogoXml,
  A as buildPolizasXml
};
