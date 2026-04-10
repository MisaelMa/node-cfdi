# @saxon-he/cli

Wrapper de Saxon-HE para ejecutar transformaciones XSLT y consultas XPath desde Node.js. Proporciona una API fluida (builder pattern) que construye y ejecuta comandos Saxon-HE.

## Instalacion

```bash
npm install @saxon-he/cli
```

Requiere tener el binario de Saxon-HE instalado en el sistema.

## Uso

### Transformacion XSLT

```typescript
import { Transform } from '@saxon-he/cli';

const transform = new Transform({ binary: '/ruta/saxon-he' });

const resultado = transform
  .s('/ruta/archivo.xml')       // Archivo XML de entrada
  .xsl('/ruta/estilos.xslt')   // Hoja de estilos XSLT
  .warnings('silent')           // Silenciar advertencias
  .run();                       // Ejecutar y obtener resultado

console.log(resultado);
```

### Transformacion con salida a archivo

```typescript
const transform = new Transform({ binary: '/ruta/saxon-he' });

transform
  .s('/ruta/entrada.xml')
  .xsl('/ruta/transformacion.xslt')
  .o('/ruta/salida.html')      // Archivo de salida
  .run();
```

### Consulta XQuery

```typescript
import { Query } from '@saxon-he/cli';

const query = new Query({ binary: '/ruta/saxon-he' });

const resultado = query
  .s('/ruta/archivo.xml')
  .qs('//elemento/@atributo')   // Consulta XQuery inline
  .run();
```

### Consulta desde archivo

```typescript
const query = new Query({ binary: '/ruta/saxon-he' });

const resultado = query
  .s('/ruta/datos.xml')
  .q('/ruta/consulta.xq')       // Archivo de consulta XQuery
  .projection('on')
  .run();
```

## API

### Clase `Transform`

Metodos principales para transformaciones XSLT:

| Metodo | Descripcion |
|--------|-------------|
| `s(filename)` | Archivo XML de entrada |
| `xsl(filename)` | Hoja de estilos XSLT |
| `o(filename)` | Archivo de salida |
| `im(modename)` | Modo inicial de la transformacion |
| `it(template)` | Template inicial |
| `warnings(level)` | Nivel de advertencias: `'silent'`, `'recover'`, `'fatal'` |
| `a(option)` | Activar/desactivar resolvedores: `'on'`, `'off'` |
| `run()` | Ejecutar el comando y retornar el resultado como string |

### Clase `Query`

Metodos principales para consultas XQuery/XPath:

| Metodo | Descripcion |
|--------|-------------|
| `s(filename)` | Archivo XML de entrada |
| `q(queryfile)` | Archivo de consulta XQuery |
| `qs(querystring)` | Consulta XQuery inline |
| `backup(option)` | Activar/desactivar backup: `'on'`, `'off'` |
| `projection(option)` | Activar/desactivar proyeccion: `'on'`, `'off'` |
| `stream(option)` | Activar/desactivar streaming: `'on'`, `'off'` |
| `run()` | Ejecutar el comando y retornar el resultado como string |

### Metodos compartidos (Transform y Query)

Ambas clases heredan de `CliShare` y comparten estos metodos:

| Metodo | Descripcion |
|--------|-------------|
| `o(filename)` | Archivo de salida |
| `s(filename)` | Archivo XML de entrada |
| `val(validation)` | Validacion: `'strict'`, `'lax'` |
| `dtd(option)` | Procesamiento DTD |
| `expand(option)` | Expansion de atributos |
| `xsd(file)` | Archivo de esquema XSD |
| `strip(option)` | Eliminacion de espacios en blanco |
| `catalog(filenames)` | Catalogos XML |
| `run()` | Ejecutar el comando |

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
