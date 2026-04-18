# Complemento INE

# INE 1.1

Complemento para el Instituto Nacional Electoral.

```typescript
import { Ine } from '@cfdi/complementos';

const ine = new Ine({
   Version: '1.1',
   TipoProceso: 'Ordinario',
   TipoComite: 'Ejecutivo Nacional',
});

ine.Entidad({ ClaveEntidad: 'AGU', Ambito: 'Local' });
ine.Contabilidad({ IdContabilidad: '1' });

cfdi.complemento(ine);
```

```xml
<cfdi:Complemento>
  <ine:INE Version="1.1" TipoProceso="Ordinario" TipoComite="Ejecutivo Nacional">
    <ine:Entidad ClaveEntidad="AGU" Ambito="Local">
      <ine:Contabilidad IdContabilidad="1"/>
    </ine:Entidad>
  </ine:INE>
</cfdi:Complemento>
```

## Atributos

### Constructor

| Atributo | Tipo | Requerido | Descripcion |
|----------|------|-----------|-------------|
| Version | string | Si | Version del complemento (1.1) |
| TipoProceso | string | Si | Ordinario, Precampana, Campana |
| TipoComite | string | No | Ejecutivo Nacional, Ejecutivo Estatal, Directivo Estatal |
| IdContabilidad | string | No | ID de contabilidad (max 6 digitos) |

### Entidad

| Atributo | Tipo | Requerido | Descripcion |
|----------|------|-----------|-------------|
| ClaveEntidad | string | Si | Codigo de entidad federativa (AGU, BCN, BCS, etc.) |
| Ambito | string | No | Local o Federal |

### Contabilidad

> Requiere haber llamado `Entidad()` primero.

| Atributo | Tipo | Requerido | Descripcion |
|----------|------|-----------|-------------|
| IdContabilidad | string | Si | ID de contabilidad |
