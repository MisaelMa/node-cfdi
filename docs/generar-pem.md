# Generar archivos `.pem`

## Que son los certificados

Para emitir un CFDI necesitas un **Certificado de Sello Digital (CSD)** emitido por el SAT. El CSD esta compuesto por dos archivos:

- **`.cer`**: certificado publico en formato DER. Contiene la llave publica, el RFC del contribuyente, el numero de certificado y la vigencia.
- **`.key`**: llave privada en formato DER (PKCS#8) cifrada con una contrasena que tu definiste al tramitarlo.

## Donde se obtienen

- **CSD**: se genera desde el portal del SAT con la aplicacion **Certifica** ([https://portalsat.plataforma.sat.gob.mx/certifica/](https://portalsat.plataforma.sat.gob.mx/certifica/)) y se tramita en **Certisat Web** con tu e.firma. Es el certificado que debes usar para firmar CFDI.
- **e.firma (FIEL)**: se obtiene en oficinas del SAT con cita. Sirve para tramites y para autenticarse contra los webservices del SAT (descarga masiva, etc.), **no para sellar CFDI**.

## Para que necesitamos los `.pem`

El SAT entrega `.cer` y `.key` en formato binario DER. El formato `.pem` es la misma informacion pero codificada en base64 con cabeceras de texto (`-----BEGIN ... -----`).

Aunque el paquete **acepta directamente `.cer` y `.key`** (los convierte en memoria), recomendamos generar los `.pem` una sola vez y trabajar con ellos porque:

- Son texto plano, faciles de inspeccionar, diffear y versionar en bovedas seguras (Vault, AWS Secrets Manager, etc.).
- Evitas manejar la contrasena del `.key` en cada firma: el `.pem` puede persistirse ya descifrado.
- Es el formato estandar que esperan la mayoria de librerias criptograficas.

## Requisitos

Necesitas tener instalado **OpenSSL**. Consulta [requisitos.md](./requisitos.md) para las instrucciones de instalacion por sistema operativo.

## Comandos

En Windows usa `openssl.exe` en lugar de `openssl`.

```bash
# .key (DER cifrado) → .pem
openssl pkcs8 -inform DER -in nombrearchivo.key -out nombrearchivo.key.pem -passin pass:contrasena

# .cer (DER) → .pem
openssl x509 -inform DER -outform PEM -in ruta/nombreArchivo.cer -pubkey -out ruta/nombreArchivo.cer.pem
```
