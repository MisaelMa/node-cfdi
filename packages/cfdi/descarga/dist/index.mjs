import { createHash as R } from "crypto";
var A = /* @__PURE__ */ ((e) => (e.CFDI = "CFDI", e.Metadata = "Metadata", e))(A || {}), C = /* @__PURE__ */ ((e) => (e.Emitidos = "RfcEmisor", e.Recibidos = "RfcReceptor", e))(C || {}), w = /* @__PURE__ */ ((e) => (e[e.Aceptada = 1] = "Aceptada", e[e.EnProceso = 2] = "EnProceso", e[e.Terminada = 3] = "Terminada", e[e.Error = 4] = "Error", e[e.Rechazada = 5] = "Rechazada", e[e.Vencida = 6] = "Vencida", e))(w || {}), y = /* @__PURE__ */ ((e) => (e.Cancelado = "0", e.Vigente = "1", e))(y || {});
const $ = {
  1: "Aceptada",
  2: "En proceso",
  3: "Terminada",
  4: "Error",
  5: "Rechazada",
  6: "Vencida"
}, q = "http://DescargaMasivaTerceros.sat.gob.mx/";
function E(e, t, r, s) {
  const {
    rfcSolicitante: a,
    fechaInicio: o,
    fechaFin: n,
    tipoSolicitud: i,
    tipoDescarga: c,
    rfcEmisor: d,
    rfcReceptor: T,
    estadoComprobante: h
  } = e, I = c === "RfcEmisor" ? `RfcEmisor="${d ?? a}"` : `RfcReceptor="${T ?? a}"`, D = h != null ? ` EstadoComprobante="${h}"` : "";
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx/"
            xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
  <s:Header>
    <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <u:Timestamp>
        <u:Created>${t}</u:Created>
      </u:Timestamp>
      <xd:Signature>
        <xd:SignedInfo>
          <xd:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          <xd:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
          <xd:Reference URI="#_0">
            <xd:Transforms>
              <xd:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            </xd:Transforms>
            <xd:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <xd:DigestValue></xd:DigestValue>
          </xd:Reference>
        </xd:SignedInfo>
        <xd:SignatureValue>${s}</xd:SignatureValue>
        <xd:KeyInfo>
          <xd:X509Data>
            <xd:X509Certificate>${r}</xd:X509Certificate>
          </xd:X509Data>
        </xd:KeyInfo>
      </xd:Signature>
    </h:Security>
  </s:Header>
  <s:Body>
    <des:SolicitaDescarga>
      <des:solicitud ${I}
                     FechaInicial="${o}T00:00:00"
                     FechaFinal="${n}T23:59:59"
                     RfcSolicitante="${a}"
                     TipoSolicitud="${i}"${D}>
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                      Id="SelloDigital">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <ds:Reference URI="">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              </ds:Transforms>
              <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
              <ds:DigestValue></ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>${s}</ds:SignatureValue>
          <ds:KeyInfo>
            <ds:X509Data>
              <ds:X509Certificate>${r}</ds:X509Certificate>
            </ds:X509Data>
          </ds:KeyInfo>
        </ds:Signature>
      </des:solicitud>
    </des:SolicitaDescarga>
  </s:Body>
</s:Envelope>`;
}
function v(e, t) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,
    "i"
  ), s = e.match(r);
  return s ? s[1].trim() : "";
}
function m(e, t) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}((?:\\s+[^>]*)?)(?:\\/>|>)`,
    "i"
  ), s = e.match(r);
  return s ? s[0] : "";
}
function u(e, t) {
  const r = new RegExp(`${t}="([^"]*)"`, "i"), s = e.match(r);
  return s ? s[1] : "";
}
function V(e) {
  if (e.includes("<faultcode>") || e.includes(":Fault>")) {
    const n = v(e, "faultstring");
    throw new Error(
      `SOAP Fault: ${n || "Error desconocido del servicio"}`
    );
  }
  const r = m(e, "SolicitaDescargaResult") || m(
    e,
    "RespuestaSolicitudDescMasivaTercerosSolicitud"
  ) || e, s = u(r, "IdSolicitud"), a = u(r, "CodEstatus"), o = u(r, "Mensaje");
  return { idSolicitud: s, codEstatus: a, mensaje: o };
}
function _(e, t, r, s, a) {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx/"
            xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
  <s:Header>
    <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <u:Timestamp>
        <u:Created>${r}</u:Created>
      </u:Timestamp>
      <xd:Signature>
        <xd:SignedInfo>
          <xd:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          <xd:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
          <xd:Reference URI="#_0">
            <xd:Transforms>
              <xd:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            </xd:Transforms>
            <xd:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <xd:DigestValue></xd:DigestValue>
          </xd:Reference>
        </xd:SignedInfo>
        <xd:SignatureValue>${a}</xd:SignatureValue>
        <xd:KeyInfo>
          <xd:X509Data>
            <xd:X509Certificate>${s}</xd:X509Certificate>
          </xd:X509Data>
        </xd:KeyInfo>
      </xd:Signature>
    </h:Security>
  </s:Header>
  <s:Body>
    <des:VerificaSolicitudDescarga>
      <des:solicitud IdSolicitud="${e}"
                     RfcSolicitante="${t}">
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                      Id="SelloDigital">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <ds:Reference URI="">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              </ds:Transforms>
              <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
              <ds:DigestValue></ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>${a}</ds:SignatureValue>
          <ds:KeyInfo>
            <ds:X509Data>
              <ds:X509Certificate>${s}</ds:X509Certificate>
            </ds:X509Data>
          </ds:KeyInfo>
        </ds:Signature>
      </des:solicitud>
    </des:VerificaSolicitudDescarga>
  </s:Body>
</s:Envelope>`;
}
function M(e, t) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,
    "i"
  ), s = e.match(r);
  return s ? s[1].trim() : "";
}
function x(e, t) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}((?:\\s+[^>]*)?)(?:\\/?>|>)`,
    "i"
  ), s = e.match(r);
  return s ? s[0] : "";
}
function g(e, t) {
  const r = new RegExp(`${t}="([^"]*)"`, "i"), s = e.match(r);
  return s ? s[1] : "";
}
function b(e, t) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,
    "gi"
  ), s = [];
  let a;
  for (; (a = r.exec(e)) !== null; ) {
    const o = a[1].trim();
    o && s.push(o);
  }
  return s;
}
function X(e) {
  if (e.includes("<faultcode>") || e.includes(":Fault>")) {
    const d = M(e, "faultstring");
    throw new Error(
      `SOAP Fault: ${d || "Error desconocido del servicio"}`
    );
  }
  const t = x(e, "VerificaSolicitudDescargaResult") || x(e, "RespuestaVerificaSolicitudDescMasivaTercerosSolicitud"), r = g(t || e, "CodEstatus"), s = g(t || e, "Mensaje"), a = g(t || e, "EstadoSolicitud"), o = g(t || e, "NumeroCFDIs"), n = b(e, "IdsPaquetes"), i = parseInt(a, 10), c = Object.values(w).includes(i) ? i : w.Error;
  return {
    estado: c,
    estadoDescripcion: $[c] ?? "Desconocido",
    codEstatus: r,
    mensaje: s,
    idsPaquetes: n,
    numeroCfdis: parseInt(o, 10) || 0
  };
}
function z(e, t, r, s, a) {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx/"
            xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
  <s:Header>
    <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <u:Timestamp>
        <u:Created>${r}</u:Created>
      </u:Timestamp>
      <xd:Signature>
        <xd:SignedInfo>
          <xd:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          <xd:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
          <xd:Reference URI="#_0">
            <xd:Transforms>
              <xd:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            </xd:Transforms>
            <xd:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <xd:DigestValue></xd:DigestValue>
          </xd:Reference>
        </xd:SignedInfo>
        <xd:SignatureValue>${a}</xd:SignatureValue>
        <xd:KeyInfo>
          <xd:X509Data>
            <xd:X509Certificate>${s}</xd:X509Certificate>
          </xd:X509Data>
        </xd:KeyInfo>
      </xd:Signature>
    </h:Security>
  </s:Header>
  <s:Body>
    <des:PeticionDescargaMasivaTercerosEntrada>
      <des:peticionDescarga IdPaquete="${e}"
                            RfcSolicitante="${t}">
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                      Id="SelloDigital">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <ds:Reference URI="">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              </ds:Transforms>
              <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
              <ds:DigestValue></ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>${a}</ds:SignatureValue>
          <ds:KeyInfo>
            <ds:X509Data>
              <ds:X509Certificate>${s}</ds:X509Certificate>
            </ds:X509Data>
          </ds:KeyInfo>
        </ds:Signature>
      </des:peticionDescarga>
    </des:PeticionDescargaMasivaTercerosEntrada>
  </s:Body>
</s:Envelope>`;
}
function l(e, t) {
  const r = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,
    "i"
  ), s = e.match(r);
  return s ? s[1].trim() : "";
}
function P(e) {
  if (e.includes("<faultcode>") || e.includes(":Fault>")) {
    const r = l(e, "faultstring");
    throw new Error(
      `SOAP Fault: ${r || "Error desconocido del servicio"}`
    );
  }
  const t = l(e, "Paquete") || l(e, "RespuestaDescargaMasivaTercerosSalida");
  if (!t)
    throw new Error(
      "La respuesta del SAT no contiene el elemento Paquete con el ZIP"
    );
  return Buffer.from(t.replace(/\s+/g, ""), "base64");
}
function f(e) {
  return e.replace(/<\?xml[^?]*\?>\s*/g, "").trim();
}
function O(e) {
  return R("sha256").update(e, "utf8").digest("base64");
}
function L(e, t, r = "_0") {
  const s = f(e), a = O(s), o = S(a, r), n = f(o), i = t.sign(n), d = t.certificate.toPem().replace(/-----BEGIN CERTIFICATE-----/g, "").replace(/-----END CERTIFICATE-----/g, "").replace(/\s+/g, "");
  return {
    bodyDigest: a,
    signatureValue: i,
    x509Certificate: d,
    bodyId: r
  };
}
function S(e, t) {
  return `<ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#${t}"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>${e}</ds:DigestValue></ds:Reference></ds:SignedInfo>`;
}
function N(e, t) {
  const { bodyDigest: r, signatureValue: s, x509Certificate: a, bodyId: o } = e, n = S(r, o);
  return `<s:Header>
  <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
              xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <u:Timestamp>
      <u:Created>${t}</u:Created>
    </u:Timestamp>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      ${n}
      <ds:SignatureValue>${s}</ds:SignatureValue>
      <ds:KeyInfo>
        <o:SecurityTokenReference xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
          <o:KeyIdentifier ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3SubjectKeyIdentifier"
                           EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
            ${a.substring(0, 40)}
          </o:KeyIdentifier>
        </o:SecurityTokenReference>
      </ds:KeyInfo>
    </ds:Signature>
  </h:Security>
</s:Header>`;
}
const F = "https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc", K = "https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc", B = "https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc", U = "http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga", H = "http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga", Z = "http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar", p = 6e4;
class j {
  constructor(t, r) {
    this._token = t, this._credential = r;
  }
  _token;
  _credential;
  /**
   * Paso 1: Solicita una descarga masiva de CFDIs al SAT.
   *
   * @param params - Parametros de la solicitud (RFC, fechas, tipo, etc.)
   * @returns IdSolicitud para consultar el estado con verificar()
   */
  async solicitar(t) {
    const { cert: r, signatureValue: s } = this._signComponents(
      `SolicitudDescarga-${t.rfcSolicitante}`
    ), a = E(
      t,
      this._token.value,
      r,
      s
    ), o = await this._post(F, U, a);
    return V(o);
  }
  /**
   * Paso 2: Verifica el estado de una solicitud previa.
   *
   * Cuando estado === EstadoSolicitud.Terminada (3), la respuesta incluye
   * los idsPaquetes listos para descargar.
   *
   * @param idSolicitud - ID obtenido en solicitar()
   */
  async verificar(t) {
    const r = this._credential.rfc(), { cert: s, signatureValue: a } = this._signComponents(
      `VerificaSolicitud-${t}`
    ), o = _(
      t,
      r,
      this._token.value,
      s,
      a
    ), n = await this._post(K, H, o);
    return X(n);
  }
  /**
   * Paso 3: Descarga un paquete ZIP de CFDIs por su ID.
   *
   * El ZIP contiene los XMLs de los CFDIs de la solicitud.
   *
   * @param idPaquete - ID del paquete obtenido en verificar()
   * @returns Buffer con el contenido del ZIP
   */
  async descargar(t) {
    const r = this._credential.rfc(), { cert: s, signatureValue: a } = this._signComponents(
      `Descarga-${t}`
    ), o = z(
      t,
      r,
      this._token.value,
      s,
      a
    ), n = await this._post(B, Z, o);
    return P(n);
  }
  /**
   * Genera los componentes de firma (certificado y valor de firma) a partir
   * del contenido a firmar y la credencial FIEL.
   */
  _signComponents(t) {
    const r = this._credential.sign(t);
    return { cert: this._credential.certificate.toPem().replace(/-----BEGIN CERTIFICATE-----/g, "").replace(/-----END CERTIFICATE-----/g, "").replace(/\s+/g, ""), signatureValue: r };
  }
  /**
   * Realiza una peticion HTTP POST SOAP con timeout.
   */
  async _post(t, r, s) {
    const a = new AbortController(), o = setTimeout(() => a.abort(), p);
    let n;
    try {
      n = await fetch(t, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: `"${r}"`
        },
        body: s,
        signal: a.signal
      });
    } catch (i) {
      throw i instanceof Error && i.name === "AbortError" ? new Error(
        `Timeout: el webservice del SAT no respondio en ${p / 1e3} segundos`
      ) : new Error(
        `Error de red al conectar con el SAT: ${i instanceof Error ? i.message : String(i)}`
      );
    } finally {
      clearTimeout(o);
    }
    if (!n.ok)
      throw new Error(
        `El webservice del SAT retorno HTTP ${n.status}: ${n.statusText}`
      );
    return n.text();
  }
}
export {
  j as DescargaMasiva,
  $ as ESTADO_DESCRIPCION,
  y as EstadoComprobante,
  w as EstadoSolicitud,
  q as NS_DM_SOLICITUD,
  C as TipoDescarga,
  A as TipoSolicitud,
  z as buildDescargarRequest,
  N as buildSecurityHeader,
  E as buildSolicitarRequest,
  _ as buildVerificarRequest,
  f as canonicalize,
  O as digestSha256,
  P as parseDescargarResponse,
  V as parseSolicitarResponse,
  X as parseVerificarResponse,
  L as signSoapBody
};
