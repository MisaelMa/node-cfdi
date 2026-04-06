const l = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc", d = "http://tempuri.org/IConsultaCFDIService/Consulta";
function u(t) {
  if (!t || !/^\d+(\.\d+)?$/.test(t.trim()))
    throw new Error(`Total invalido: '${t}'`);
  const [n, r = ""] = t.trim().split("."), e = n.padStart(10, "0"), o = r.padEnd(6, "0").slice(0, 6);
  return `${e}.${o}`;
}
function p(t) {
  const { rfcEmisor: n, rfcReceptor: r, total: e, uuid: o } = t, c = u(e);
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soap:Header/>
  <soap:Body>
    <tem:Consulta>
      <tem:expresionImpresa><![CDATA[${`?re=${n}&rr=${r}&tt=${c}&id=${o}`}]]></tem:expresionImpresa>
    </tem:Consulta>
  </soap:Body>
</soap:Envelope>`;
}
function a(t, n) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${n}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${n}>`,
    "i"
  ), e = t.match(r);
  return e ? e[1].trim() : "";
}
function E(t) {
  if (t.includes("<s:Fault>") || t.includes("<soap:Fault>")) {
    const s = a(t, "faultstring");
    throw new Error(`SOAP Fault: ${s || "Error desconocido del servicio"}`);
  }
  const n = a(t, "CodigoEstatus"), r = a(t, "EsCancelable"), e = a(t, "Estado"), o = a(t, "EstatusCancelacion"), c = a(t, "ValidacionEFOS");
  return {
    codigoEstatus: n,
    esCancelable: r,
    estado: e,
    estatusCancelacion: o,
    validacionEFOS: c,
    activo: e === "Vigente",
    cancelado: e === "Cancelado",
    noEncontrado: e === "No Encontrado"
  };
}
const i = 3e4;
async function m(t) {
  const n = p(t), r = new AbortController(), e = setTimeout(() => r.abort(), i);
  let o;
  try {
    o = await fetch(l, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: d
      },
      body: n,
      signal: r.signal
    });
  } catch (s) {
    throw s instanceof Error && s.name === "AbortError" ? new Error(
      `Timeout: el webservice del SAT no respondio en ${i / 1e3} segundos`
    ) : new Error(
      `Error de red al consultar el estado del CFDI: ${s instanceof Error ? s.message : String(s)}`
    );
  } finally {
    clearTimeout(e);
  }
  if (!o.ok)
    throw new Error(
      `El webservice del SAT retorno HTTP ${o.status}: ${o.statusText}`
    );
  const c = await o.text();
  return E(c);
}
export {
  d as SOAP_ACTION,
  l as WEBSERVICE_URL,
  p as buildSoapRequest,
  m as consultarEstado,
  u as formatTotal,
  E as parseSoapResponse
};
