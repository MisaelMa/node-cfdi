# cfdi XSD

# xsd

En fase de desarrollo



Recientemente me han estado propopiendo dejar de usar saxon para temas de lambdas, si has estado usando nuestro proyecto  recordaras que ocupa java y si nuestro servidor es propio es mas sencillo realizarlo pero si solo requerimos serverless para generar una facturar entonces tenemos que hacer algunas cosas raras para que funcione.



investigando me tope con algunas de las siguiente librerias para remplazar a saxon

[`xslt-processor`](https://www.npmjs.com/package/xslt-processor)

[`xsltproc`](https://www.npmjs.com/package/xsltproc)



lamentable mente no funcionaron para generar la cadena original (si conoces otra que puediera ayudarnos con eso seria de gran ayuda)

```plain
||4.0|E|ACACUN-27|2014-07-08T12:16:50|01|20001000000300022815|16148.04|645.92|MXN|17207.35|I|01|PUE|México  
|amir|1|2|01|asdasd-3234-asdasd-2332-asdas|asdasd-3234-asdasd-2332-asdas  
|TCM970625MB1|FACTURACION MODERNA SA DE CV|601|asdasd  
|XAXX010101000|PUBLICO EN GENERAL|112|22|G01|001|1212|2|pieza|  
Pieza|audifonos|1000|2000|00.0|01|1.0|ejemplo garcia correa|EJEMPLOGH101004HQRRRN|Primaria|201587PRIM  
|XAXX010101000|002|59.17|1000|1|002|Tasa|0.16|59.17||
```



## Funcionalidad de saxon



Saxon por lo general realiza la transpilacion del xml a la cadena origianal proveyendole los `archivos.xslt` y con eso internamente realizar el procesamiento de los datos del xml.

yo pensaba que saxon no realizaba peticiones externas por que ya le estaba pasando los `archivos.xslt` pero al realizar ing inversa me di cuenta que si realiza las peticones a los esquemas `.sxd`s practicamente realiza peticiones a los esquemas del sat.

```javascript
"xsi:schemaLocation": "  http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd  http://www.sat.gob.mx/iedu http://www.sat.gob.mx/sitio_internet/cfd/iedu/iedu.xsd",
```

realiza peticones a 

1. [http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd](http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd) 
2. [http://www.sat.gob.mx/sitio_internet/cfd/iedu/iedu.xsd](http://www.sat.gob.mx/sitio_internet/cfd/iedu/iedu.xsd)

con esto saxon genera la cadena original  


> Realmente no se si use los `archivos.xslt` por que estuve tratando de recrear la cadena original y me di cuenta de algo raro

aqui el usu actualmente 

```javascript
const styleSheet = '/home/dev/4.0/cadenaoriginal.xslt';  
  
const cfd = new CFDI(comprobanteAttribute, {  
    debug: true,  
    xslt: {  
      path: styleSheet,  
    },  
});
```



pero vamos a las pruebas que he realizado 



en mi xml de prueba he agregado una propiedad a los atributos del comprobante del cfdi (ojo esto lo colocaba por que pesaba que era correcto y esta propiedad es opcional)

```javascript
"condicionesDePago": "Contado",
```

![](https://ik.imagekit.io/gky5zgkgy/article/amir__1-A_wthXj)



vaya mi sorpresa al realizar la cadena original

```js
{  
"xsd": "||4.0|E|ACACUN-27|2014-07-08T12:16:50|01|20001000000300022815|Contado|16148.04|645.92|MXN",  
"saxon": "||4.0|E|ACACUN-27|2014-07-08T12:16:50|01|20001000000300022815|16148.04|645.92|MXN",  
}
```



a simple vista no se observa pero en la salida de saxon no existe ese valor de `Contado`, revise arduamente mi codigo para saber si yo tenia algo mal(ojo aun no implemento TDD por lo mismo verifico mucho esto).

 

la razon por la cual me di cuenta que saxon realiza las peticones de los `schemaLocation`cosa que si se deberia hacer para validar el valor y verificar la integridad de los datos

```xml
<xs:attribute name="CondicionesDePago" use="optional">  
   <xs:annotation>  
     <xs:documentation>Atributo condicional para expresar las condiciones comerciales aplicables para el pago</xs:documentation>  
    </xs:annotation>  
    <xs:simpleType>  
       <xs:restriction base="xs:string">  
          <xs:whiteSpace value="collapse"/>  
           <xs:minLength value="1"/>  
           <xs:maxLength value="1000"/>  
           <xs:pattern value="[^|]{1,1000}"/>  
       </xs:restriction>  
    </xs:simpleType>  
</xs:attribute>
```

esa es la razon por la cual creo que esta implementacion no tiene mucho sentido(para realizar este codigo busque muchos ejemplos), pero no tenia la necesidad de migrar a lambdas por lo cual siempre pense que este proceso de deberia realizar asi.

```javascript
const styleSheet = '/home/dev/4.0/cadenaoriginal.xslt';  
  
const cfd = new CFDI(comprobanteAttribute, {  
    debug: true,  
    xslt: {  
      path: styleSheet,  
    },  
});
```

Lo que se hace actualmente no es  incorrecto si no que no sabia que hacia como tal **saxon.**

si la implementacion de esta libreria sale todo bien dejaremos de un lado los **styleSheet ** y pasaremos a usar las `.xsd` cosa que ayudara mucho a validar mas la informacion antes de mandarla.



por otro lado te estaras preguntan o en caso de que no yo si jajaja



la propiedad `CondicionesDePago` es opcional pero si la colocamos y saxon valida todo esto deberia generar un `ERROR` la razon por la cual no ocurre

es por que en el codigo esta esta propiedad `warnings('silent')`



```javascript
transform.s(fullPath).xsl(String(this.xslt.path)).warnings('silent').run();
```



por esta razon saxon omite esta propiedad y no la coloca en la cadena original



## Que es la cadena origianal?



Son todos los valores que colocamos en el xml y que al final hacen unico el xml mas la fecha con la hora.
