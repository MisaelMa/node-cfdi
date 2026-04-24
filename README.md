# @signati/core

> ## ⚠️ Paquete deprecado — migra a [`@cfdi/xml`](https://www.npmjs.com/package/@cfdi/xml)
>
> Este paquete **ya no recibe mantenimiento activo**. Esta release es un parche de compatibilidad para quienes deben seguir emitiendo CFDI 4.0 durante la transición, e incluye el nuevo complemento obligatorio **Hidrocarburos y Petrolíferos (`HidroYPetro` v1.0)** publicado por el SAT el 25-03-2026 y obligatorio desde el 24-04-2026.
>
> **Se recomienda fuertemente migrar cuanto antes** al nuevo ecosistema `@cfdi/*`, que reemplaza a `@signati/core` con mejoras de rendimiento, soporte nativo de AWS Lambda y mantenimiento continuo. Los futuros complementos y cambios del SAT solo se liberarán en los paquetes nuevos.

## Migración recomendada

| `@signati/core` (deprecado) | Reemplazo en `@cfdi/*` |
|---|---|
| Generación y sellado de XML CFDI | [`@cfdi/xml`](https://www.npmjs.com/package/@cfdi/xml) |
| Catálogos del SAT | [`@cfdi/catalogos`](https://www.npmjs.com/package/@cfdi/catalogos) |
| Certificados de Sello Digital (`.cer`/`.key`) | [`@cfdi/csd`](https://www.npmjs.com/package/@cfdi/csd) |
| Utilidades generales | `@cfdi/utils` |
| Generación de PDF | `@cfdi/pdf` |
| Consulta de CURP | `@cfdi/curp` |
| Constancia de Situación Fiscal (CSF) | `@cfdi/csf` |
| Validación de RFC | `@cfdi/rfc` |

### Por qué migrar

- **Mantenimiento activo**: los complementos nuevos y cambios del SAT se agregan primero en `@cfdi/xml`.
- **Rendimiento**: el motor XSLT nativo (`@cfdi/transform`) elimina la dependencia de Saxon/JDK para generar la cadena original, lo que habilita su uso en entornos serverless (AWS Lambda, Cloudflare Workers, Vercel).
- **Modular**: instala solo los paquetes que necesitas en lugar de un monolito.
- **Tipado completo**: tipos y enums de catálogos SAT generados desde los XSD oficiales.

### Arranque rápido en `@cfdi/xml`

```bash
npm install @cfdi/xml @cfdi/catalogos @cfdi/csd @cfdi/complementos
```

La guía oficial de migración y ejemplos viven en la documentación del proyecto: https://cfdi.recreando.dev

---

## Contexto histórico

Hace varios años este paquete (`@signati/core`) empezó a darle mantenimiento indirecto al ecosistema de facturación electrónica en México. Con el tiempo se decidió rediseñar el proyecto en una suite modular (`@cfdi/*`) para resolver limitaciones de empaquetado, rendimiento y mantenimiento a largo plazo.

Puedes seguir usando `@signati/core` para emitir CFDI, pero ten en cuenta que **esta será una de las últimas versiones publicadas** y que no se agregarán complementos nuevos más allá del soporte de emergencia para `HidroYPetro`.
