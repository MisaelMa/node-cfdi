# @sat/captcha

This package defines a small **captcha solver** abstraction for SAT portal flows, with a **2captcha.com** implementation (image base64/URL or reCAPTCHA via `siteKey` + `pageUrl`) and a **manual** solver that delegates to your own async prompt function.

## Installation

```bash
npm install @sat/captcha
```

## Usage

**2captcha**

```typescript
import { TwoCaptchaSolver } from '@sat/captcha';

const solver = new TwoCaptchaSolver('your-2captcha-api-key', 120_000);

const result = await solver.solve({
  imageBase64: '...', // or imageUrl, or siteKey + pageUrl
});

console.log(result.text, result.taskId);

await solver.report(result.taskId!, true); // optional feedback
```

**Manual**

```typescript
import { ManualCaptchaSolver } from '@sat/captcha';

const solver = new ManualCaptchaSolver(async (challenge) => {
  // show challenge.imageBase64 / imageUrl to the user
  return 'typed-by-user';
});

const { text } = await solver.solve({ imageBase64: '...' });
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `TwoCaptchaSolver` | class | Submits tasks to 2captcha; `solve`, `report`. |
| `ManualCaptchaSolver` | class | Calls your `promptFn(challenge)` and returns `{ text }`. |
| `CaptchaProvider` | enum | `TwoCaptcha`, `AntiCaptcha`, `Manual` (provider ids). |
| `CaptchaConfig` | interface | `provider`, optional `apiKey`, `timeout`. |
| `CaptchaChallenge` | interface | `imageUrl`, `imageBase64`, `siteKey`, `pageUrl`. |
| `CaptchaResult` | interface | `text`, optional `taskId`. |
| `CaptchaSolver` | interface | `solve(challenge)`; optional `report(taskId, correct)`. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
