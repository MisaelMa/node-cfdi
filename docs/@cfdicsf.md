# Constancia de Situacion Fiscal

# CSF

Extraccion de datos de la Constancia de Situacion Fiscal en PDF

```bash
npm i @cfdi/csf --save
```

## Uso

```typescript
import { csf } from '@cfdi/csf';

const constancia = '/home/dev/OMAR-CONSTANCIA.pdf';

// Obtener datos parseados
const data = await csf(constancia);
console.log(data.rfc);
console.log(data.nombre);
console.log(data.regimen);

// Obtener texto crudo del PDF
const rawText = await csf(constancia, true);
```

## Datos retornados

```typescript
{
  id_cif: string,
  rfc: string,
  curp: string,
  nombre: string,
  primer_apellido: string,
  segundo_apellido: string,
  fecha_inicio_de_operaciones: string,
  estatus_en_el_padrón: string,
  fecha_de_último_cambio_de_estado: string,
  nombre_comercial: string,
  cp: string,
  tipo_de_vialidad: string,
  nombre_de_vialidad: string,
  numero_exterior: string,
  numero_interior: string,
  nombre_de_la_colonia: string,
  nombre_de_la_localidad: string,
  nombre_del_municipio: string,
  nombre_de_la_entidad_federativa: string,
  entre_calle: string,
  y_calle: string,
  regimen: string
}
```
