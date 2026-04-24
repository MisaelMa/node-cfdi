import { ObjetoImp, ObjetoImpEnum, XmlConceptoAttributes, XmlImpuestosTrasladados } from "@cfdi/types";
import { Impuestos } from "./impuestos";
import { Catalogo } from "./catalogo";

export class Concepto {
    claveProdServ: string;
    noIdentificacion?: string;
    cantidad: number | string;
    claveUnidad: string;
    unidad?: string;
    descripcion: string;
    valorUnitario: number | string;
    importe: number | string;
    descuento?: number | string;
    objetoImp: Catalogo<ObjetoImpEnum | ObjetoImp>
    impuestos?: Impuestos;

    constructor(data: XmlConceptoAttributes){
      this.claveProdServ = data.ClaveProdServ
      this.noIdentificacion = data.NoIdentificacion
      this.cantidad = data.Cantidad
      this.claveUnidad = data.ClaveUnidad
      this.unidad = data.Unidad
      this.descripcion = data.Descripcion
      this.valorUnitario = data.ValorUnitario
      this.importe = data.Importe
      this.descuento = data.Descuento
      this.objetoImp = new Catalogo<ObjetoImpEnum | ObjetoImp>(data.ObjetoImp)
    }


    setImpuestos(impuestos: XmlImpuestosTrasladados) {
        this.impuestos = new Impuestos(impuestos)
    }

}