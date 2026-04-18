# Generar QR

Especificación técnica del código de barras bidimensional (QR Code) que debe incorporarse en la representación impresa de los comprobantes fiscales.

## Lineamientos generales

Las representaciones impresas de los comprobantes fiscales digitales por Internet deben incluir un código de barras bidimensional conforme al formato QR Code (Quick Response Code), usando capacidad de corrección de error con nivel mínimo **M**, descrita en el estándar **ISO/IEC 18004**.

- Tamaño mínimo impreso: cuadro de **2.75 cm** por lado.
- Nivel de corrección: **M** o superior.
- Los parámetros se separan con el carácter `&` estándar de query string y se URL-encodean.

---

## Tipos de QR soportados

El SAT define distintas expresiones impresas según el tipo de comprobante. Actualmente se reconocen tres variantes oficiales:

| Tipo | Comprobante | Endpoint de verificación |
|------|-------------|--------------------------|
| 1 | CFDI 4.0 (Ingreso, Egreso, Traslado, Nómina) | `verificacfdi.facturaelectronica.sat.gob.mx` |
| 2 | CFDI con Complemento de Pagos 2.0 | `verificacfdi.facturaelectronica.sat.gob.mx` |
| 3 | CFDI de Retenciones e Información de Pagos 2.0 | `prodretencionverificacion.clouda.sat.gob.mx` |
| 4 | Complemento Carta Porte 3.0 / 3.1 (QR adicional) | `verificacfdi.facturaelectronica.sat.gob.mx/verificaccp` |

---

## 1. CFDI 4.0 — Ingreso / Egreso / Traslado / Nómina

Debe contener los siguientes datos, en este orden:

- URL del servicio de verificación pública del SAT.
- Folio fiscal del comprobante (**UUID**) → parámetro `id`.
- RFC del **emisor** → parámetro `re`.
- RFC del **receptor** → parámetro `rr`.
- **Total** del comprobante con 6 decimales, 10 enteros (18 caracteres, con ceros a la izquierda) → parámetro `tt`.
- Últimos **8 caracteres** del sello digital del emisor (del TFD) → parámetro `fe`.

### Formato

```
https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id={UUID}&re={RFC_EMISOR}&rr={RFC_RECEPTOR}&tt={TOTAL}&fe={SELLO_8}
```

### Ejemplo

```
https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=5803EB8D-81CD-4557-8719-26632D2FA434&re=XAXX010101000&rr=CARR861127SB0&tt=0000014300.000000&fe=rH8/bw==
```

---

## 2. CFDI con Complemento de Pagos 2.0

Aplica cuando el CFDI es de tipo **Pago** (`TipoDeComprobante = P`). Usa el mismo endpoint que el CFDI normal, pero la construcción del parámetro `tt` cambia:

- `tt` se arma con el **TotalPagos** del complemento de pagos, formateado igual (18 caracteres, 6 decimales).
- `fe` sigue siendo los últimos 8 caracteres del sello del **Timbre Fiscal Digital**.

### Formato

```
https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id={UUID}&re={RFC_EMISOR}&rr={RFC_RECEPTOR}&tt={TOTAL_PAGOS}&fe={SELLO_8}
```

> Si el CFDI de pago tiene `Total = 0` en el comprobante, el `tt` debe tomarse de `pago20:Pagos/@TotalPagos`, no del atributo `Total` del comprobante.

---

## 3. CFDI de Retenciones e Información de Pagos 2.0

Los comprobantes de **retenciones** usan un endpoint distinto y parámetros con nombres diferentes:

- `folio` → UUID de la retención.
- `re` → RFC del emisor (retenedor).
- `rr` → RFC del receptor (retenido).
- `tt` → monto total de la operación.
- `fe` → últimos 8 caracteres del sello del emisor.

### Formato

```
https://prodretencionverificacion.clouda.sat.gob.mx/?folio={UUID}&re={RFC_EMISOR}&rr={RFC_RECEPTOR}&tt={TOTAL}&fe={SELLO_8}
```

> Para retenciones a residentes en el extranjero (sin RFC), se usa `NumRegIdTrib` en lugar de `rr`, según el anexo técnico de retenciones.

---

## 4. Complemento Carta Porte 3.0 / 3.1

Los CFDI con complemento **Carta Porte** deben incluir **dos QR** en su representación impresa:

1. El QR estándar del CFDI (sección 1 de este documento).
2. Un QR **adicional** propio del complemento Carta Porte, que permite verificar el traslado de mercancías.

### Parámetros

- `IdCCP` → identificador único del Complemento Carta Porte (atributo `IdCCP` del complemento, formato `CCCXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`).
- `FechaOrigSalida` → fecha y hora de salida (del nodo Origen).
- `FechaDestLlegada` → fecha y hora programada de llegada (del nodo Destino).

### Formato

```
https://verificacfdi.facturaelectronica.sat.gob.mx/verificaccp/default.aspx?IdCCP={IdCCP}&FechaOrig={FechaOrigSalida}&FechaDest={FechaDestLlegada}
```

> Este QR es **adicional**, no reemplaza al QR estándar del CFDI. Ambos deben aparecer en la representación impresa de una Carta Porte.

---

## Reglas de formato para los parámetros

| Campo | Regla |
|-------|-------|
| `id` / `folio` | UUID en mayúsculas con guiones (`XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`) |
| `re`, `rr` | RFC en mayúsculas, sin espacios |
| `tt` | 10 enteros + punto + 6 decimales, ceros a la izquierda. Ej: `0000014300.000000` |
| `fe` | Últimos 8 caracteres del `Sello` del TFD tal cual (incluye `/`, `+`, `=`) |

Los valores se deben **URL-encodear** al construir la URL final (particularmente `fe` que puede traer `+`, `/` y `=`).

---

## Estado del soporte en `@cfdi/expresiones`

El paquete actualmente genera la **cadena original** a partir del XML. La generación del string del QR y la imagen PNG/SVG para los tres tipos anteriores está en desarrollo.

> Próximamente: API unificada `generateQR(xml, { type: 'cfdi' | 'pago' | 'retencion' })` que devuelva la URL y la imagen del QR.
