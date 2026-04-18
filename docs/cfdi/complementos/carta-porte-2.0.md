# Complemento Carta Porte 2.0

# Carta Porte 2.0

Complemento para el traslado de bienes y mercancias en territorio nacional.

```typescript
import {
  CartaPorte20,
  CtaPrt20Mercancias,
  CtaPrt20Ubicacion,
  CtaPrt20FiguraTransporte,
} from '@cfdi/complementos';

const cartaPorte20 = new CartaPorte20();
cartaPorte20.setAttributes({
    Version: '2.0',
    TranspInternac: 'No',
    TotalDistRec: '2',
});

// Ubicaciones (Origen y Destinos)
const ubicacion1 = new CtaPrt20Ubicacion();
ubicacion1.setAttributes({
    IDUbicacion: 'OR101010',
    TipoUbicacion: 'Origen',
    RFCRemitenteDestinatario: 'EKU9003173C9',
    FechaHoraSalidaLlegada: '2021-11-01T00:00:00',
});
ubicacion1.setDomicilio({
    Calle: 'calle',
    NumeroExterior: '211',
    Colonia: '0347',
    Localidad: '23',
    Referencia: 'casa blanca 1',
    Municipio: '004',
    Estado: 'COA',
    Pais: 'MEX',
    CodigoPostal: '25350',
});
cartaPorte20.setUbicacion(ubicacion1);

const ubicacion2 = new CtaPrt20Ubicacion();
ubicacion2.setAttributes({
    IDUbicacion: 'DE202020',
    TipoUbicacion: 'Destino',
    RFCRemitenteDestinatario: 'AAA010101AAA',
    FechaHoraSalidaLlegada: '2021-11-01T01:00:00',
    DistanciaRecorrida: '1',
});
ubicacion2.setDomicilio({
    Calle: 'calle',
    NumeroExterior: '214',
    Colonia: '0347',
    Localidad: '23',
    Referencia: 'casa blanca 2',
    Municipio: '004',
    Estado: 'COA',
    Pais: 'MEX',
    CodigoPostal: '25350',
});
cartaPorte20.setUbicacion(ubicacion2);

// Mercancias
const mercancias = new CtaPrt20Mercancias();
mercancias.setAttributes({
    PesoBrutoTotal: '2.0',
    UnidadPeso: 'XBX',
    NumTotalMercancias: '2',
});

// Mercancia individual (retorna instancia Mercancia para agregar detalles)
const mercancia1 = mercancias.setMercancia({
    BienesTransp: '11121900',
    Descripcion: 'Productos de perfumeria',
    Cantidad: '1.0',
    ClaveUnidad: 'XBX',
    PesoEnKg: '1.0',
    MaterialPeligroso: 'Si',
    CveMaterialPeligroso: '1266',
    Embalaje: '4H2',
});

// Detalles de la mercancia
mercancia1.setPedimentos({ Pedimento: '1' });
mercancia1.setGuiaIdentificacion({
    DescripGuiaIdentificacion: '143',
    NumeroGuiaIdentificacion: '2213',
    PesoGuiaIdentificacion: 'NZ2332',
});
mercancia1.setCantidadTransporta({
    Cantidad: '100',
    IDDestino: '10',
    IDOrigen: '10',
});
mercancia1.setDetalleMercancia({
    NumPiezas: '1',
    PesoBruto: '1',
    PesoNeto: '1',
    PesoTara: '1',
    UnidadPesoMerc: 'A44',
});

// Autotransporte (retorna instancia Autotransporte)
const autotransporte = mercancias.setAutotransporte({
    NumPermisoSCT: '2',
    PermSCT: '2',
});
autotransporte.setIdentificacionVehicular({
    AnioModeloVM: '2020',
    ConfigVehicular: 'C2',
    PlacaVM: 'ABC123',
});
autotransporte.setSeguro({
    AseguraRespCivil: 'Seguro SA',
    PolizaRespCivil: 'POL-001',
});
autotransporte.setRemolque({
    Placa: '3333',
    SubTipoRem: 'CTR001',
});

// Transporte maritimo (retorna instancia TransporteMaritimo)
const tMaritimo = mercancias.setTransporteMaritimo({
    Matricula: 'MAT-001',
    NacionalidadEmbarc: 'MEX',
    NombreAgenteNaviero: 'Agente Naval',
    NumAutorizacionNaviero: '333',
    NumCertITC: 'ITC-001',
    NumeroOMI: '3',
    TipoCarga: 'CGE',
    TipoEmbarcacion: 'BUQ',
    UnidadesDeArqBruto: '100',
});
tMaritimo.setContenedor({
    MatriculaContenedor: 'CONT-001',
    TipoContenedor: 'MZN',
});

// Transporte aereo
mercancias.setTransporteAereo({
    CodigoTransportista: '222',
    NumeroGuia: '2222',
    NumPermisoSCT: '333',
    PermSCT: '555',
});

// Transporte ferroviario (retorna instancia TransporteFerroviario)
const ferroviario = mercancias.setTransporteFerroviario({
    TipoDeServicio: 'Carga',
});
ferroviario.setDerechosDePaso({
    KilometrajePagado: '200',
    TipoDerechoDePaso: '222',
});
ferroviario.setCarro({
    carro: {
        GuiaCarro: '3333',
        MatriculaCarro: '3303MX',
        TipoCarro: 'AUTOMOVIL',
        ToneladasNetasCarro: '10',
    },
    contenedores: [
        {
            PesoContenedorVacio: '2',
            PesoNetoMercancia: '300',
            TipoContenedor: '2',
        },
    ],
});

cartaPorte20.setMercancias(mercancias);

// Figura de transporte (operador/conductor)
const figuraT = new CtaPrt20FiguraTransporte();
figuraT.setAttributes({
    TipoFigura: '01',
    RFCFigura: 'XAXX010101000',
    NumLicencia: 'LIC001',
    NombreFigura: 'Juan Perez',
});
figuraT.setPartesTransporte({ ParteTransporte: 'PT01' });
figuraT.setDomicilio({
    Calle: 'calle',
    NumeroExterior: '211',
    Colonia: '0347',
    Estado: 'COA',
    Pais: 'MEX',
    CodigoPostal: '25350',
});
cartaPorte20.setFiguraTransporte(figuraT);

// Agregar al CFDI
cfdi.complemento(cartaPorte20);
```

```xml
<cfdi:Complemento>
  <cartaporte20:CartaPorte Version="2.0" TranspInternac="No" TotalDistRec="2">
    <cartaporte20:Ubicaciones>
      <cartaporte20:Ubicacion IDUbicacion="OR101010" TipoUbicacion="Origen" RFCRemitenteDestinatario="EKU9003173C9" FechaHoraSalidaLlegada="2021-11-01T00:00:00">
        <cartaporte20:Domicilio Calle="calle" NumeroExterior="211" Colonia="0347" Localidad="23" Referencia="casa blanca 1" Municipio="004" Estado="COA" Pais="MEX" CodigoPostal="25350"/>
      </cartaporte20:Ubicacion>
      <cartaporte20:Ubicacion IDUbicacion="DE202020" TipoUbicacion="Destino" RFCRemitenteDestinatario="AAA010101AAA" FechaHoraSalidaLlegada="2021-11-01T01:00:00" DistanciaRecorrida="1">
        <cartaporte20:Domicilio Calle="calle" NumeroExterior="214" Colonia="0347" Localidad="23" Referencia="casa blanca 2" Municipio="004" Estado="COA" Pais="MEX" CodigoPostal="25350"/>
      </cartaporte20:Ubicacion>
    </cartaporte20:Ubicaciones>
    <cartaporte20:Mercancias PesoBrutoTotal="2.0" UnidadPeso="XBX" NumTotalMercancias="2">
      <cartaporte20:Mercancia BienesTransp="11121900" Descripcion="Productos de perfumeria" Cantidad="1.0" ClaveUnidad="XBX" PesoEnKg="1.0" MaterialPeligroso="Si" CveMaterialPeligroso="1266" Embalaje="4H2">
        <cartaporte20:Pedimentos Pedimento="1"/>
        <cartaporte20:GuiasIdentificacion DescripGuiaIdentificacion="143" NumeroGuiaIdentificacion="2213" PesoGuiaIdentificacion="NZ2332"/>
        <cartaporte20:CantidadTransporta Cantidad="100" IDDestino="10" IDOrigen="10"/>
        <cartaporte20:DetalleMercancia NumPiezas="1" PesoBruto="1" PesoNeto="1" PesoTara="1" UnidadPesoMerc="A44"/>
      </cartaporte20:Mercancia>
      <cartaporte20:Autotransporte NumPermisoSCT="2" PermSCT="2">
        <cartaporte20:IdentificacionVehicular AnioModeloVM="2020" ConfigVehicular="C2" PlacaVM="ABC123"/>
        <cartaporte20:Seguros AseguraRespCivil="Seguro SA" PolizaRespCivil="POL-001"/>
        <cartaporte20:Remolques>
          <cartaporte20:Remolque Placa="3333" SubTipoRem="CTR001"/>
        </cartaporte20:Remolques>
      </cartaporte20:Autotransporte>
    </cartaporte20:Mercancias>
    <cartaporte20:FiguraTransporte>
      <cartaporte20:TiposFigura TipoFigura="01" RFCFigura="XAXX010101000" NumLicencia="LIC001" NombreFigura="Juan Perez">
        <cartaporte20:PartesTransporte ParteTransporte="PT01"/>
        <cartaporte20:Domicilio Calle="calle" NumeroExterior="211" Colonia="0347" Estado="COA" Pais="MEX" CodigoPostal="25350"/>
      </cartaporte20:TiposFigura>
    </cartaporte20:FiguraTransporte>
  </cartaporte20:CartaPorte>
</cfdi:Complemento>
```
