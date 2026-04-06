var m = /* @__PURE__ */ ((e) => (e.ConRelacion = "01", e.SinRelacion = "02", e.NoOperacion = "03", e.FacturaGlobal = "04", e))(m || {}), f = /* @__PURE__ */ ((e) => (e.EnProceso = "EnProceso", e.Cancelado = "Cancelado", e.CancelacionRechazada = "Rechazada", e.Plazo = "Plazo", e))(f || {}), C = /* @__PURE__ */ ((e) => (e.Aceptacion = "Aceptacion", e.Rechazo = "Rechazo", e))(C || {});
function S(e, t, o, s, n, a) {
  const r = e.motivo === "01" && e.folioSustitucion ? ` FolioSustitucion="${e.folioSustitucion}"` : "";
  return `<?xml version="1.0" encoding="utf-8"?>
<Cancelacion xmlns="http://cancelacfd.sat.gob.mx"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             RfcEmisor="${t}"
             Fecha="${o}">
  <Folios>
    <Folio UUID="${e.uuid}"
           Motivo="${e.motivo}"${r}/>
  </Folios>
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <Reference URI="">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <DigestValue></DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>${n}</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509IssuerSerial>
          <X509SerialNumber>${a}</X509SerialNumber>
        </X509IssuerSerial>
        <X509Certificate>${s}</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</Cancelacion>`;
}
function E(e, t, o, s) {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
  <s:Header>
    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                s:mustUnderstand="1">
      <u:Timestamp>
        <u:Created>${t}</u:Created>
      </u:Timestamp>
      <o:BinarySecurityToken
        ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"
        EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
        ${o}
      </o:BinarySecurityToken>
    </o:Security>
  </s:Header>
  <s:Body>
    <CancelaCFD xmlns="http://tempuri.org/">
      <Cancelacion>${R(e)}</Cancelacion>
    </CancelaCFD>
  </s:Body>
</s:Envelope>`;
}
function R(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function l(e, t) {
  const o = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,
    "i"
  ), s = e.match(o);
  return s ? s[1].trim() : "";
}
function u(e, t) {
  const o = new RegExp(`${t}="([^"]*)"`, "i"), s = e.match(o);
  return s ? s[1] : "";
}
function y(e) {
  if (e.includes("<faultcode>") || e.includes(":Fault>")) {
    const p = l(e, "faultstring");
    throw new Error(
      `SOAP Fault: ${p || "Error desconocido del servicio de cancelacion"}`
    );
  }
  const t = l(e, "Folio") || l(e, "CancelaCFDResult"), o = u(t || e, "UUID") || u(e, "UUID"), s = u(t || e, "EstatusUUID") || u(e, "EstatusUUID"), n = u(e, "CodEstatus") || l(e, "CodEstatus"), a = u(e, "Mensaje") || l(e, "Mensaje"), c = {
    201: "Cancelado",
    202: "EnProceso",
    Cancelado: "Cancelado",
    EnProceso: "EnProceso"
  }[s] ?? "EnProceso";
  return { uuid: o, estatus: c, codEstatus: n, mensaje: a };
}
function x(e, t, o, s, n) {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
  <s:Header>
    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                s:mustUnderstand="1">
      <u:Timestamp>
        <u:Created>${t}</u:Created>
      </u:Timestamp>
      <o:BinarySecurityToken
        ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"
        EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
        ${o}
      </o:BinarySecurityToken>
    </o:Security>
  </s:Header>
  <s:Body>
    <ProcesarRespuesta xmlns="http://cancelacfd.sat.gob.mx/">
      <RfcReceptor>${e.rfcReceptor}</RfcReceptor>
      <UUID>${e.uuid}</UUID>
      <Respuesta>${e.respuesta}</Respuesta>
      <Fecha>${n}</Fecha>
      <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignedInfo>
          <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
          <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
          <Reference URI="">
            <Transforms>
              <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
            </Transforms>
            <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <DigestValue></DigestValue>
          </Reference>
        </SignedInfo>
        <SignatureValue>${s}</SignatureValue>
        <KeyInfo>
          <X509Data>
            <X509Certificate>${o}</X509Certificate>
          </X509Data>
        </KeyInfo>
      </Signature>
    </ProcesarRespuesta>
  </s:Body>
</s:Envelope>`;
}
function A(e, t, o, s) {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
  <s:Header>
    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                s:mustUnderstand="1">
      <u:Timestamp>
        <u:Created>${t}</u:Created>
      </u:Timestamp>
      <o:BinarySecurityToken
        ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"
        EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
        ${o}
      </o:BinarySecurityToken>
    </o:Security>
  </s:Header>
  <s:Body>
    <ConsultaPendientes xmlns="http://cancelacfd.sat.gob.mx/">
      <RfcReceptor>${e}</RfcReceptor>
    </ConsultaPendientes>
  </s:Body>
</s:Envelope>`;
}
function i(e, t) {
  const o = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,
    "i"
  ), s = e.match(o);
  return s ? s[1].trim() : "";
}
function d(e, t) {
  const o = new RegExp(`${t}="([^"]*)"`, "i"), s = e.match(o);
  return s ? s[1] : "";
}
function T(e) {
  if (e.includes("<faultcode>") || e.includes(":Fault>")) {
    const n = i(e, "faultstring");
    throw new Error(
      `SOAP Fault: ${n || "Error desconocido del servicio"}`
    );
  }
  const t = d(e, "UUID") || i(e, "UUID"), o = d(e, "CodEstatus") || i(e, "CodEstatus"), s = d(e, "Mensaje") || i(e, "Mensaje");
  return { uuid: t, codEstatus: o, mensaje: s };
}
function $(e) {
  if (e.includes("<faultcode>") || e.includes(":Fault>")) {
    const n = i(e, "faultstring");
    throw new Error(
      `SOAP Fault: ${n || "Error desconocido del servicio"}`
    );
  }
  const t = [], o = /<(?:[a-zA-Z0-9_]+:)?UUID[^>]*>([^<]+)<\/(?:[a-zA-Z0-9_]+:)?UUID>/gi;
  let s;
  for (; (s = o.exec(e)) !== null; ) {
    const n = e.substring(
      Math.max(0, s.index - 500),
      s.index + s[0].length + 500
    );
    t.push({
      uuid: s[1].trim(),
      rfcEmisor: i(n, "RfcEmisor") || d(n, "RfcEmisor"),
      fechaSolicitud: i(n, "FechaSolicitud") || d(n, "FechaSolicitud")
    });
  }
  return t;
}
const I = "https://cancelacfd.sat.gob.mx/CancelaCFDService.svc", g = "https://cancelacfd.sat.gob.mx/AceptacionRechazo/AceptacionRechazoService.svc", v = "http://cancelacfd.sat.gob.mx/ICancelaCFDService/CancelaCFD", _ = "http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ProcesarRespuesta", D = "http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ConsultaPendientes", h = 6e4;
class P {
  constructor(t, o) {
    this._token = t, this._credential = o;
  }
  _token;
  _credential;
  /**
   * Cancela un CFDI ante el SAT.
   */
  async cancelar(t) {
    const o = t.rfcEmisor || this._credential.rfc(), s = (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, ""), { cert: n, signatureValue: a, serialNumber: r } = this._signComponents(
      `CancelaCFD-${t.uuid}`
    ), c = S(
      t,
      o,
      s,
      n,
      a,
      r
    ), p = E(
      c,
      this._token.value,
      n
    ), w = await this._post(I, v, p);
    return y(w);
  }
  /**
   * Acepta o rechaza la cancelacion de un CFDI recibido.
   * El receptor tiene 72 horas para responder.
   */
  async aceptarRechazar(t) {
    const o = (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, ""), { cert: s, signatureValue: n } = this._signComponents(
      `AceptacionRechazo-${t.uuid}`
    ), a = x(
      t,
      this._token.value,
      s,
      n,
      o
    ), r = await this._post(
      g,
      _,
      a
    );
    return T(r);
  }
  /**
   * Consulta los CFDIs pendientes de aceptar/rechazar cancelacion.
   */
  async consultarPendientes() {
    const t = this._credential.rfc(), { cert: o, signatureValue: s } = this._signComponents(
      `ConsultaPendientes-${t}`
    ), n = A(
      t,
      this._token.value,
      o
    ), a = await this._post(
      g,
      D,
      n
    );
    return $(a);
  }
  _signComponents(t) {
    const o = this._credential.sign(t), n = this._credential.certificate.toPem().replace(/-----BEGIN CERTIFICATE-----/g, "").replace(/-----END CERTIFICATE-----/g, "").replace(/\s+/g, ""), a = this._credential.certificate.serialNumber();
    return { cert: n, signatureValue: o, serialNumber: a };
  }
  async _post(t, o, s) {
    const n = new AbortController(), a = setTimeout(() => n.abort(), h);
    let r;
    try {
      r = await fetch(t, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: `"${o}"`
        },
        body: s,
        signal: n.signal
      });
    } catch (c) {
      throw c instanceof Error && c.name === "AbortError" ? new Error(
        `Timeout: el webservice de cancelacion no respondio en ${h / 1e3} segundos`
      ) : new Error(
        `Error de red al conectar con el servicio de cancelacion: ${c instanceof Error ? c.message : String(c)}`
      );
    } finally {
      clearTimeout(a);
    }
    if (!r.ok)
      throw new Error(
        `El webservice de cancelacion retorno HTTP ${r.status}: ${r.statusText}`
      );
    return r.text();
  }
}
export {
  P as CancelacionCfdi,
  f as EstatusCancelacion,
  m as MotivoCancelacion,
  C as RespuestaAceptacionRechazo,
  x as buildAceptacionRechazoRequest,
  S as buildCancelacionXml,
  E as buildCancelarRequest,
  A as buildConsultaPendientesRequest,
  T as parseAceptacionRechazoResponse,
  y as parseCancelarResponse,
  $ as parsePendientesResponse
};
