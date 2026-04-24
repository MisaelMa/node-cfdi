# @cfdi/schema - Clean Code Refactored Version

Sistema refactorizado para procesamiento de archivos XSD con arquitectura limpia, reutilización de código y eliminación de duplicaciones.

## 🎯 Características Principales

- ✅ **Carga Universal**: Soporte para URLs y archivos locales
- ✅ **Clean Code**: Eliminación de duplicaciones y centralización de lógica
- ✅ **Arquitectura Modular**: Clases base reutilizables y utilidades comunes
- ✅ **Factory Pattern**: Creación simplificada de procesadores
- ✅ **Constantes Centralizadas**: Sin valores hardcodeados
- ✅ **Interfaces Estandarizadas**: APIs consistentes
- ✅ **Compatibilidad hacia atrás**: Migración gradual sin romper código existente

## 📦 Instalación

```bash
npm install @cfdi/schema
```

## 🚀 Uso Rápido

### Método 1: Factory Pattern (Recomendado)

```typescript
import { processXSD, createCfdiProcessor } from '@cfdi/schema';

// Procesamiento directo desde URL
const cfdiResult = await processXSD(
  'cfdi',
  'https://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd'
);

// Procesamiento directo desde archivo local
const catalogResult = await processXSD('catalog', './path/to/catalog.xsd');

// Con configuración personalizada
const processor = createCfdiProcessor({
  source: 'https://example.com/schema.xsd',
  timeout: 20000,
  encoding: 'utf-8',
});
const result = await processor.process();
```

### Método 2: Uso Tradicional (Compatible)

```typescript
import { CfdiProcess, CatalogProcess } from '@cfdi/schema';

// CFDI desde URL
const cfdiProcessor = CfdiProcess.of();
cfdiProcessor.setConfig({
  source: 'https://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd',
});
const cfdiResult = await cfdiProcessor.process();

// Catálogo desde archivo local
const catalogProcessor = CatalogProcess.of();
catalogProcessor.setConfig({ source: './catalog.xsd' });
const catalogResult = await catalogProcessor.process();
```

### Método 3: XSDLoader Directo

```typescript
import { XSDLoader } from '@cfdi/schema';

const loader = XSDLoader.getInstance();

// Cargar múltiples archivos
const results = await loader.loadMultipleXSD([
  { source: 'https://example.com/schema1.xsd' },
  { source: './local-schema.xsd', timeout: 5000 },
]);
```

## 🏗️ Arquitectura

### Estructura Modular

```
src/
├── common/                    # Código común y reutilizable
│   ├── constants.ts          # Constantes centralizadas
│   ├── interfaces.ts         # Interfaces estandarizadas
│   ├── xml-utils.ts          # Utilidades XML reutilizables
│   ├── base-processor.ts     # Clase base abstracta
│   └── processor-factory.ts  # Factory pattern
├── cfdi.xsd.ts              # Procesador CFDI refactorizado
├── catalogos.xsd.ts         # Procesador catálogos refactorizado
├── loader.xsd.ts            # Cargador XSD universal
└── index.ts                 # Exportaciones principales
```

### Principios Aplicados

1. **DRY (Don't Repeat Yourself)**: Eliminación de código duplicado
2. **Single Responsibility**: Cada clase tiene una responsabilidad específica
3. **Open/Closed**: Extensible sin modificar código existente
4. **Dependency Inversion**: Dependencias inyectadas, no hardcodeadas
5. **Factory Pattern**: Creación centralizada de objetos

## 🔧 APIs Principales

### ProcessorFactory

```typescript
import { ProcessorFactory } from '@cfdi/schema';

// Crear procesador CFDI
const cfdiProcessor = ProcessorFactory.createCfdiProcessor({
  source: 'https://example.com/cfdi.xsd',
});

// Crear procesador de catálogos
const catalogProcessor = ProcessorFactory.createCatalogProcessor({
  source: './catalog.xsd',
});

// Procesamiento directo
const result = await ProcessorFactory.processXSD(
  'cfdi',
  'https://example.com/schema.xsd'
);
```

### XMLUtils (Utilidades Reutilizables)

```typescript
import { XMLUtils } from '@cfdi/schema';

// Convertir a XSD con formato estándar
const xsdString = XMLUtils.toXsd(elementCompact);

// Crear esquema base con namespaces
const schemaBase = XMLUtils.createSchemaBase({
  targetNamespace: 'custom-namespace',
});

// Limpiar anotaciones
XMLUtils.removeAnnotations(element);

// Verificar elementos de solo atributos
const isOnlyAttr = XMLUtils.isOnlyAttribute(element);
```

### Constantes Centralizadas

```typescript
import { XSD_CONSTANTS } from '@cfdi/schema';

// Usar configuraciones predefinidas
const timeout = XSD_CONSTANTS.DEFAULT_TIMEOUT;
const encoding = XSD_CONSTANTS.DEFAULT_ENCODING;
const namespaces = XSD_CONSTANTS.NAMESPACES;
const outputOptions = XSD_CONSTANTS.OUTPUT_OPTIONS;
```

## 🔄 Migración desde Versión Anterior

### Código Anterior

```typescript
// ❌ Versión anterior con duplicaciones
const cfdiProcessor = CfdiProcess.of();
cfdiProcessor.setConfig({ path: './schema.xsd' });
const result = await cfdiProcessor.process();
```

### Código Refactorizado

```typescript
// ✅ Versión refactorizada (compatible)
const cfdiProcessor = CfdiProcess.of();
cfdiProcessor.setConfig({ source: './schema.xsd' }); // 'path' también funciona
const result = await cfdiProcessor.process();

// ✅ O mejor aún, usar factory
const result = await processXSD('cfdi', './schema.xsd');
```

## 🎨 Personalización Avanzada

### Extender BaseXSDProcessor

```typescript
import { BaseXSDProcessor, ProcessorConfig } from '@cfdi/schema';

class CustomProcessor extends BaseXSDProcessor {
  private static instance: CustomProcessor;

  static of(): CustomProcessor {
    if (!CustomProcessor.instance) {
      CustomProcessor.instance = new CustomProcessor();
    }
    return CustomProcessor.instance;
  }

  async process(): Promise<any> {
    this.validateConfig();
    const xsd = await this.readXsd();
    // Lógica personalizada
    return this.customProcessing(xsd);
  }

  private customProcessing(xsd: any): any {
    // Implementación específica
  }
}
```

### Configuración de XMLUtils

```typescript
import { XMLUtils, XSD_CONSTANTS } from '@cfdi/schema';

// Crear esquema con configuración personalizada
const customSchema = XMLUtils.createSchemaBase({
  namespaces: {
    'xmlns:custom': 'http://custom.namespace.com',
  },
  targetNamespace: 'http://custom.namespace.com',
  imports: [
    {
      namespace: 'http://custom.namespace.com',
      schemaLocation: 'http://custom.namespace.com/schema.xsd',
    },
  ],
});
```

## 🛠️ Configuración Avanzada

### Opciones de LoaderOptions

```typescript
interface LoaderOptions {
  source: string; // URL o ruta local
  encoding?: BufferEncoding; // Codificación (default: 'utf-8')
  timeout?: number; // Timeout para URLs (default: 15000ms)
}
```

### Opciones de ProcessorConfig

```typescript
interface ProcessorConfig {
  source?: string; // URL o ruta (recomendado)
  path?: string; // Compatibilidad hacia atrás
  encoding?: BufferEncoding;
  timeout?: number;
}
```

## 📊 Ventajas del Refactoring

| Aspecto           | Antes                                 | Después                            |
| ----------------- | ------------------------------------- | ---------------------------------- |
| **Duplicación**   | Métodos repetidos en múltiples clases | Lógica centralizada en clases base |
| **Configuración** | Hardcoded en cada clase               | Constantes centralizadas           |
| **Creación**      | Singleton manual por clase            | Factory pattern unificado          |
| **Reutilización** | Código copiado                        | Utilidades compartidas             |
| **Mantenimiento** | Cambios en múltiples lugares          | Single point of change             |
| **Testing**       | Tests duplicados                      | Tests centralizados                |

## 🔍 Debugging y Logging

El sistema incluye logging automático para facilitar el debugging:

```typescript
// Logs automáticos incluidos:
// - "Descargando XSD desde URL: [url]"
// - "Cargando XSD desde archivo local: [path]"
// - "XSD cargado exitosamente desde: [source]"
```

## 📋 Ejemplos Completos

Ver `/examples/` para ejemplos detallados de uso y migración.

## 🤝 Contribución

Al contribuir, asegúrate de seguir los principios de clean code implementados:

1. No duplicar lógica existente
2. Usar constantes centralizadas
3. Extender clases base cuando sea apropiado
4. Mantener compatibilidad hacia atrás
5. Añadir tests para nueva funcionalidad

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
