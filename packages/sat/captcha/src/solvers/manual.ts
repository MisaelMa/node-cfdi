import type { CaptchaChallenge, CaptchaResult, CaptchaSolver } from '../types';

/**
 * Resolutor manual de captchas.
 * Requiere un callback que presente la imagen al usuario y obtenga la respuesta.
 *
 * @example
 * ```typescript
 * const solver = new ManualCaptchaSolver(async (challenge) => {
 *   // Mostrar challenge.imageBase64 al usuario
 *   return prompt('Ingrese el captcha:') ?? '';
 * });
 * ```
 */
export class ManualCaptchaSolver implements CaptchaSolver {
  constructor(
    private readonly _promptFn: (
      challenge: CaptchaChallenge
    ) => Promise<string>
  ) {}

  async solve(challenge: CaptchaChallenge): Promise<CaptchaResult> {
    const text = await this._promptFn(challenge);
    if (!text) {
      throw new Error('No se proporciono respuesta al captcha');
    }
    return { text };
  }
}
