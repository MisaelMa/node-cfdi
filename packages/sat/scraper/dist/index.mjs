var a = /* @__PURE__ */ ((i) => (i.FIEL = "fiel", i.CIEC = "ciec", i))(a || {});
const l = "https://portalcfdi.facturaelectronica.sat.gob.mx", h = 3e4, u = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
class d {
  _baseUrl;
  _timeout;
  _userAgent;
  constructor(t = {}) {
    this._baseUrl = t.baseUrl ?? l, this._timeout = t.timeout ?? h, this._userAgent = t.userAgent ?? u;
  }
  /**
   * Inicia sesion en el portal del SAT.
   * Obtiene las cookies de sesion necesarias para llamadas posteriores.
   */
  async login(t) {
    return t.tipo === a.CIEC ? this._loginCIEC(t.rfc, t.password) : this._loginFIEL(t);
  }
  /**
   * Consulta CFDIs en el portal del SAT usando la sesion activa.
   */
  async consultarCfdis(t, e) {
    this._validateSesion(t);
    const r = `${this._baseUrl}/ConsultaEmisor.aspx`, s = new URLSearchParams({
      ctl00$MainContent$TxtFechaInicial: e.fechaInicio,
      ctl00$MainContent$TxtFechaFinal: e.fechaFin,
      ...e.rfcReceptor && {
        ctl00$MainContent$TxtRfcReceptor: e.rfcReceptor
      }
    }), o = await this._postForm(r, s, t);
    return this._parseConsultaResults(o);
  }
  /**
   * Cierra la sesion del portal SAT.
   */
  async logout(t) {
    const e = `${this._baseUrl}/logout.aspx`;
    await this._get(e, t), t.authenticated = !1;
  }
  async _loginCIEC(t, e) {
    const r = `${this._baseUrl}/nidp/wsfed/ep?id=SATUPCFDiCon&sid=0&option=credential&sid=0`, s = new URLSearchParams({
      Ecom_User_ID: t,
      Ecom_Password: e,
      option: "credential",
      submit: "Enviar"
    }), o = await this._fetchWithTimeout(r, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this._userAgent
      },
      body: s.toString(),
      redirect: "manual"
    });
    return {
      cookies: this._extractCookies(o),
      rfc: t,
      authenticated: o.status === 302 || o.status === 200,
      expiresAt: new Date(Date.now() + 1800 * 1e3)
    };
  }
  async _loginFIEL(t) {
    const e = `${this._baseUrl}/nidp/wsfed/ep?id=SATx509Custom&sid=0&option=credential`, r = await this._fetchWithTimeout(e, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this._userAgent
      },
      body: new URLSearchParams({
        credentialToken: t.certificatePem,
        credentialSecret: t.privateKeyPem,
        option: "credential"
      }).toString(),
      redirect: "manual"
    });
    return {
      cookies: this._extractCookies(r),
      rfc: "",
      authenticated: r.status === 302 || r.status === 200,
      expiresAt: new Date(Date.now() + 1800 * 1e3)
    };
  }
  _validateSesion(t) {
    if (!t.authenticated)
      throw new Error("La sesion del SAT no esta activa");
    if (t.expiresAt && t.expiresAt < /* @__PURE__ */ new Date())
      throw new Error("La sesion del SAT ha expirado");
  }
  async _get(t, e) {
    return (await this._fetchWithTimeout(t, {
      headers: {
        Cookie: this._buildCookieHeader(e.cookies),
        "User-Agent": this._userAgent
      }
    })).text();
  }
  async _postForm(t, e, r) {
    return (await this._fetchWithTimeout(t, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: this._buildCookieHeader(r.cookies),
        "User-Agent": this._userAgent
      },
      body: e.toString()
    })).text();
  }
  _buildCookieHeader(t) {
    return Object.entries(t).map(([e, r]) => `${e}=${r}`).join("; ");
  }
  _extractCookies(t) {
    const e = {}, r = t.headers.getSetCookie?.() ?? [];
    for (const s of r) {
      const [o] = s.split(";"), [n, ...c] = o.split("=");
      n && (e[n.trim()] = c.join("=").trim());
    }
    return e;
  }
  _parseConsultaResults(t) {
    const e = [], r = /<tr[^>]*class="[^"]*rgRow[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
    let s;
    for (; (s = r.exec(t)) !== null; ) {
      const o = this._extractCells(s[1]);
      o.length >= 9 && e.push({
        uuid: o[0],
        rfcEmisor: o[1],
        nombreEmisor: o[2],
        rfcReceptor: o[3],
        nombreReceptor: o[4],
        fechaEmision: o[5],
        fechaCertificacion: o[6],
        total: parseFloat(o[7]) || 0,
        efecto: o[8],
        estado: o[9] ?? "Vigente"
      });
    }
    return e;
  }
  _extractCells(t) {
    const e = [], r = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let s;
    for (; (s = r.exec(t)) !== null; )
      e.push(s[1].replace(/<[^>]+>/g, "").trim());
    return e;
  }
  async _fetchWithTimeout(t, e = {}) {
    const r = new AbortController(), s = setTimeout(() => r.abort(), this._timeout);
    try {
      return await fetch(t, {
        ...e,
        signal: r.signal
      });
    } catch (o) {
      throw o instanceof Error && o.name === "AbortError" ? new Error(
        `Timeout: el portal del SAT no respondio en ${this._timeout / 1e3} segundos`
      ) : new Error(
        `Error de red al conectar con el portal del SAT: ${o instanceof Error ? o.message : String(o)}`
      );
    } finally {
      clearTimeout(s);
    }
  }
}
export {
  d as SatPortal,
  a as TipoAutenticacion
};
