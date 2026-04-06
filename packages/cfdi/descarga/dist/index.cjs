"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const X=require("crypto");var S=(e=>(e.CFDI="CFDI",e.Metadata="Metadata",e))(S||{}),D=(e=>(e.Emitidos="RfcEmisor",e.Recibidos="RfcReceptor",e))(D||{}),u=(e=>(e[e.Aceptada=1]="Aceptada",e[e.EnProceso=2]="EnProceso",e[e.Terminada=3]="Terminada",e[e.Error=4]="Error",e[e.Rechazada=5]="Rechazada",e[e.Vencida=6]="Vencida",e))(u||{}),T=(e=>(e.Cancelado="0",e.Vigente="1",e))(T||{});const I={1:"Aceptada",2:"En proceso",3:"Terminada",4:"Error",5:"Rechazada",6:"Vencida"},O="http://DescargaMasivaTerceros.sat.gob.mx/";function R(e,t,r,s){const{rfcSolicitante:a,fechaInicio:o,fechaFin:i,tipoSolicitud:n,tipoDescarga:c,rfcEmisor:d,rfcReceptor:_,estadoComprobante:m}=e,M=c==="RfcEmisor"?`RfcEmisor="${d??a}"`:`RfcReceptor="${_??a}"`,b=m!=null?` EstadoComprobante="${m}"`:"";return`<?xml version="1.0" encoding="utf-8"?>
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
      <des:solicitud ${M}
                     FechaInicial="${o}T00:00:00"
                     FechaFinal="${i}T23:59:59"
                     RfcSolicitante="${a}"
                     TipoSolicitud="${n}"${b}>
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
</s:Envelope>`}function P(e,t){const r=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,"i"),s=e.match(r);return s?s[1].trim():""}function x(e,t){const r=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}((?:\\s+[^>]*)?)(?:\\/>|>)`,"i"),s=e.match(r);return s?s[0]:""}function l(e,t){const r=new RegExp(`${t}="([^"]*)"`,"i"),s=e.match(r);return s?s[1]:""}function A(e){if(e.includes("<faultcode>")||e.includes(":Fault>")){const i=P(e,"faultstring");throw new Error(`SOAP Fault: ${i||"Error desconocido del servicio"}`)}const r=x(e,"SolicitaDescargaResult")||x(e,"RespuestaSolicitudDescMasivaTercerosSolicitud")||e,s=l(r,"IdSolicitud"),a=l(r,"CodEstatus"),o=l(r,"Mensaje");return{idSolicitud:s,codEstatus:a,mensaje:o}}function C(e,t,r,s,a){return`<?xml version="1.0" encoding="utf-8"?>
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
</s:Envelope>`}function z(e,t){const r=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,"i"),s=e.match(r);return s?s[1].trim():""}function p(e,t){const r=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}((?:\\s+[^>]*)?)(?:\\/?>|>)`,"i"),s=e.match(r);return s?s[0]:""}function g(e,t){const r=new RegExp(`${t}="([^"]*)"`,"i"),s=e.match(r);return s?s[1]:""}function F(e,t){const r=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,"gi"),s=[];let a;for(;(a=r.exec(e))!==null;){const o=a[1].trim();o&&s.push(o)}return s}function y(e){if(e.includes("<faultcode>")||e.includes(":Fault>")){const d=z(e,"faultstring");throw new Error(`SOAP Fault: ${d||"Error desconocido del servicio"}`)}const t=p(e,"VerificaSolicitudDescargaResult")||p(e,"RespuestaVerificaSolicitudDescMasivaTercerosSolicitud"),r=g(t||e,"CodEstatus"),s=g(t||e,"Mensaje"),a=g(t||e,"EstadoSolicitud"),o=g(t||e,"NumeroCFDIs"),i=F(e,"IdsPaquetes"),n=parseInt(a,10),c=Object.values(u).includes(n)?n:u.Error;return{estado:c,estadoDescripcion:I[c]??"Desconocido",codEstatus:r,mensaje:s,idsPaquetes:i,numeroCfdis:parseInt(o,10)||0}}function E(e,t,r,s,a){return`<?xml version="1.0" encoding="utf-8"?>
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
</s:Envelope>`}function w(e,t){const r=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,"i"),s=e.match(r);return s?s[1].trim():""}function $(e){if(e.includes("<faultcode>")||e.includes(":Fault>")){const r=w(e,"faultstring");throw new Error(`SOAP Fault: ${r||"Error desconocido del servicio"}`)}const t=w(e,"Paquete")||w(e,"RespuestaDescargaMasivaTercerosSalida");if(!t)throw new Error("La respuesta del SAT no contiene el elemento Paquete con el ZIP");return Buffer.from(t.replace(/\s+/g,""),"base64")}function h(e){return e.replace(/<\?xml[^?]*\?>\s*/g,"").trim()}function v(e){return X.createHash("sha256").update(e,"utf8").digest("base64")}function K(e,t,r="_0"){const s=h(e),a=v(s),o=V(a,r),i=h(o),n=t.sign(i),d=t.certificate.toPem().replace(/-----BEGIN CERTIFICATE-----/g,"").replace(/-----END CERTIFICATE-----/g,"").replace(/\s+/g,"");return{bodyDigest:a,signatureValue:n,x509Certificate:d,bodyId:r}}function V(e,t){return`<ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#${t}"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>${e}</ds:DigestValue></ds:Reference></ds:SignedInfo>`}function B(e,t){const{bodyDigest:r,signatureValue:s,x509Certificate:a,bodyId:o}=e,i=V(r,o);return`<s:Header>
  <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
              xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <u:Timestamp>
      <u:Created>${t}</u:Created>
    </u:Timestamp>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      ${i}
      <ds:SignatureValue>${s}</ds:SignatureValue>
      <ds:KeyInfo>
        <o:SecurityTokenReference xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
          <o:KeyIdentifier ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3SubjectKeyIdentifier"
                           EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
            ${a.substring(0,40)}
          </o:KeyIdentifier>
        </o:SecurityTokenReference>
      </ds:KeyInfo>
    </ds:Signature>
  </h:Security>
</s:Header>`}const U="https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc",q="https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc",H="https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc",Z="http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga",k="http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga",N="http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar",f=6e4;class L{constructor(t,r){this._token=t,this._credential=r}_token;_credential;async solicitar(t){const{cert:r,signatureValue:s}=this._signComponents(`SolicitudDescarga-${t.rfcSolicitante}`),a=R(t,this._token.value,r,s),o=await this._post(U,Z,a);return A(o)}async verificar(t){const r=this._credential.rfc(),{cert:s,signatureValue:a}=this._signComponents(`VerificaSolicitud-${t}`),o=C(t,r,this._token.value,s,a),i=await this._post(q,k,o);return y(i)}async descargar(t){const r=this._credential.rfc(),{cert:s,signatureValue:a}=this._signComponents(`Descarga-${t}`),o=E(t,r,this._token.value,s,a),i=await this._post(H,N,o);return $(i)}_signComponents(t){const r=this._credential.sign(t);return{cert:this._credential.certificate.toPem().replace(/-----BEGIN CERTIFICATE-----/g,"").replace(/-----END CERTIFICATE-----/g,"").replace(/\s+/g,""),signatureValue:r}}async _post(t,r,s){const a=new AbortController,o=setTimeout(()=>a.abort(),f);let i;try{i=await fetch(t,{method:"POST",headers:{"Content-Type":"text/xml; charset=utf-8",SOAPAction:`"${r}"`},body:s,signal:a.signal})}catch(n){throw n instanceof Error&&n.name==="AbortError"?new Error(`Timeout: el webservice del SAT no respondio en ${f/1e3} segundos`):new Error(`Error de red al conectar con el SAT: ${n instanceof Error?n.message:String(n)}`)}finally{clearTimeout(o)}if(!i.ok)throw new Error(`El webservice del SAT retorno HTTP ${i.status}: ${i.statusText}`);return i.text()}}exports.DescargaMasiva=L;exports.ESTADO_DESCRIPCION=I;exports.EstadoComprobante=T;exports.EstadoSolicitud=u;exports.NS_DM_SOLICITUD=O;exports.TipoDescarga=D;exports.TipoSolicitud=S;exports.buildDescargarRequest=E;exports.buildSecurityHeader=B;exports.buildSolicitarRequest=R;exports.buildVerificarRequest=C;exports.canonicalize=h;exports.digestSha256=v;exports.parseDescargarResponse=$;exports.parseSolicitarResponse=A;exports.parseVerificarResponse=y;exports.signSoapBody=K;
