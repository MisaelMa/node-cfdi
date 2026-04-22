import { Concepto } from "./concepto";
import { XmlConceptoAttributes } from "@cfdi/types";

export class  CFDIFactory {
    data!: XmlConceptoAttributes;
    constructor(data: XmlConceptoAttributes){
        this.data = data
    }

    build(): Concepto {
        const concepto = new Concepto(this.data)
        return concepto
    }

}