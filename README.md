# CFDI - Comprobantes Fiscales Digitales por Internet

Ecosistema completo de paquetes Node.js/TypeScript para la generación, validación, firma y procesamiento de CFDI en México.

## Paquetes

### Core Fiscal

| Paquete                                          | Descripcion                                              |
| ------------------------------------------------ | -------------------------------------------------------- |
| [@cfdi/xml](packages/cfdi/xml)                   | Generacion y sellado de XML CFDI 4.0                     |
| [@cfdi/complementos](packages/cfdi/complementos) | Complementos fiscales (pagos, nomina, carta porte, etc.) |
| [@cfdi/elements](packages/cfdi/elements)         | Elementos estructurales del comprobante                  |
| [@cfdi/types](packages/cfdi/types)               | Definiciones de tipos TypeScript para CFDI               |
| [@cfdi/catalogos](packages/cfdi/catalogos)       | Catalogos del SAT (formas de pago, regimenes, etc.)      |

### Validacion

| Paquete                              | Descripcion                           |
| ------------------------------------ | ------------------------------------- |
| [@cfdi/xsd](packages/cfdi/xsd)       | Validacion XSD con JSON Schema        |
| [@cfdi/schema](packages/cfdi/schema) | Procesamiento de esquemas XSD del SAT |

### Identidades y Certificados

| Paquete                                | Descripcion                                         |
| -------------------------------------- | --------------------------------------------------- |
| [@cfdi/csd](packages/cfdi/csd)         | Manejo de Certificados de Sello Digital (.cer/.key) |
| [@cfdi/csf](packages/cfdi/csf)         | Lectura de Constancia de Situacion Fiscal (PDF)     |
| [@cfdi/rfc](packages/cfdi/rfc)         | Validacion de RFC                                   |
| [@renapo/curp](packages/renapo/curp)   | Validacion y consulta de CURP                       |
| [@sat/auth](packages/sat/auth)         | Autenticacion con webservices del SAT (FIEL)        |
| [@sat/recursos](packages/sat/recursos) | Descarga de recursos XSD/XSLT del SAT               |

### Transformacion

| Paquete                                        | Descripcion                   |
| ---------------------------------------------- | ----------------------------- |
| [@cfdi/2json](packages/cfdi/xml2json)          | Conversion de XML CFDI a JSON |
| [@cfdi/transform](packages/cfdi/transform)     | Transformacion de datos CFDI  |
| [@cfdi/expresiones](packages/cfdi/expresiones) | Expresiones impresas del CFDI |

### PDF

| Paquete                                | Descripcion                                    |
| -------------------------------------- | ---------------------------------------------- |
| [@cfdi/designs](packages/cfdi/designs) | Disenos y plantillas PDF para facturas         |
| [@cfdi/pdf](packages/cfdi/pdf)         | Opciones de generacion PDF                     |
| [@cfdi/utils](packages/cfdi/utils)     | Utilidades (numeros a letras, logos, archivos) |

### CLI Tools

| Paquete                                 | Descripcion                          |
| --------------------------------------- | ------------------------------------ |
| [@clir/openssl](packages/clir/openssl)  | Wrapper de OpenSSL para certificados |
| [@saxon-he/cli](packages/clir/saxon-he) | Wrapper de Saxon-HE para XSLT/XPath  |

## Requisitos del sistema

- **Node.js** >= 22
- **Java JDK** (para Saxon-HE)
- **OpenSSL** (para operaciones con certificados)
- **Saxon-HE** >= 9.9 (para cadena original)

### Instalacion de dependencias del sistema

```bash
# Java JDK
sudo apt install default-jre default-jdk

# OpenSSL
# Debian/Ubuntu
sudo apt-get install openssl
# CentOS/Red Hat
yum install openssl
# macOS
brew install openssl

# Saxon-HE
# Ver: https://github.com/MisaelMa/saxon-he
```

## Inicio rapido

```bash
# Instalar Rush y pnpm
npm install -g @microsoft/rush
npm install -g pnpm

# Clonar e instalar
git clone https://github.com/MisaelMa/cfdi.git
cd cfdi
rush install

# Compilar todos los paquetes
rush build

# Ejecutar tests
rush test:ci
```

## Uso basico

```bash
npm install @cfdi/xml @cfdi/csd
```

```typescript
import { CFDI } from '@cfdi/xml';

const cfdi = new CFDI({ xslt: 'path/to/cadenaoriginal.xslt' });

cfdi.certificar('path/to/certificado.cer');
cfdi.setEmisor({
  Rfc: 'AAA010101AAA',
  Nombre: 'Empresa SA',
  RegimenFiscal: '601',
});
cfdi.setReceptor({
  Rfc: 'XAXX010101000',
  Nombre: 'Publico General',
  UsoCFDI: 'S01',
});
cfdi.addConcepto({
  ClaveProdServ: '01010101',
  Cantidad: '1',
  ClaveUnidad: 'ACT',
  Descripcion: 'Servicio profesional',
  ValorUnitario: '1000.00',
  Importe: '1000.00',
});

await cfdi.sellar('path/to/llave.key', 'password');
const xml = cfdi.getXmlCdfi();
```

## Licencia

[MIT](LICENSE) - Amir Misael Marin Coh
