# CSD

# Generar archivos .pem

Lo primero que se necesita es tener instalada la librería OpenSSL (programa dedicado a la generación y tratado de claves, certificados y keyStore) para poder utilizar los comandos que nos ayudarán a crear las llaves de nuestros sellos digitales.

Linux

```bash
sudo apt-get install openssl
```



```bash
yum install openssl
```

  
Mac

```bash
sudo port install openssl
```



```bash
brew install openssl@1.1
```

Windows  
Descargar libreria: [http://slproweb.com/products/Win32OpenSSL.html](http://slproweb.com/products/Win32OpenSSL.html)

Deberán descargar la versión según su sistema operativo, e instalar



```bash
#si es Windows usar openssl.exe  
openssl pkcs8 -inform DER -in nombrearchivo.key -out nombrearchivo.key.pem -passin pass:contraseña
```



```bash
#si es Windows usar openssl.exe  
openssl x509 -inform DER -outform PEM -in ruta/nombreArchivo.cer -pubkey -out ruta/nombreArchivo.cer.pem
```
