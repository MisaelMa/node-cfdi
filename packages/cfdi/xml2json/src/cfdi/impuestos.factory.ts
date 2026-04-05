import { ObjetoImp, ObjetoImpEnum, XmlConceptoAttributes, XmlImpuestosTrasladados } from "@cfdi/types";
import { Impuestos } from "./impuestos";

export class  TaxesFactory {
    data!: XmlImpuestosTrasladados;
    constructor(data: XmlImpuestosTrasladados){
        this.data = data
    }

    build() {
        const impuestos = new Impuestos(this.data)
        return impuestos
    }

}