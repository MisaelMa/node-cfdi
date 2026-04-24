import { Concepto } from "./concepto";
import { ObjetoImp, ObjetoImpEnum, XmlConceptoAttributes } from "@cfdi/types";

export class  ConceptFactory {
    data!: XmlConceptoAttributes;
    constructor(data: XmlConceptoAttributes){
        this.data = data
    }

    build(): Concepto {
        const concepto = new Concepto(this.data)
        return concepto
    }

}