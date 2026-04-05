/**
 * Tipos para resolucion de captchas del portal SAT.
 */

export enum CaptchaProvider {
  /** Servicio externo 2captcha */
  TwoCaptcha = '2captcha',
  /** Servicio externo anti-captcha */
  AntiCaptcha = 'anti-captcha',
  /** Resolucion manual */
  Manual = 'manual',
}

export interface CaptchaConfig {
  provider: CaptchaProvider;
  /** API key del servicio de captcha */
  apiKey?: string;
  /** Timeout para esperar la resolucion (ms) */
  timeout?: number;
}

export interface CaptchaChallenge {
  /** URL de la imagen del captcha */
  imageUrl?: string;
  /** Imagen en base64 */
  imageBase64?: string;
  /** SiteKey para reCAPTCHA (si aplica) */
  siteKey?: string;
  /** URL de la pagina donde aparece el captcha */
  pageUrl?: string;
}

export interface CaptchaResult {
  /** Texto o token resuelto del captcha */
  text: string;
  /** ID de la tarea (para reportar errores al provider) */
  taskId?: string;
}

/**
 * Interfaz que debe implementar cualquier resolutor de captchas.
 */
export interface CaptchaSolver {
  solve(challenge: CaptchaChallenge): Promise<CaptchaResult>;
  report?(taskId: string, correct: boolean): Promise<void>;
}
