import type { CaptchaChallenge, CaptchaResult, CaptchaSolver } from '../types';

const API_URL = 'https://2captcha.com/in.php';
const RESULT_URL = 'https://2captcha.com/res.php';
const POLL_INTERVAL_MS = 5_000;

/**
 * Resolutor de captchas usando el servicio 2captcha.com.
 *
 * @example
 * ```typescript
 * const solver = new TwoCaptchaSolver('your-api-key');
 * const result = await solver.solve({ imageBase64: '...' });
 * console.log(result.text);
 * ```
 */
export class TwoCaptchaSolver implements CaptchaSolver {
  constructor(
    private readonly _apiKey: string,
    private readonly _timeout = 120_000
  ) {}

  async solve(challenge: CaptchaChallenge): Promise<CaptchaResult> {
    const taskId = await this._submitTask(challenge);
    return this._waitForResult(taskId);
  }

  async report(taskId: string, correct: boolean): Promise<void> {
    const action = correct ? 'reportgood' : 'reportbad';
    await fetch(
      `${RESULT_URL}?key=${this._apiKey}&action=${action}&id=${taskId}`
    );
  }

  private async _submitTask(challenge: CaptchaChallenge): Promise<string> {
    const params: Record<string, string> = {
      key: this._apiKey,
      json: '1',
    };

    if (challenge.siteKey && challenge.pageUrl) {
      params.method = 'userrecaptcha';
      params.googlekey = challenge.siteKey;
      params.pageurl = challenge.pageUrl;
    } else if (challenge.imageBase64) {
      params.method = 'base64';
      params.body = challenge.imageBase64;
    } else if (challenge.imageUrl) {
      params.method = 'base64';
      const imgResponse = await fetch(challenge.imageUrl);
      const buffer = await imgResponse.arrayBuffer();
      params.body = Buffer.from(buffer).toString('base64');
    } else {
      throw new Error(
        'Se requiere imageBase64, imageUrl, o siteKey+pageUrl para resolver el captcha'
      );
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params).toString(),
    });

    const data = (await response.json()) as { status: number; request: string };

    if (data.status !== 1) {
      throw new Error(`Error al enviar captcha a 2captcha: ${data.request}`);
    }

    return data.request;
  }

  private async _waitForResult(taskId: string): Promise<CaptchaResult> {
    const startTime = Date.now();

    while (Date.now() - startTime < this._timeout) {
      await this._sleep(POLL_INTERVAL_MS);

      const response = await fetch(
        `${RESULT_URL}?key=${this._apiKey}&action=get&id=${taskId}&json=1`
      );
      const data = (await response.json()) as {
        status: number;
        request: string;
      };

      if (data.status === 1) {
        return { text: data.request, taskId };
      }

      if (data.request !== 'CAPCHA_NOT_READY') {
        throw new Error(`Error de 2captcha: ${data.request}`);
      }
    }

    throw new Error(
      `Timeout: 2captcha no resolvio el captcha en ${this._timeout / 1000} segundos`
    );
  }

  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
