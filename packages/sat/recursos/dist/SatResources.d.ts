export type SatVersion = '4.0' | '3.3';
export interface SatResourcesOptions {
    version: SatVersion;
    outputDir: string;
}
export interface DownloadResult {
    schema: string;
    xslt: string;
    catalogSchema: string | null;
    tipoDatosSchema: string | null;
    complementos: string[];
    unused: string[];
    added: string[];
}
export declare class SatResources {
    private readonly version;
    private readonly outputDir;
    constructor(options: SatResourcesOptions);
    download(): Promise<DownloadResult>;
    private _fetchText;
    private _cleanXml;
    private _extractSchemaImports;
    private _extractXslIncludes;
    private _diffComplementos;
    private _rewriteIncludes;
}
//# sourceMappingURL=SatResources.d.ts.map