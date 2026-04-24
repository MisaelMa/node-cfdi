import { describe, it, expect } from 'vitest';
import { ManualCaptchaSolver } from '../src/solvers/manual';
import { TwoCaptchaSolver } from '../src/solvers/two-captcha';
import { CaptchaProvider } from '../src/types';

describe('ManualCaptchaSolver', () => {
  it('resuelve el captcha con el callback proporcionado', async () => {
    const solver = new ManualCaptchaSolver(async () => 'ABC123');
    const result = await solver.solve({ imageBase64: 'fakebase64' });
    expect(result.text).toBe('ABC123');
  });

  it('lanza error si el callback retorna string vacio', async () => {
    const solver = new ManualCaptchaSolver(async () => '');
    await expect(
      solver.solve({ imageBase64: 'fakebase64' })
    ).rejects.toThrow('No se proporciono respuesta');
  });
});

describe('TwoCaptchaSolver', () => {
  it('puede instanciarse con API key', () => {
    const solver = new TwoCaptchaSolver('test-key');
    expect(solver).toBeInstanceOf(TwoCaptchaSolver);
  });

  it('lanza error si no se proporciona datos del captcha', async () => {
    const solver = new TwoCaptchaSolver('test-key');
    await expect(solver.solve({})).rejects.toThrow('Se requiere');
  });
});

describe('CaptchaProvider', () => {
  it('tiene los valores correctos', () => {
    expect(CaptchaProvider.TwoCaptcha).toBe('2captcha');
    expect(CaptchaProvider.AntiCaptcha).toBe('anti-captcha');
    expect(CaptchaProvider.Manual).toBe('manual');
  });
});
