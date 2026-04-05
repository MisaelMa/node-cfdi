import { default as default_2 } from 'crypto';

export declare function buildAuthToken(params: BuildAuthTokenParams): string;

export declare interface BuildAuthTokenParams {
    certificateBase64: string;
    created: string;
    expires: string;
    digest: string;
    signature: string;
    tokenId: string;
}

export declare function buildSignedInfoFragment(digest: string): string;

export declare function buildTimestampFragment(created: string, expires: string): string;

export declare function canonicalize(xmlFragment: string): string;

export declare interface CredentialLike {
    certificate: {
        toDer(): Buffer;
        toPem(): string;
    };
    sign(data: string): string;
}

export declare class SatAuth {
    private readonly _credential;
    constructor(_credential: CredentialLike);
    authenticate(): Promise<SatToken>;
    private _parseToken;
    private _toIsoString;
}

export declare interface SatToken {
    value: string;
    created: Date;
    expires: Date;
}

export declare function sha256Digest(data: string): string;

export declare function signRsaSha256(data: string, privateKey: default_2.KeyObject): string;

export { }
