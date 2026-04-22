# Notas de Actualización - XSDLoader

## Resumen de Cambios

Se ha implementado una nueva clase `XSDLoader` que unifica la carga de archivos XSD tanto desde rutas locales como desde URLs. Esta implementación mejora la flexibilidad y mantiene compatibilidad hacia atrás.

## Nuevas Funcionalidades

### 1. Clase XSDLoader

- **Carga desde URLs**: Descarga automática de archivos XSD con timeout configurable
- **Carga desde rutas locales**: Lectura de archivos del sistema de archivos
- **Validación automática**: Verifica extensión .xsd y contenido válido
- **Manejo de errores**: Mensajes de error descriptivos
- **Singleton Pattern**: Instancia única reutilizable

### 2. Actualizaciones en CfdiProcess

- Migrado para usar `XSDLoader` en lugar de `readFileSync` directo
- Nuevo método `setConfig()` acepta `source` además de `path`
- Método `readXsd()` ahora es asíncrono

### 3. Actualizaciones en CatalogProcess

- Renombrada de `Catalogs` a `CatalogProcess` para consistencia
- Implementación similar a `CfdiProcess` usando `XSDLoader`
- Ya no extiende de la clase `Process`

## Uso

### Básico

```typescript
import { CfdiProcess, CatalogProcess, XSDLoader } from '@cfdi/schema';

// Cargar desde URL
const cfdiProcessor = CfdiProcess.of();
cfdiProcessor.setConfig({
  source: 'https://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd',
});
const result = await cfdiProcessor.process();

// Cargar desde archivo local
const catalogProcessor = CatalogProcess.of();
catalogProcessor.setConfig({
  source: './path/to/catalog.xsd',
});
const catalogResult = await catalogProcessor.process();
```

### Uso directo de XSDLoader

```typescript
const xsdLoader = XSDLoader.getInstance();

// Cargar un solo archivo
const xsdData = await xsdLoader.loadXSD({
  source: 'https://example.com/schema.xsd',
  timeout: 15000,
});

// Cargar múltiples archivos
const multipleXsd = await xsdLoader.loadMultipleXSD([
  { source: 'https://example.com/schema1.xsd' },
  { source: './local-schema.xsd' },
]);
```

## Compatibilidad hacia atrás

El código existente seguirá funcionando sin cambios:

```typescript
// ✅ Esto sigue funcionando
const processor = CfdiProcess.of();
processor.setConfig({ path: './mi-archivo.xsd' });
```

## Validaciones incluidas

- ✅ Verificación de extensión `.xsd`
- ✅ Validación de contenido XML válido
- ✅ Verificación de esquema XSD (presencia de `xs:schema`)
- ✅ Manejo de timeouts en descargas
- ✅ Verificación de existencia de archivos locales

## Manejo de Errores

La clase proporciona mensajes de error descriptivos:

- `"El archivo debe tener extensión .xsd"`
- `"El archivo no existe: /path/to/file"`
- `"Timeout al descargar el archivo desde URL"`
- `"El archivo no es un esquema XSD válido"`

## Archivos modificados

- ✅ `src/XSDLoader.ts` - Nueva clase principal
- ✅ `src/CfdiProcess.ts` - Actualizado para usar XSDLoader
- ✅ `src/CatalogProcess.ts` - Actualizado y renombrado
- ✅ `src/index.ts` - Exportaciones actualizadas
- ✅ `src/examples/usage-example.ts` - Ejemplos de uso

## Dependencias

No se requieren nuevas dependencias. Utiliza las librerías existentes:

- `xml-js` para parsing XML
- `fs` para archivos locales
- `fetch` (nativo) para URLs

## Migración recomendada

Para aprovechar al máximo las nuevas funcionalidades, considera migrar gradualmente:

1. Reemplaza `path` por `source` en las configuraciones
2. Actualiza `Catalogs` por `CatalogProcess` si lo usas directamente
3. Añade manejo de errores async/await donde sea necesario

## Ejemplos completos

Ver `src/examples/usage-example.ts` para ejemplos detallados de uso y migración.
