const l = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc", d = "http://tempuri.org/IConsultaCFDIService/Consulta";
function u(t) {
  const e = parseFloat(t);
  if (isNaN(e))
    throw new Error(`Total invalido: '${t}'`);
  const r = e.toFixed(6), [o, n] = r.split(".");
  return `${o.padStart(10, "0")}.${n}`;
}
function p(t) {
  const { rfcEmisor: e, rfcReceptor: r, total: o, uuid: n } = t, a = u(o);
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soap:Header/>
  <soap:Body>
    <tem:Consulta>
      <tem:expresionImpresa><![CDATA[${`?re=${e}&rr=${r}&tt=${a}&id=${n}`}]]></tem:expresionImpresa>
    </tem:Consulta>
  </soap:Body>
</soap:Envelope>`;
}
function c(t, e) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${e}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${e}>`,
    "i"
  ), o = t.match(r);
  return o ? o[1].trim() : "";
}
function E(t) {
  if (t.includes("<s:Fault>") || t.includes("<soap:Fault>")) {
    const s = c(t, "faultstring");
    throw new Error(`SOAP Fault: ${s || "Error desconocido del servicio"}`);
  }
  const e = c(t, "CodigoEstatus"), r = c(t, "EsCancelable"), o = c(t, "Estado"), n = c(t, "EstatusCancelacion"), a = c(t, "ValidacionEFOS");
  return {
    codigoEstatus: e,
    esCancelable: r,
    estado: o,
    estatusCancelacion: n,
    validacionEFOS: a,
    activo: o === "Vigente",
    cancelado: o === "Cancelado",
    noEncontrado: o === "No Encontrado"
  };
}
const i = 3e4;
async function m(t) {
  const e = p(t), r = new AbortController(), o = setTimeout(() => r.abort(), i);
  let n;
  try {
    n = await fetch(l, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: d
      },
      body: e,
      signal: r.signal
    });
  } catch (s) {
    throw s instanceof Error && s.name === "AbortError" ? new Error(
      `Timeout: el webservice del SAT no respondio en ${i / 1e3} segundos`
    ) : new Error(
      `Error de red al consultar el estado del CFDI: ${s instanceof Error ? s.message : String(s)}`
    );
  } finally {
    clearTimeout(o);
  }
  if (!n.ok)
    throw new Error(
      `El webservice del SAT retorno HTTP ${n.status}: ${n.statusText}`
    );
  const a = await n.text();
  return E(a);
}
export {
  d as SOAP_ACTION,
  l as WEBSERVICE_URL,
  p as buildSoapRequest,
  m as consultarEstado,
  u as formatTotal,
  E as parseSoapResponse
};
