import * as Captcha from '2captcha';

const solver: Captcha.Solver = new Captcha.Solver('');

export const captchaSolver = async (googlekey: string, pageurl: string): Promise<string> => {
  return (await solver.recaptcha(googlekey, pageurl)).data;
}
