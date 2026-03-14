# Agentes del Proyecto CFDI

Guia para invocar agentes especializados durante el desarrollo.

## Equipo disponible

| Agente | Archivo | Rol | Modelo |
|--------|---------|-----|--------|
| `cfdi-developer` | `cfdi-developer.md` | Desarrollador de facturacion mexicana | sonnet |
| `pdf-developer` | `pdf-developer.md` | Desarrollador de PDF y plantillas | sonnet |
| `code-reviewer` | `code-reviewer.md` | Revisor de codigo y seguridad | sonnet |
| `test-runner` | `test-runner.md` | Ejecutor de tests | haiku |

## Uso basico (un agente)

Desde Claude Code, invoca un agente con lenguaje natural:

```
Usa el cfdi-developer para agregar soporte del complemento de nomina 1.2
```

```
Usa el code-reviewer para revisar los cambios del branch actual
```

```
Usa el pdf-developer para crear un nuevo diseño de factura con carta porte
```

```
Usa el test-runner para verificar que todo pase
```

## Uso multi-agente (desarrollo de features)

### Flujo recomendado para un feature nuevo

**Paso 1: Implementacion**
```
Usa el cfdi-developer para implementar [feature]
```

**Paso 2: Tests**
```
Usa el test-runner para verificar que los tests pasen
```

**Paso 3: Revision**
```
Usa el code-reviewer para revisar los cambios
```

### Trabajo en paralelo (multiples terminales)

Abre varias terminales con worktrees aislados para que cada agente trabaje sin conflictos:

```bash
# Terminal 1 - Desarrollo CFDI
claude --worktree feature-nomina
> Usa el cfdi-developer para implementar el complemento de nomina 1.2

# Terminal 2 - Desarrollo PDF (en paralelo)
claude --worktree feature-pdf-nomina
> Usa el pdf-developer para crear la plantilla PDF de nomina

# Terminal 3 - Revision continua
claude --worktree review
> Usa el code-reviewer para revisar los cambios en el branch feature-nomina
```

### Orquestar agentes en una sola sesion

Puedes pedir que se ejecuten agentes en secuencia o en paralelo dentro de una misma sesion:

```
Necesito implementar el complemento de pagos 2.0:

1. Primero usa el cfdi-developer para crear la estructura XML del complemento
2. Luego usa el pdf-developer para agregar el diseño PDF del complemento de pagos
3. Despues usa el test-runner para verificar que todo compile y pase
4. Finalmente usa el code-reviewer para revisar todo
```

O en paralelo:

```
En paralelo:
- Usa el cfdi-developer para implementar la validacion de carta porte 3.1
- Usa el pdf-developer para crear el diseño PDF de carta porte
Cuando ambos terminen, usa el test-runner para validar
```

## Ejemplos por tipo de tarea

### Nuevo complemento fiscal

```
Usa el cfdi-developer para:
1. Crear la clase del complemento en packages/cfdi/complementos/
2. Agregar los tipos en packages/cfdi/types/
3. Agregar el elemento en packages/cfdi/elements/
4. Actualizar los exports en cada index.ts
5. Crear tests basicos
```

### Corregir bug en XML

```
Usa el cfdi-developer para investigar y corregir el bug:
[descripcion del bug]

Despues usa el test-runner para verificar que no se rompio nada
```

### Nuevo diseño de factura PDF

```
Usa el pdf-developer para crear un nuevo diseño de factura:
- Nombre: PDF224
- Estilo: moderno con tabla de conceptos compacta
- Debe incluir: logo, QR, desglose de impuestos, total en letras
```

### Code review antes de merge

```
Usa el code-reviewer para revisar todos los cambios del branch actual
comparados con main. Enfocate en:
- Seguridad en manejo de certificados
- Compliance con esquema CFDI 4.0
- Cobertura de tests
```

### Validar CI completo

```
Usa el test-runner para:
1. Correr rush test:ci
2. Si hay fallos, reportar que paquete fallo y por que
3. Sugerir la solucion
```

## Reglas automaticas

Las reglas en `.claude/rules/` se cargan automaticamente segun los archivos que se esten editando:

| Regla | Se activa cuando editas |
|-------|------------------------|
| `cfdi-domain.md` | `packages/cfdi/**/*.ts` |
| `coding-standards.md` | Cualquier `.ts` o `.tsx` |
| `testing.md` | Archivos `*.test.ts`, `*.spec.ts` |
| `security.md` | Archivos de certificados, llaves, openssl |

No necesitas invocarlas manualmente, se aplican solas.
