export declare class CfdiCleaner {
    clean(xml: string): string;
    cleanFile(filePath: string): string;
}

export declare function collapseWhitespace(xml: string): string;

export declare function removeAddenda(xml: string): string;

export declare function removeNonSatNamespaces(xml: string): string;

export declare function removeNonSatNodes(xml: string): string;

export declare function removeNonSatSchemaLocations(xml: string): string;

export declare function removeStylesheetAttributes(xml: string): string;

export declare const SAT_NAMESPACES: ReadonlySet<string>;

export { }
