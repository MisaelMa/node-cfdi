export enum TipoPermisoHYP {
    PER01 = 'PER01',
    PER02 = 'PER02',
    PER03 = 'PER03',
    PER04 = 'PER04',
    PER05 = 'PER05',
    PER06 = 'PER06',
    PER07 = 'PER07',
    PER08 = 'PER08',
    PER09 = 'PER09',
    PER10 = 'PER10',
    PER11 = 'PER11',
}

export enum SubProductoHYP {
    SP16 = 'SP16', SP17 = 'SP17', SP18 = 'SP18', SP19 = 'SP19', SP20 = 'SP20',
    SP21 = 'SP21', SP22 = 'SP22', SP23 = 'SP23', SP24 = 'SP24', SP25 = 'SP25',
    SP26 = 'SP26', SP27 = 'SP27', SP28 = 'SP28', SP29 = 'SP29', SP30 = 'SP30',
    SP31 = 'SP31', SP32 = 'SP32', SP33 = 'SP33', SP34 = 'SP34', SP35 = 'SP35',
    SP36 = 'SP36', SP37 = 'SP37', SP38 = 'SP38', SP39 = 'SP39', SP40 = 'SP40',
    SP41 = 'SP41', SP42 = 'SP42', SP43 = 'SP43', SP44 = 'SP44', SP45 = 'SP45',
    SP46 = 'SP46', SP47 = 'SP47', SP48 = 'SP48',
}

export interface XmlHidroYPetro {
    _attributes?: XmlHidroYPetroAttributes;
}

export interface XmlHidroYPetroAttributes {
    Version: string;
    TipoPermiso: TipoPermisoHYP | string;
    NumeroPermiso: string;
    ClaveHYP: string;
    SubProductoHYP: SubProductoHYP | string;
}
