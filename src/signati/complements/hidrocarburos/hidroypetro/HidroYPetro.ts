import {
    XmlHidroYPetro,
    XmlHidroYPetroAttributes,
} from '../../../types/Complements/hidrocarburos/hidroypetro/hidroypetro.com';
import { ComplementsReturn } from '../../../types';

export class HidroYPetro {
    private hidroYPetro: XmlHidroYPetro = {} as XmlHidroYPetro;
    private xmlns: string = 'http://www.sat.gob.mx/hidrocarburospetroliferos';
    private xmlnskey: string = 'hidrocarburospetroliferos';
    private schemaLocation: string[] = [
        'http://www.sat.gob.mx/hidrocarburospetroliferos',
        'http://www.sat.gob.mx/sitio_internet/cfd/hidrocarburospetroliferos/hidrocarburospetroliferos.xsd'
    ];

    constructor(attributes: XmlHidroYPetroAttributes) {
        this.hidroYPetro._attributes = attributes;
    }

    public getComplement(): ComplementsReturn {
        return {
            key: 'hidrocarburospetroliferos:HidroYPetro',
            xmlns: this.xmlns,
            xmlnskey: this.xmlnskey,
            schemaLocation: this.schemaLocation,
            complement: this.hidroYPetro,
        };
    }
}
