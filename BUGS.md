# Bugs Encontrados - Auditoría contra Anexo 20, Guía de Llenado, XSD y XSLTs del SAT

Auditoría realizada comparando la implementación contra:
- `cfdv40.xsd` — Esquema XSD oficial CFDI 4.0
- `Anexo20_2022.pdf` — Anexo 20: Estándar CFDI
- `Anexo_20_Guia_de_llenado_CFDI.pdf` — Guía de llenado SAT
- XSLTs de complementos en `packages/files/4.0/complementos/`

---

## CRÍTICOS (causan rechazo del SAT)

### BUG-001: Orden de elementos Retenciones/Traslados invertido en Impuestos de Comprobante
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/impuestos.interface.ts`
- **Problema:** `XmlImpuestos` declara `cfdi:Traslados` antes de `cfdi:Retenciones`. El XSD requiere `Retenciones` primero, luego `Traslados` a nivel Comprobante.
- **Impacto:** XML generado con ambos nodos falla validación XSD del SAT.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 584-659: `<xs:sequence>` dentro de Comprobante > Impuestos define `Retenciones` (línea 585) antes de `Traslados` (línea 611).
  - Nota: A nivel Concepto (línea 195) el orden es inverso (Traslados primero, Retenciones después).

### BUG-002: Orden de elementos hijos de Concepto incorrecto
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/concepts.interface.ts`
- **Problema:** El XSD requiere este orden: `Impuestos → ACuentaTerceros → InformacionAduanera → CuentaPredial → ComplementoConcepto → Parte`. El tipo TS tiene orden diferente y `ACuentaTerceros`/`CuentaPredial` no están declarados en la interface.
- **Impacto:** XML con múltiples hijos en un concepto puede fallar validación XSD.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 189-492: `<xs:sequence>` dentro de Concepto:
    - Línea 190: `Impuestos` (minOccurs="0")
    - Línea 309: `ACuentaTerceros` (minOccurs="0")
    - Línea 351: `InformacionAduanera` (minOccurs="0", maxOccurs="unbounded")
    - Línea 369: `CuentaPredial` (minOccurs="0", maxOccurs="unbounded")
    - Línea 389: `ComplementoConcepto` (minOccurs="0")
    - Línea 399: `Parte` (minOccurs="0", maxOccurs="unbounded")

### BUG-003: Orden de InformacionGlobal y CfdiRelacionados depende del orden de llamada
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Comprobante.ts`
- **Problema:** Si `relacionados()` se llama después de `informacionGlobal()`, `CfdiRelacionados` queda antes de `InformacionGlobal`. XSD requiere: `InformacionGlobal` → `CfdiRelacionados` → `Emisor` → `Receptor` → `Conceptos`.
- **Impacto:** Rechazo del SAT cuando se usan ambos nodos.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 9-692: `<xs:sequence>` del Comprobante:
    - Línea 10: `InformacionGlobal` (primero)
    - Línea 38: `CfdiRelacionados` (segundo)
    - Línea 71: `Emisor`
    - Línea 113: `Receptor`
    - Línea 178: `Conceptos`

### BUG-004: Mismo tipo para Retencion de Comprobante y de Concepto (schemas distintos)
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/BaseImpuestos.ts`
- **Problema:** Comprobante > Retenciones > Retencion solo tiene `Impuesto` + `Importe`. Concepto > Retenciones > Retencion tiene `Base`, `Impuesto`, `TipoFactor`, `TasaOCuota`, `Importe`. Se usa `XmlTranRentAttributesProperties` para ambos, y `setRetencion()` ordena con las 5 claves, pudiendo inyectar campos `undefined` en retenciones de Comprobante.
- **Impacto:** XML de Comprobante con retenciones podría tener atributos vacíos que el SAT rechaza.
- **Referencia SAT:**
  - `cfdv40.xsd` líneas 596-605: Comprobante > Retencion — solo `Impuesto` (línea 596, use="required") e `Importe` (línea 601, use="required"). **2 atributos.**
  - `cfdv40.xsd` líneas 262-298: Concepto > Retencion — `Base` (línea 262), `Impuesto` (línea 274), `TipoFactor` (línea 279), `TasaOCuota` (línea 284), `Importe` (línea 296). **5 atributos**, todos use="required".

### BUG-005: Validación de Concepto.retencion() comentada
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Concepto.ts:214`
- **Problema:** `Schema.of().concepto.retencion.validate(retencion)` está comentado. No se valida el schema de retenciones a nivel concepto.
- **Impacto:** Datos inválidos pasan sin error y el SAT rechaza el CFDI.
- **Referencia SAT:**
  - `cfdv40.xsd` líneas 257-301: Define restricciones para Concepto > Retencion (Base minInclusive="0.000001", Impuesto del catálogo c_Impuesto, etc.).

### BUG-006: Falta atributo requerido `TipoDeTrafico` en CartaPorte20 TransporteFerroviario
- **Paquete:** `@cfdi/complementos`
- **Archivo:** `packages/cfdi/complementos/src/4.0/cartaporte20/types/CartaPorte20.xslt.ts`
- **Problema:** `XmlCPM20TFerroviarioAttribute` no incluye `TipoDeTrafico` que es `Requerido` en el XSLT.
- **Impacto:** Cadena original incorrecta para CFDIs con transporte ferroviario.
- **Referencia SAT:**
  - `CartaPorte20.xslt` líneas 482-483: `<xsl:call-template name="Requerido"><xsl:with-param name="valor" select="./@TipoDeTrafico"/></xsl:call-template>`

---

## ALTOS (pueden causar rechazo del PAC/SAT)

### BUG-007: ObjetoImp="02" sin nodo Impuestos no se rechaza
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Concepto.ts`
- **Problema:** Cuando `ObjetoImp` es `"02"` (Sí objeto de impuesto), el concepto DEBE tener `cfdi:Impuestos`. No se valida.
- **Impacto:** SAT rechaza el CFDI.
- **Referencia SAT:**
  - `Anexo_20_Guia_de_llenado_CFDI.pdf` página ~24, sección Concepto > ObjetoImp: "Se debe registrar la clave correspondiente para indicar si la operación comercial es objeto o no de impuesto." Clave "02" = Sí objeto de impuesto → impuestos deben desglosarse a nivel Concepto.

### BUG-008: ObjetoImp="01" con nodo Impuestos no se rechaza
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Concepto.ts`
- **Problema:** Cuando `ObjetoImp` es `"01"` (No objeto de impuesto), el concepto NO DEBE tener `cfdi:Impuestos`. No se valida.
- **Impacto:** SAT rechaza el CFDI.
- **Referencia SAT:**
  - `Anexo_20_Guia_de_llenado_CFDI.pdf` página ~24, sección Concepto > ObjetoImp: Clave "01" = No objeto de impuesto → no debe haber nodo de impuestos.

### BUG-009: Moneda="XXX" permite FormaPago (debería prohibirse)
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Comprobante.ts`
- **Problema:** Cuando `Moneda` es `"XXX"`, `FormaPago` NO debe existir. No hay validación condicional.
- **Impacto:** SAT rechaza el CFDI.
- **Referencia SAT:**
  - `Anexo_20_Guia_de_llenado_CFDI.pdf` sección Comprobante > Moneda: Cuando se usa "XXX" (transacciones sin moneda), FormaPago no aplica.

### BUG-010: TipoCambio no requerido cuando Moneda != MXN y != XXX
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Comprobante.ts`
- **Problema:** Cuando `Moneda` no es `"MXN"` ni `"XXX"`, `TipoCambio` es OBLIGATORIO. No se valida.
- **Impacto:** SAT rechaza el CFDI en moneda extranjera sin tipo de cambio.
- **Referencia SAT:**
  - `Anexo_20_Guia_de_llenado_CFDI.pdf` sección Comprobante > TipoCambio: "Este campo es requerido cuando la clave de moneda es distinta de 'MXN' (Peso Mexicano) y a la clave 'XXX'."

### BUG-011: `MontoTotalPagos` marcado como opcional en Pagos 2.0
- **Paquete:** `@cfdi/complementos`
- **Archivo:** `packages/cfdi/complementos/src/4.0/pago20/types/pago20.xslt.ts`
- **Problema:** `XmlPagos20TotalesAttributes.MontoTotalPagos` tiene `?` (opcional) pero es `Requerido` en el XSLT del SAT.
- **Impacto:** Cadena original incompleta, sello inválido.
- **Referencia SAT:**
  - `Pagos20.xslt` líneas 53-55: `<xsl:call-template name="Requerido"><xsl:with-param name="valor" select="./@MontoTotalPagos"/></xsl:call-template>`

---

## MEDIOS (tipado incorrecto, podrían causar problemas)

### BUG-012: `Sello` y `Certificado` opcionales en interface pero requeridos en XSD
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/comprobante.interface.ts:62-63`
- **Problema:** `ComprobanteSignature` tiene `Certificado?: string` y `Sello?: string`. XSD dice `use="required"`.
- **Nota:** Se setean en runtime por `certificar()` y `sellar()`, pero el tipo permite omitirlos.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 734: `<xs:attribute name="Sello" use="required">`
  - `cfdv40.xsd` línea 761: `<xs:attribute name="Certificado" use="required">`

### BUG-013: `Emisor` y `Receptor` opcionales en `XmlComprobante` pero requeridos en XSD
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/comprobante.interface.ts:22-23`
- **Problema:** Tienen `?` pero son requeridos por el XSD (sin `minOccurs="0"`).
- **Referencia SAT:**
  - `cfdv40.xsd` línea 71: `<xs:element name="Emisor">` (sin minOccurs → default 1, requerido)
  - `cfdv40.xsd` línea 113: `<xs:element name="Receptor">` (sin minOccurs → default 1, requerido)

### BUG-014: `Version` opcional en interface pero required fixed="4.0" en XSD
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/comprobante.interface.ts:66`
- **Problema:** `Version?: string` debería ser `Version: '4.0'`.
- **Nota:** Se inyecta en runtime, pero el tipo es incorrecto.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 693: `<xs:attribute name="Version" use="required" fixed="4.0">`
  - `Anexo20_2022.pdf`: "Atributo requerido con valor prefijado a 4.0 que indica la versión del estándar bajo el que se encuentra expresado el comprobante."

### BUG-015: `Base` opcional en tipo compartido pero requerido para Comprobante Traslado
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/impuestos.interface.ts:29`
- **Problema:** `Base?: string | number` en `XmlTranRentAttributesProperties`, pero el XSD requiere `Base` en Comprobante > Traslado.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 622: `<xs:attribute name="Base" type="tdCFDI:t_Importe" use="required">`

### BUG-016: Total no se calcula ni valida contra fórmula
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Comprobante.ts`
- **Problema:** `Total = SubTotal - Descuento + Traslados - Retenciones`. No se calcula ni valida.
- **Referencia SAT:**
  - `Anexo_20_Guia_de_llenado_CFDI.pdf` sección Comprobante > Total: "Es la suma del subtotal, menos los descuentos aplicables, más las contribuciones recibidas (impuestos trasladados federales o locales, derechos, productos, aprovechamientos, aportaciones de seguridad social, contribuciones de mejoras) menos los impuestos retenidos federales y/o locales. No se permiten valores negativos."

### BUG-017: InformacionGlobal no requerido para público en general
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Comprobante.ts`
- **Problema:** Cuando `Receptor.Rfc = XAXX010101000` y `TipoDeComprobante` es `"I"` o `"E"`, `InformacionGlobal` es OBLIGATORIO. No se valida.
- **Referencia SAT:**
  - `Anexo_20_Guia_de_llenado_CFDI.pdf` sección InformacionGlobal y ejemplos con RFC `XAXX010101000`.
  - `cfdv40.xsd` línea 10: `<xs:element name="InformacionGlobal" minOccurs="0">` — opcional en XSD pero obligatorio por regla de negocio del SAT cuando el receptor es público en general.

### BUG-018: `Emisor`/`Receptor` inicializados como `{}` vacíos
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/elements/Comprobante.ts`
- **Problema:** `restartCfdi()` inicializa `'cfdi:Emisor': {}` y `'cfdi:Receptor': {}`. Si se serializa sin configurarlos, genera `<cfdi:Emisor/>` sin atributos requeridos.
- **Referencia SAT:**
  - `cfdv40.xsd` línea 71-112: Emisor requiere `Rfc` (use="required"), `Nombre` (use="required"), `RegimenFiscal` (use="required").
  - `cfdv40.xsd` línea 113-177: Receptor requiere `Rfc`, `Nombre`, `DomicilioFiscalReceptor`, `RegimenFiscalReceptor`, `UsoCFDI` (todos use="required").

### BUG-019: `Version` de Pagos20 opcional en TS pero requerido en XSLT
- **Paquete:** `@cfdi/complementos`
- **Archivo:** `packages/cfdi/complementos/src/4.0/pago20/types/pago20.xslt.ts:8`
- **Problema:** `XmlPagos20Attributes.Version` tiene `?`. Se default a `'2.0'` en constructor pero tipo es incorrecto.
- **Referencia SAT:**
  - `Pagos20.xslt` líneas 6-8: `<xsl:call-template name="Requerido"><xsl:with-param name="valor" select="./@Version"/></xsl:call-template>`

### BUG-020: `rfcPago` requerido en IEDU pero es Opcional en XSLT
- **Paquete:** `@cfdi/complementos`
- **Archivo:** `packages/cfdi/complementos/src/4.0/iedu/type/iedu.xslt.ts:12`
- **Problema:** `rfcPago: string` (requerido) pero XSLT marca `Opcional`. Obliga al usuario a dar un valor innecesario.
- **Referencia SAT:**
  - `iedu.xslt` líneas 22-23: `<xsl:call-template name="Opcional"><xsl:with-param name="valor" select="./@rfcPago"/></xsl:call-template>`

### BUG-021: Falta `NombreEstacion` en CartaPorte20 Ubicacion
- **Paquete:** `@cfdi/complementos`
- **Archivo:** `packages/cfdi/complementos/src/4.0/cartaporte20/types/CartaPorte20.xslt.ts`
- **Problema:** `XmlCP20UbicacionAttribute` no incluye `NombreEstacion` (Opcional en XSLT). Atributo silenciosamente descartado.
- **Referencia SAT:**
  - `CartaPorte20.xslt` líneas 65-66: `<xsl:call-template name="Opcional"><xsl:with-param name="valor" select="./@NombreEstacion"/></xsl:call-template>`

### BUG-022: `Concesionario` extra en CartaPorte20 TransporteFerroviario
- **Paquete:** `@cfdi/complementos`
- **Archivo:** `packages/cfdi/complementos/src/4.0/cartaporte20/types/CartaPorte20.xslt.ts`
- **Problema:** `XmlCPM20TFerroviarioAttribute` tiene `Concesionario?: string` que no existe en el XSLT del SAT.
- **Referencia SAT:**
  - `CartaPorte20.xslt`: Se buscó `Concesionario` en todo el archivo — **0 resultados**. Este atributo no pertenece al XSLT de CartaPorte 2.0.

---

## BAJOS (cosméticos)

### BUG-023: Comentario de namespace dice `cfd/3` en vez de `cfd/4`
- **Paquete:** `@cfdi/xml`
- **Archivo:** `packages/cfdi/xml/src/types/comprobante.interface.ts:86`
- **Problema:** Comentario `// http://www.sat.gob.mx/cfd/3` debería decir `cfd/4`. El valor runtime es correcto.
- **Referencia SAT:**
  - `Anexo20_2022.pdf`: "Es obligatorio el uso de la declaración: xmlns:cfdi=\"http://www.sat.gob.mx/cfd/4\""

---

## Resumen

| Severidad | Cantidad | Paquete |
|-----------|----------|---------|
| Crítico | 6 | xml (5), complementos (1) |
| Alto | 5 | xml (4), complementos (1) |
| Medio | 11 | xml (7), complementos (4) |
| Bajo | 1 | xml (1) |
| **Total** | **23** | |

### Fuentes de referencia utilizadas
| Documento | Ruta |
|-----------|------|
| XSD CFDI 4.0 | `packages/files/4.0/cfdv40.xsd` |
| Anexo 20 (2022) | `packages/files/4.0/Anexo20_2022.pdf` |
| Guía de llenado CFDI | `packages/files/4.0/Anexo_20_Guia_de_llenado_CFDI.pdf` |
| XSLT Pagos 2.0 | `packages/files/4.0/complementos/Pagos20.xslt` |
| XSLT CartaPorte 2.0 | `packages/files/4.0/complementos/CartaPorte20.xslt` |
| XSLT IEDU | `packages/files/4.0/complementos/iedu.xslt` |
