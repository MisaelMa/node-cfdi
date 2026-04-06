var n = /* @__PURE__ */ ((s) => (s.TwoCaptcha = "2captcha", s.AntiCaptcha = "anti-captcha", s.Manual = "manual", s))(n || {});
const c = "https://2captcha.com/in.php", o = "https://2captcha.com/res.php", p = 5e3;
class u {
  constructor(t, e = 12e4) {
    this._apiKey = t, this._timeout = e;
  }
  _apiKey;
  _timeout;
  async solve(t) {
    const e = await this._submitTask(t);
    return this._waitForResult(e);
  }
  async report(t, e) {
    const r = e ? "reportgood" : "reportbad";
    await fetch(
      `${o}?key=${this._apiKey}&action=${r}&id=${t}`
    );
  }
  async _submitTask(t) {
    const e = {
      key: this._apiKey,
      json: "1"
    };
    if (t.siteKey && t.pageUrl)
      e.method = "userrecaptcha", e.googlekey = t.siteKey, e.pageurl = t.pageUrl;
    else if (t.imageBase64)
      e.method = "base64", e.body = t.imageBase64;
    else if (t.imageUrl) {
      e.method = "base64";
      const i = await (await fetch(t.imageUrl)).arrayBuffer();
      e.body = Buffer.from(i).toString("base64");
    } else
      throw new Error(
        "Se requiere imageBase64, imageUrl, o siteKey+pageUrl para resolver el captcha"
      );
    const a = await (await fetch(c, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(e).toString()
    })).json();
    if (a.status !== 1)
      throw new Error(`Error al enviar captcha a 2captcha: ${a.request}`);
    return a.request;
  }
  async _waitForResult(t) {
    const e = Date.now();
    for (; Date.now() - e < this._timeout; ) {
      await this._sleep(p);
      const a = await (await fetch(
        `${o}?key=${this._apiKey}&action=get&id=${t}&json=1`
      )).json();
      if (a.status === 1)
        return { text: a.request, taskId: t };
      if (a.request !== "CAPCHA_NOT_READY")
        throw new Error(`Error de 2captcha: ${a.request}`);
    }
    throw new Error(
      `Timeout: 2captcha no resolvio el captcha en ${this._timeout / 1e3} segundos`
    );
  }
  _sleep(t) {
    return new Promise((e) => setTimeout(e, t));
  }
}
class m {
  constructor(t) {
    this._promptFn = t;
  }
  _promptFn;
  async solve(t) {
    const e = await this._promptFn(t);
    if (!e)
      throw new Error("No se proporciono respuesta al captcha");
    return { text: e };
  }
}
export {
  n as CaptchaProvider,
  m as ManualCaptchaSolver,
  u as TwoCaptchaSolver
};
