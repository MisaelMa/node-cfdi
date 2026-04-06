export declare interface CaptchaChallenge {
    imageUrl?: string;
    imageBase64?: string;
    siteKey?: string;
    pageUrl?: string;
}

export declare interface CaptchaConfig {
    provider: CaptchaProvider;
    apiKey?: string;
    timeout?: number;
}

export declare enum CaptchaProvider {
    TwoCaptcha = "2captcha",
    AntiCaptcha = "anti-captcha",
    Manual = "manual"
}

export declare interface CaptchaResult {
    text: string;
    taskId?: string;
}

export declare interface CaptchaSolver {
    solve(challenge: CaptchaChallenge): Promise<CaptchaResult>;
    report?(taskId: string, correct: boolean): Promise<void>;
}

export declare class ManualCaptchaSolver implements CaptchaSolver {
    private readonly _promptFn;
    constructor(_promptFn: (challenge: CaptchaChallenge) => Promise<string>);
    solve(challenge: CaptchaChallenge): Promise<CaptchaResult>;
}

export declare class TwoCaptchaSolver implements CaptchaSolver {
    private readonly _apiKey;
    private readonly _timeout;
    constructor(_apiKey: string, _timeout?: number);
    solve(challenge: CaptchaChallenge): Promise<CaptchaResult>;
    report(taskId: string, correct: boolean): Promise<void>;
    private _submitTask;
    private _waitForResult;
    private _sleep;
}

export { }
