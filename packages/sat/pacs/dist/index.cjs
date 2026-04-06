"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});var h=(s=>(s.Finkok="Finkok",s.SW="SW",s.ComercioDigital="ComercioDigital",s.Prodigia="Prodigia",s.Diverza="Diverza",s))(h||{});const k="http://schemas.xmlsoap.org/soap/envelope/",f="http://facturacion.finkok.com/stamp",S="http://facturacion.finkok.com/cancel",b="https://facturacion.finkok.com/servicios/soap/stamp.wsdl",$="https://demo-facturacion.finkok.com/servicios/soap/stamp.wsdl";function p(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function g(s){return s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&")}function r(s,t){const n=new RegExp(`<(?:[\\w.-]+:)?${t}[^>]*>([\\s\\S]*?)</(?:[\\w.-]+:)?${t}>`,"i"),o=s.match(n);if(o)return g(o[1].trim())}function l(s,t){const n=new RegExp(`${t}="([^"]*)"`,"i");return s.match(n)?.[1]}function x(s){const t=s.match(/<(?:[^:>]+:)?TimbreFiscalDigital\b[^>]*\/?>/)?.[0]??s.match(/<TimbreFiscalDigital\b[^>]*\/?>/)?.[0];if(!t)throw new Error("El XML timbrado no contiene TimbreFiscalDigital.");const n=l(t,"UUID"),o=l(t,"FechaTimbrado"),e=l(t,"SelloCFD")??"",i=l(t,"SelloSAT")??"",c=l(t,"NoCertificadoSAT")??"",a=l(t,"CadenaOriginal")??"";if(!n||!o)throw new Error("No se pudieron leer UUID o FechaTimbrado del timbre.");return{uuid:n,fechaTimbrado:o,selloCFD:e,selloSAT:i,noCertificadoSAT:c,cadenaOriginalSAT:a}}function u(s){return`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="${k}">
  <soapenv:Header/>
  <soapenv:Body>
    ${s}
  </soapenv:Body>
</soapenv:Envelope>`}class U{constructor(t){this.config=t}config;finkokOrigin(){const t=this.config.baseUrl?.trim();if(!t)return this.config.sandbox?"https://demo-facturacion.finkok.com":"https://facturacion.finkok.com";const n=/^https?:\/\//i.test(t)?t:`https://${t}`;try{return new URL(n).origin}catch{return this.config.sandbox?"https://demo-facturacion.finkok.com":"https://facturacion.finkok.com"}}stampUrl(){const t=this.config.baseUrl?.trim();return t&&/\.wsdl$/i.test(t)&&/stamp/i.test(t)?/^https?:\/\//i.test(t)?t:`https://${t}`:this.config.sandbox?$:b}cancelUrl(){const t=this.config.baseUrl?.trim();return t&&/\.wsdl$/i.test(t)&&/cancel/i.test(t)?/^https?:\/\//i.test(t)?t:`https://${t}`:`${this.finkokOrigin()}/servicios/soap/cancel.wsdl`}authStamp(){return`
      <stamp:username>${p(this.config.user)}</stamp:username>
      <stamp:password>${p(this.config.password)}</stamp:password>`}authCancel(){return`
      <cancel:username>${p(this.config.user)}</cancel:username>
      <cancel:password>${p(this.config.password)}</cancel:password>`}async postSoap(t,n){const o=await fetch(t,{method:"POST",headers:{"Content-Type":"text/xml; charset=utf-8"},body:n}),e=await o.text();if(!o.ok)throw new Error(`Finkok HTTP ${o.status}: ${e.slice(0,500)}`);return e}async timbrar(t){const n=Buffer.from(t.xmlCfdi,"utf8").toString("base64"),o=`
    <stamp:stamp xmlns:stamp="${f}">
      <stamp:xml>${n}</stamp:xml>
      ${this.authStamp()}
    </stamp:stamp>`,e=await this.postSoap(this.stampUrl(),u(o)),i=r(e,"CodEstatus"),c=r(e,"MensajeIncidencia")??r(e,"error");if(c||i&&!/timbrado satisfactoriamente/i.test(i))throw new Error(c??i??"Error desconocido en timbrado Finkok.");const a=r(e,"xml");if(!a)throw new Error("Respuesta de timbrado sin nodo xml.");const m=Buffer.from(a,"base64").toString("utf8");return{...x(m),xmlTimbrado:m}}async cancelar(t,n,o,e){const i=e!==void 0&&e!==""?` FolioSustitucion="${p(e)}"`:"",c=`
    <cancel:cancel xmlns:cancel="${S}">
      <cancel:UUIDS>
        <cancel:UUID UUID="${p(t)}" Motivo="${p(o)}"${i}/>
      </cancel:UUIDS>
      ${this.authCancel()}
      <cancel:taxpayer_id>${p(n)}</cancel:taxpayer_id>
    </cancel:cancel>`,a=await this.postSoap(this.cancelUrl(),u(c)),m=r(a,"error");if(m)throw new Error(m);const d=r(a,"Acuse")??"",w=r(a,"EstatusUUID")??r(a,"EstatusCancelacion")??r(a,"CodEstatus")??"";return{uuid:t,estatus:w,acuse:d}}async consultarEstatus(t){const n=`
    <stamp:query_pending xmlns:stamp="${f}">
      ${this.authStamp()}
      <stamp:uuid>${p(t)}</stamp:uuid>
    </stamp:query_pending>`,o=await this.postSoap(this.stampUrl(),u(n)),e=r(o,"error");if(e)throw new Error(e);const i=r(o,"status")??"",c=r(o,"xml");return{uuid:r(o,"uuid")??t,estatus:i,xml:c?g(c):void 0}}}exports.FinkokProvider=U;exports.PacProviderType=h;
