# @renapo/curp

Validacion local y consulta en linea de CURP (Clave Unica de Registro de Poblacion). Permite validar el formato de una CURP y consultar datos en el servicio RENAPO del gobierno de Mexico.

## Instalacion

```bash
npm install @renapo/curp
```

## Uso

### Validacion local

```typescript
import { curp } from '@renapo/curp';

// Validacion basica (solo formato y regex)
const resultado = curp.validateLocal('GARC850101HDFRRL09');
// { isValid: true, rfc: 'GARC850101HDFRRL09', error: [] }

// Validacion completa (formato, fecha, estado, digito verificador)
const resultado2 = curp.validate('GARC850101HDFRRL09');

// Obtener estado de nacimiento
const estado = curp.getState('GARC850101HDFRRL09'); // 'DF'
```

### Consulta en RENAPO (gobierno)

```typescript
import { gob } from '@renapo/curp';

// Buscar por CURP
const persona = await gob.findByCurp('GARC850101HDFRRL09');

// Buscar por datos personales
const persona2 = await gob.findByData({
  nombre: 'JUAN',
  primerApellido: 'GARCIA',
  segundoApellido: 'LOPEZ',
  diaNacimiento: '01',
  mesNacimiento: '01',
  selectedYear: '1985',
  claveEntidad: 'DF',
  sexo: 'H',
});

// Guardar PDF de la CURP
gob.savePDF({
  file: base64String,
  fullPath: '/ruta/destino/curp.pdf',
});
```

## API

### Modulo `curp`

| Funcion | Descripcion |
|---------|-------------|
| `validateLocal(input)` | Validacion basica de formato con regex |
| `validate(input)` | Validacion completa (formato, fecha, estado, digito verificador) |
| `getState(curp)` | Retorna la clave del estado de nacimiento |

### Modulo `gob`

| Funcion | Descripcion |
|---------|-------------|
| `findByCurp(curp)` | Consulta datos de una persona por su CURP en RENAPO |
| `findByData(data)` | Busca CURP por datos personales (nombre, apellidos, fecha, etc.) |
| `getBase64Pdf(params)` | Obtiene el PDF de la CURP en base64 |
| `savePDF({ file, fullPath })` | Guarda un PDF de CURP en base64 a un archivo |

**Nota:** Las consultas al servicio de gobierno (`gob`) requieren resolver un captcha mediante el servicio 2captcha.

## Licencia

[MIT](../../LICENSE)
