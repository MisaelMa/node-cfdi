# @cfdi/csf

Extraccion de datos de la Constancia de Situacion Fiscal (CSF) del SAT a partir de un archivo PDF. Parsea el documento y retorna los datos estructurados del contribuyente.

## Instalacion

```bash
npm install @cfdi/csf
```

## Uso

```typescript
import { csf } from '@cfdi/csf';

// Extraer datos estructurados
const datos = await csf('/ruta/a/constancia.pdf');
console.log(datos);
// {
//   id_cif: '...',
//   rfc: 'XAXX010101000',
//   curp: 'XAXX010101HDFRRR09',
//   nombre: 'NOMBRE',
//   primer_apellido: 'APELLIDO',
//   segundo_apellido: 'APELLIDO',
//   fecha_inicio_de_operaciones: '01/01/2020',
//   cp: '06600',
//   tipo_de_vialidad: 'CALLE',
//   nombre_de_vialidad: '...',
//   numero_exterior: '10',
//   numero_interior: '',
//   nombre_de_la_colonia: '...',
//   nombre_de_la_localidad: '...',
//   nombre_del_municipio: '...',
//   nombre_de_la_entidad_federativa: '...',
//   regimen: '...',
//   ...
// }

// Obtener datos crudos del PDF (array de strings)
const datosCrudos = await csf('/ruta/a/constancia.pdf', true);
```

## API

### `csf(constancia, onlyData?)`

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `constancia` | `string` | Ruta al archivo PDF de la constancia |
| `onlyData` | `boolean` | Si es `true`, retorna el array crudo de textos extraidos. Por defecto `false` |

**Retorna:** Un objeto con los campos del contribuyente (RFC, CURP, nombre, domicilio, regimen, etc.) o un array de strings si `onlyData` es `true`.

## Licencia

[MIT](../../LICENSE)
