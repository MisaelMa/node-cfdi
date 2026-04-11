export interface XmlDetallista {
  _attributes: XmlDetallistaAttributes;
  'detallista:orderIdentification'?: any;
  'detallista:buyer'?: any;
  'detallista:seller'?: any;
  'detallista:totalAmount'?: any;
  'detallista:TotalAllowanceCharge'?: any;
}

export interface XmlDetallistaAttributes {
  type?: string;
  contentVersion?: string;
  documentStructureVersion: string;
  documentStatus?: string;
}
