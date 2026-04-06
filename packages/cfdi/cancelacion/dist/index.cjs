"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});var w=(e=>(e.ConRelacion="01",e.SinRelacion="02",e.NoOperacion="03",e.FacturaGlobal="04",e))(w||{}),m=(e=>(e.EnProceso="EnProceso",e.Cancelado="Cancelado",e.CancelacionRechazada="Rechazada",e.Plazo="Plazo",e))(m||{}),f=(e=>(e.Aceptacion="Aceptacion",e.Rechazo="Rechazo",e))(f||{});function C(e,t,o,s,n,a){const c=e.motivo==="01"&&e.folioSustitucion?` FolioSustitucion="${e.folioSustitucion}"`:"";return`<?xml version="1.0" encoding="utf-8"?>
<Cancelacion xmlns="http://cancelacfd.sat.gob.mx"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             RfcEmisor="${t}"
             Fecha="${o}">
  <Folios>
    <Folio UUID="${e.uuid}"
           Motivo="${e.motivo}"${c}/>
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
</Cancelacion>`}function R(e,t,o,s){return`<?xml version="1.0" encoding="utf-8"?>
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
      <Cancelacion>${$(e)}</Cancelacion>
    </CancelaCFD>
  </s:Body>
</s:Envelope>`}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function l(e,t){const o=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,"i"),s=e.match(o);return s?s[1].trim():""}function u(e,t){const o=new RegExp(`${t}="([^"]*)"`,"i"),s=e.match(o);return s?s[1]:""}function S(e){if(e.includes("<faultcode>")||e.includes(":Fault>")){const p=l(e,"faultstring");throw new Error(`SOAP Fault: ${p||"Error desconocido del servicio de cancelacion"}`)}const t=l(e,"Folio")||l(e,"CancelaCFDResult"),o=u(t||e,"UUID")||u(e,"UUID"),s=u(t||e,"EstatusUUID")||u(e,"EstatusUUID"),n=u(e,"CodEstatus")||l(e,"CodEstatus"),a=u(e,"Mensaje")||l(e,"Mensaje"),r={201:"Cancelado",202:"EnProceso",Cancelado:"Cancelado",EnProceso:"EnProceso"}[s]??"EnProceso";return{uuid:o,estatus:r,codEstatus:n,mensaje:a}}function E(e,t,o,s,n){return`<?xml version="1.0" encoding="utf-8"?>
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
</s:Envelope>`}function y(e,t,o,s){return`<?xml version="1.0" encoding="utf-8"?>
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
</s:Envelope>`}function i(e,t){const o=new RegExp(`<(?:[a-zA-Z0-9_]+:)?${t}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${t}>`,"i"),s=e.match(o);return s?s[1].trim():""}function d(e,t){const o=new RegExp(`${t}="([^"]*)"`,"i"),s=e.match(o);return s?s[1]:""}function A(e){if(e.includes("<faultcode>")||e.includes(":Fault>")){const n=i(e,"faultstring");throw new Error(`SOAP Fault: ${n||"Error desconocido del servicio"}`)}const t=d(e,"UUID")||i(e,"UUID"),o=d(e,"CodEstatus")||i(e,"CodEstatus"),s=d(e,"Mensaje")||i(e,"Mensaje");return{uuid:t,codEstatus:o,mensaje:s}}function x(e){if(e.includes("<faultcode>")||e.includes(":Fault>")){const n=i(e,"faultstring");throw new Error(`SOAP Fault: ${n||"Error desconocido del servicio"}`)}const t=[],o=/<(?:[a-zA-Z0-9_]+:)?UUID[^>]*>([^<]+)<\/(?:[a-zA-Z0-9_]+:)?UUID>/gi;let s;for(;(s=o.exec(e))!==null;){const n=e.substring(Math.max(0,s.index-500),s.index+s[0].length+500);t.push({uuid:s[1].trim(),rfcEmisor:i(n,"RfcEmisor")||d(n,"RfcEmisor"),fechaSolicitud:i(n,"FechaSolicitud")||d(n,"FechaSolicitud")})}return t}const I="https://cancelacfd.sat.gob.mx/CancelaCFDService.svc",g="https://cancelacfd.sat.gob.mx/AceptacionRechazo/AceptacionRechazoService.svc",v="http://cancelacfd.sat.gob.mx/ICancelaCFDService/CancelaCFD",_="http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ProcesarRespuesta",P="http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ConsultaPendientes",h=6e4;class b{constructor(t,o){this._token=t,this._credential=o}_token;_credential;async cancelar(t){const o=t.rfcEmisor||this._credential.rfc(),s=new Date().toISOString().replace(/\.\d{3}Z$/,""),{cert:n,signatureValue:a,serialNumber:c}=this._signComponents(`CancelaCFD-${t.uuid}`),r=C(t,o,s,n,a,c),p=R(r,this._token.value,n),T=await this._post(I,v,p);return S(T)}async aceptarRechazar(t){const o=new Date().toISOString().replace(/\.\d{3}Z$/,""),{cert:s,signatureValue:n}=this._signComponents(`AceptacionRechazo-${t.uuid}`),a=E(t,this._token.value,s,n,o),c=await this._post(g,_,a);return A(c)}async consultarPendientes(){const t=this._credential.rfc(),{cert:o,signatureValue:s}=this._signComponents(`ConsultaPendientes-${t}`),n=y(t,this._token.value,o),a=await this._post(g,P,n);return x(a)}_signComponents(t){const o=this._credential.sign(t),n=this._credential.certificate.toPem().replace(/-----BEGIN CERTIFICATE-----/g,"").replace(/-----END CERTIFICATE-----/g,"").replace(/\s+/g,""),a=this._credential.certificate.serialNumber();return{cert:n,signatureValue:o,serialNumber:a}}async _post(t,o,s){const n=new AbortController,a=setTimeout(()=>n.abort(),h);let c;try{c=await fetch(t,{method:"POST",headers:{"Content-Type":"text/xml; charset=utf-8",SOAPAction:`"${o}"`},body:s,signal:n.signal})}catch(r){throw r instanceof Error&&r.name==="AbortError"?new Error(`Timeout: el webservice de cancelacion no respondio en ${h/1e3} segundos`):new Error(`Error de red al conectar con el servicio de cancelacion: ${r instanceof Error?r.message:String(r)}`)}finally{clearTimeout(a)}if(!c.ok)throw new Error(`El webservice de cancelacion retorno HTTP ${c.status}: ${c.statusText}`);return c.text()}}exports.CancelacionCfdi=b;exports.EstatusCancelacion=m;exports.MotivoCancelacion=w;exports.RespuestaAceptacionRechazo=f;exports.buildAceptacionRechazoRequest=E;exports.buildCancelacionXml=C;exports.buildCancelarRequest=R;exports.buildConsultaPendientesRequest=y;exports.parseAceptacionRechazoResponse=A;exports.parseCancelarResponse=S;exports.parsePendientesResponse=x;
