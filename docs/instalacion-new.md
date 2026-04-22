# Instalacion

## Requisitos

A partir de la version actual, `@cfdi/xml` y `@cfdi/csd` trabajan los certificados del SAT de forma nativa en Node.js usando `node-forge`. Ya **no se requiere** instalar OpenSSL, OpenJDK ni Saxon-HE en el sistema.

## Certificados soportados

El paquete acepta los archivos del CSD del SAT en los siguientes formatos:

| Formato | Soporte | Recomendado |
| ------- | ------- | ----------- |
| `.pem`  | Si      | Si          |
| `.cer`  | Si      | No          |
| `.key`  | Si      | No          |

### Recomendacion: usar `.pem`

Se recomienda convertir el par `.cer` + `.key` del SAT a formato `.pem` una sola vez y trabajar con los `.pem` en tu aplicacion:

- Es el formato nativo que espera `node-forge`, evita conversiones en cada firma.
- Es texto plano base64, mas facil de inspeccionar y versionar en bovedas seguras.
- Desacopla tu codigo del formato binario DER de los archivos originales del SAT.

Si prefieres cargar directamente los `.cer` y `.key`, tambien es soportado: el paquete realiza la conversion internamente.

## Instalacion

```bash
npm i --save @cfdi/xml
```

Si vas a usar complementos:

```bash
npm i --save @cfdi/complementos
```

## Compatibilidad con el flujo anterior (Saxon)

El manejo de certificados (`.cer`/`.key` → `.pem`, firma SHA-256) ahora es 100% nativo con `node-forge`, asi que **OpenSSL ya no es necesario en ningun flujo**.

Lo unico que se mantiene opcional es **Saxon-HE + OpenJDK**, que en versiones anteriores se usaba para generar la cadena original aplicando el XSLT oficial del SAT.

Mantenemos soporte a ese flujo por las siguientes razones:

- Proyectos existentes que ya tienen Saxon integrado en su pipeline de CI/CD.
- Casos donde se requiere reproducir exactamente la salida del XSLT oficial del SAT para auditoria.

El paquete `@cfdi/transform` genera la cadena original de forma nativa, pero sigue existiendo el wrapper `@cfdi/saxon-he` en `packages/clir/` para quienes necesiten el comportamiento anterior.

### Instalacion opcional de Saxon-HE

Solo si necesitas el flujo anterior:

#### Linux

```bash
# Debian/Ubuntu:
sudo apt install default-jre default-jdk

# Archlinux
sudo pacman -S jre-openjdk-headless jre-openjdk jdk-openjdk

# Instalacion automatica
git clone https://github.com/MisaelMa/saxon-he
sudo chmod a+x ./saxon-he.sh
sudo ./saxon-he.sh
```

#### MacOS

```bash
brew reinstall saxon
# Busca la ruta de instalacion, por ejemplo:
# /usr/local/Cellar/saxon/12.5
# /opt/homebrew/Cellar/saxon/12.5

sudo ln -s /usr/local/Cellar/saxon/12.5/bin/saxon /usr/local/bin/transform
```
