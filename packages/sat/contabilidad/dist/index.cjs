"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});var C=(a=>(a.Normal="N",a.Complementaria="C",a))(C||{}),d=(a=>(a.Cierre="C",a.Apertura="A",a))(d||{}),x=(a=>(a.Deudora="D",a.Acreedora="A",a))(x||{}),p=(a=>(a.V1_1="1.1",a.V1_3="1.3",a))(p||{});const u="http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/BalanzaComprobacion";function b(a,l,e="1.3"){const i=e==="1.3"?u:u.replace("1_3","1_1"),s=l.map(t=>`  <BCE:Ctas NumCta="${t.numCta}" SaldoIni="${t.saldoIni.toFixed(2)}" Debe="${t.debe.toFixed(2)}" Haber="${t.haber.toFixed(2)}" SaldoFin="${t.saldoFin.toFixed(2)}"/>`).join(`
`);return`<?xml version="1.0" encoding="utf-8"?>
<BCE:Balanza xmlns:BCE="${i}"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             Version="${e}"
             RFC="${a.rfc}"
             Mes="${a.mes}"
             Anio="${a.anio}"
             TipoEnvio="${a.tipoEnvio}">
${s}
</BCE:Balanza>`}const m="http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/CatalogoCuentas";function w(a,l,e="1.3"){const i=e==="1.3"?m:m.replace("1_3","1_1"),s=l.map(t=>{const o=t.subCtaDe?` SubCtaDe="${t.subCtaDe}"`:"";return`  <catalogocuentas:Ctas CodAgrup="${t.codAgrup}" NumCta="${t.numCta}" Desc="${t.desc}"${o} Nivel="${t.nivel}" Natur="${t.natur}"/>`}).join(`
`);return`<?xml version="1.0" encoding="utf-8"?>
<catalogocuentas:Catalogo xmlns:catalogocuentas="${i}"
                          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                          Version="${e}"
                          RFC="${a.rfc}"
                          Mes="${a.mes}"
                          Anio="${a.anio}"
                          TipoEnvio="${a.tipoEnvio}">
${s}
</catalogocuentas:Catalogo>`}const c="http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/PolizasPeriodo";function g(a,l,e,i="1.3"){const s=i==="1.3"?c:c.replace("1_3","1_1"),t=l.map(o=>{const r=o.detalle.map(n=>`      <PLZ:Transaccion NumCta="${n.numCta}" Concepto="${n.concepto}" Debe="${n.debe.toFixed(2)}" Haber="${n.haber.toFixed(2)}"/>`).join(`
`);return`    <PLZ:Poliza NumUnIdenPol="${o.numPoliza}" Fecha="${o.fecha}" Concepto="${o.concepto}">
${r}
    </PLZ:Poliza>`}).join(`
`);return`<?xml version="1.0" encoding="utf-8"?>
<PLZ:Polizas xmlns:PLZ="${s}"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             Version="${i}"
             RFC="${a.rfc}"
             Mes="${a.mes}"
             Anio="${a.anio}"
             TipoEnvio="${a.tipoEnvio}"
             TipoSolicitud="${e}">
${t}
</PLZ:Polizas>`}const $="http://www.sat.gob.mx/esquemas/ContabilidadE/1_3/AuxiliarCtas";function A(a,l,e,i="1.3"){const s=i==="1.3"?$:$.replace("1_3","1_1"),t=l.map(o=>{const r=o.transacciones.map(n=>`      <AuxiliarCtas:DetalleAux Fecha="${n.fecha}" NumUnIdenPol="${n.numPoliza}" Concepto="${n.concepto}" Debe="${n.debe.toFixed(2)}" Haber="${n.haber.toFixed(2)}"/>`).join(`
`);return`    <AuxiliarCtas:Cuenta NumCta="${o.numCta}" DesCta="${o.desCta}" SaldoIni="${o.saldoIni.toFixed(2)}" SaldoFin="${o.saldoFin.toFixed(2)}">
${r}
    </AuxiliarCtas:Cuenta>`}).join(`
`);return`<?xml version="1.0" encoding="utf-8"?>
<AuxiliarCtas:AuxiliarCtas xmlns:AuxiliarCtas="${s}"
                           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                           Version="${i}"
                           RFC="${a.rfc}"
                           Mes="${a.mes}"
                           Anio="${a.anio}"
                           TipoEnvio="${a.tipoEnvio}"
                           TipoSolicitud="${e}">
${t}
</AuxiliarCtas:AuxiliarCtas>`}exports.NaturalezaCuenta=x;exports.TipoAjuste=d;exports.TipoEnvio=C;exports.VersionContabilidad=p;exports.buildAuxiliarXml=A;exports.buildBalanzaXml=b;exports.buildCatalogoXml=w;exports.buildPolizasXml=g;
