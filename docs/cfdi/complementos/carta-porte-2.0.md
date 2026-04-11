# complemento CARTA PORTE 2

# **Carta Porte 2.0**

  
Hemos liberado este complemento, de momento nos estamos enfocando en sacar más complementos pero requerimos la ayuda de la comunidad, considere realizar una [donacion](https://cfdi.recreando.dev/es/donaciones)

para que podamos seguir realizando librerías tan necesarias, de igual forma en nuestro github puede volverse sponsor saludos.   
  
La documentación full se realizará al finalizar la mayoría de complementos de momento dejaremos este ejemplo, recuerde que puede realizar issues si tiene algún problema o [contactarnos](https://cfdi.recreando.dev/es/contacto).  


```typescript
import {  
  CartaPorte20,  
  CtaPrt20Mercancias,  
  CtaPrt20Ubicacion,  
  CtaPrt20FiguraTransporte,  
} from '@cfdi/complementos/4.0/cartaporte20';  
  
  const cartaPorte20 = new CartaPorte20();  
  cartaPorte20.setAttributes({  
    Version: '2.0',  
    TranspInternac: 'No',  
    TotalDistRec: '2',  
  });  
  
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
  
  const ubicacion3 = new CtaPrt20Ubicacion();  
  ubicacion3.setAttributes({  
    IDUbicacion: 'DE202020',  
    TipoUbicacion: 'Destino',  
    RFCRemitenteDestinatario: 'AAA010101AAA',  
    FechaHoraSalidaLlegada: '2021-11-01T01:00:00',  
    DistanciaRecorrida: '1',  
  });  
  
  ubicacion3.setDomicilio({  
    Calle: 'calle',  
    NumeroExterior: '220',  
    Colonia: '0347',  
    Localidad: '23',  
    Referencia: 'casa blanca 3',  
    Municipio: '004',  
    Estado: 'COA',  
    Pais: 'MEX',  
    CodigoPostal: '25350',  
  });  
  cartaPorte20.setUbicacion(ubicacion3);  
  
  const mercancias = new CtaPrt20Mercancias();  
  mercancias.setAttributes({  
    PesoBrutoTotal: '2.0',  
    UnidadPeso: 'XBX',  
    NumTotalMercancias: '2',  
  });  
  
  const mercancia1 = mercancias.setMercancia({  
    BienesTransp: '11121900',  
    Descripcion: 'Productos de perfumería',  
    Cantidad: '1.0',  
    ClaveUnidad: 'XBX',  
    PesoEnKg: '1.0',  
    MaterialPeligroso: 'Sí',  
    CveMaterialPeligroso: '1266',  
    Embalaje: '4H2',  
  });  
  mercancia1.setPedimentos({ Pedimento: '1' });  
  mercancia1.setPedimentos({ Pedimento: '2' });  
  mercancia1.setGuiaIdentificacion({  
    DescripGuiaIdentificacion: '143',  
    NumeroGuiaIdentificacion: '2213',  
    PesoGuiaIdentificacion: 'NZ2332',  
  });  
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
  mercancia1.setCantidadTransporta({  
    Cantidad: '100',  
    IDDestino: '10',  
    IDOrigen: '10',  
    CvesTransporte: 'g',  
  });  
  
  mercancia1.setDetalleMercancia({  
    NumPiezas: '1',  
    PesoBruto: '1',  
    PesoNeto: '1',  
    PesoTara: '1',  
    UnidadPesoMerc: 'A44',  
  });  
  
  const autotransporte1 = mercancias.setAutotransporte({  
    NumPermisoSCT: '2',  
    PermSCT: '2',  
  });  
  
  autotransporte1.setIdentificacionVehicular({  
    AnioModeloVM: '2',  
    ConfigVehicular: '3',  
    PlacaVM: 'dsd',  
  });  
  autotransporte1.setIdentificacionVehicular({  
    AnioModeloVM: '2',  
    ConfigVehicular: '3',  
    PlacaVM: 'dad',  
  });  
  autotransporte1.setSeguro({  
    AseguraRespCivil: '',  
    PolizaRespCivil: '',  
    AseguraCarga: '',  
  });  
  autotransporte1.setSeguro({  
    AseguraRespCivil: '',  
    PolizaRespCivil: '',  
    AseguraCarga: '',  
  });  
  
  autotransporte1.setRemolque({  
    Placa: '3333',  
    SubTipoRem: 'trac',  
  });  
  autotransporte1.setRemolque({  
    Placa: '44444',  
    SubTipoRem: 'ambulancia',  
  });  
  
  const tMaritmo = mercancias.setTransporteMaritimo({  
    Matricula: 'ssss',  
    NacionalidadEmbarc: '2',  
    NombreAgenteNaviero: '344',  
    NumAutorizacionNaviero: '333',  
    NumCertITC: 'ee',  
    NumeroOMI: '3',  
    TipoCarga: '3',  
    TipoEmbarcacion: '4',  
    UnidadesDeArqBruto: '4',  
  });  
  tMaritmo.setContenedor({  
    MatriculaContenedor: '333',  
    TipoContenedor: 'MZN',  
  });  
  tMaritmo.setContenedor({  
    MatriculaContenedor: '444',  
    TipoContenedor: 'MZN2',  
  });  
  
  mercancias.setTransporteAereo({  
    CodigoTransportista: '222',  
    NumeroGuia: '2222',  
    NumPermisoSCT: '333',  
    PermSCT: '555',  
  });  
  
  const ferroviario = mercancias.setTransporteFerroviario({  
    TipoDeServicio: 'mega',  
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
      ToneladasNetasCarro: 'S',  
    },  
    contenedores: [  
      {  
        PesoContenedorVacio: '2KG',  
        PesoNetoMercancia: '300KG',  
        TipoContenedor: '2',  
      },  
    ],  
  });  
  
  const mercancia2 = mercancias.setMercancia({  
    BienesTransp: '11121910',  
    Descripcion: 'Productos de perfumería',  
    Cantidad: '1.0',  
    ClaveUnidad: 'XBX',  
    PesoEnKg: '1.0',  
    MaterialPeligroso: 'Sí',  
    CveMaterialPeligroso: '1266',  
    Embalaje: '4H2',  
  });  
  
  mercancia2.setPedimentos({ Pedimento: '11' });  
  mercancia2.setGuiaIdentificacion({  
    DescripGuiaIdentificacion: '143',  
    NumeroGuiaIdentificacion: '2213',  
    PesoGuiaIdentificacion: 'NZ2332',  
  });  
  
  mercancia2.setCantidadTransporta({  
    Cantidad: '100',  
    IDDestino: '10',  
    IDOrigen: '10',  
  });  
  
  cartaPorte20.setMercancias(mercancias);  
  
  const figuraT = new CtaPrt20FiguraTransporte();  
  figuraT.setAttributes({ TipoFigura: '1' });  
  figuraT.setPartesTransporte({ ParteTransporte: '1' });  
  figuraT.setPartesTransporte({ ParteTransporte: '1.1' });  
  const figuraT2 = new CtaPrt20FiguraTransporte();  
  figuraT2.setAttributes({ TipoFigura: '2' });  
  figuraT2.setPartesTransporte({ ParteTransporte: '2' });  
  figuraT2.setDomicilio({  
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
  figuraT2.setDomicilio({  
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
  cartaPorte20.setFiguraTransporte(figuraT);  
  cartaPorte20.setFiguraTransporte(figuraT2);  
  
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
                <cartaporte20:Ubicacion IDUbicacion="DE202020" TipoUbicacion="Destino" RFCRemitenteDestinatario="AAA010101AAA" FechaHoraSalidaLlegada="2021-11-01T01:00:00" DistanciaRecorrida="1">  
                    <cartaporte20:Domicilio Calle="calle" NumeroExterior="220" Colonia="0347" Localidad="23" Referencia="casa blanca 3" Municipio="004" Estado="COA" Pais="MEX" CodigoPostal="25350"/>  
                </cartaporte20:Ubicacion>  
            </cartaporte20:Ubicaciones>  
            <cartaporte20:Mercancias PesoBrutoTotal="2.0" UnidadPeso="XBX" NumTotalMercancias="2">  
                <cartaporte20:Mercancia BienesTransp="11121900" Descripcion="Productos de perfumería" Cantidad="1.0" ClaveUnidad="XBX" PesoEnKg="1.0" MaterialPeligroso="Sí" CveMaterialPeligroso="1266" Embalaje="4H2">  
                    <cartaporte20:Pedimentos Pedimento="1"/>  
                    <cartaporte20:Pedimentos Pedimento="2"/>  
                    <cartaporte20:GuiasIdentificacion DescripGuiaIdentificacion="143" NumeroGuiaIdentificacion="2213" PesoGuiaIdentificacion="NZ2332"/>  
                    <cartaporte20:GuiasIdentificacion DescripGuiaIdentificacion="143" NumeroGuiaIdentificacion="2213" PesoGuiaIdentificacion="NZ2332"/>  
                    <cartaporte20:CantidadTransporta Cantidad="100" IDDestino="10" IDOrigen="10"/>  
                    <cartaporte20:CantidadTransporta Cantidad="100" IDDestino="10" IDOrigen="10" CvesTransporte="g"/>  
                    <cartaporte20:DetalleMercancia NumPiezas="1" PesoBruto="1" PesoNeto="1" PesoTara="1" UnidadPesoMerc="A44"/>  
                </cartaporte20:Mercancia>  
                <cartaporte20:Mercancia BienesTransp="11121910" Descripcion="Productos de perfumería" Cantidad="1.0" ClaveUnidad="XBX" PesoEnKg="1.0" MaterialPeligroso="Sí" CveMaterialPeligroso="1266" Embalaje="4H2">  
                    <cartaporte20:Pedimentos Pedimento="11"/>  
                    <cartaporte20:GuiasIdentificacion DescripGuiaIdentificacion="143" NumeroGuiaIdentificacion="2213" PesoGuiaIdentificacion="NZ2332"/>  
                    <cartaporte20:CantidadTransporta Cantidad="100" IDDestino="10" IDOrigen="10"/>  
                </cartaporte20:Mercancia>  
                <cartaporte20:Autotransporte NumPermisoSCT="2" PermSCT="2">  
                    <cartaporte20:IdentificacionVehicular AnioModeloVM="2" ConfigVehicular="3" PlacaVM="dsd"/>  
                    <cartaporte20:IdentificacionVehicular AnioModeloVM="2" ConfigVehicular="3" PlacaVM="dad"/>  
                    <cartaporte20:Seguros AseguraRespCivil="" PolizaRespCivil="" AseguraCarga=""/>  
                    <cartaporte20:Seguros AseguraRespCivil="" PolizaRespCivil="" AseguraCarga=""/>  
                    <cartaporte20:Remolques>  
                        <cartaporte20:Remolque Placa="3333" SubTipoRem="trac"/>  
                        <cartaporte20:Remolque Placa="44444" SubTipoRem="ambulancia"/>  
                    </cartaporte20:Remolques>  
                </cartaporte20:Autotransporte>  
                <cartaporte20:TransporteMaritimo Matricula="ssss" NacionalidadEmbarc="2" NombreAgenteNaviero="344" NumAutorizacionNaviero="333" NumCertITC="ee" NumeroOMI="3" TipoCarga="3" TipoEmbarcacion="4" UnidadesDeArqBruto="4">  
                    <cartaporte20:Contenedor MatriculaContenedor="333" TipoContenedor="MZN"/>  
                    <cartaporte20:Contenedor MatriculaContenedor="444" TipoContenedor="MZN2"/>  
                </cartaporte20:TransporteMaritimo>  
                <cartaporte20:TransporteAereo CodigoTransportista="222" NumeroGuia="2222" NumPermisoSCT="333" PermSCT="555"/>  
                <cartaporte20:TransporteFerroviario TipoDeServicio="mega">  
                    <cartaporte20:DerechosDePaso KilometrajePagado="200" TipoDerechoDePaso="222"/>  
                    <cartaporte20:Carro GuiaCarro="3333" MatriculaCarro="3303MX" TipoCarro="AUTOMOVIL" ToneladasNetasCarro="S">  
                        <cartaporte20:Contenedor PesoContenedorVacio="2KG" PesoNetoMercancia="300KG" TipoContenedor="2"/>  
                    </cartaporte20:Carro>  
                </cartaporte20:TransporteFerroviario>  
            </cartaporte20:Mercancias>  
            <cartaporte20:FiguraTransporte>  
                <cartaporte20:TiposFigura TipoFigura="1">  
                    <cartaporte20:PartesTransporte ParteTransporte="1"/>  
                    <cartaporte20:PartesTransporte ParteTransporte="1.1"/>  
                </cartaporte20:TiposFigura>  
                <cartaporte20:TiposFigura TipoFigura="2">  
                    <cartaporte20:PartesTransporte ParteTransporte="2"/>  
                    <cartaporte20:Domicilio Calle="calle" NumeroExterior="211" Colonia="0347" Localidad="23" Referencia="casa blanca 1" Municipio="004" Estado="COA" Pais="MEX" CodigoPostal="25350"/>  
                    <cartaporte20:Domicilio Calle="calle" NumeroExterior="211" Colonia="0347" Localidad="23" Referencia="casa blanca 1" Municipio="004" Estado="COA" Pais="MEX" CodigoPostal="25350"/>  
                </cartaporte20:TiposFigura>  
            </cartaporte20:FiguraTransporte>  
        </cartaporte20:CartaPorte>  
    </cfdi:Complemento>
```
