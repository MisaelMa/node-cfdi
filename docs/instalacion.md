# Instalacion

# Instalacion

## OpenSSL

Requerido para generar archivos `.pem` a partir de los certificados del SAT.

### Linux

```bash
# Debian/Ubuntu:
sudo apt-get install openssl
# CentOS, Red Hat:
yum install openssl
# Archlinux:
sudo pacman -S openssl
```

### MacOs

```bash
brew install openssl@1.1
```

### Windows

Instalar [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)  
c:\OpenSSL-Win32\bin\openssl.exe O c:\OpenSSL-Win64\bin\openssl.exe  
Solo necesita agregar la ruta del bin OpenSSL
(ej: C:\Archivos de programa\OpenSSL-Win64\bin)
a la variable del sistema PATH.

## Saxon (Opcional)

> **Nota:** Saxon ya no es requerido. El paquete `@cfdi/transform` genera la cadena original de forma nativa en Node.js sin dependencias de Java. Solo instala Saxon si necesitas compatibilidad con el flujo anterior.

Si aun deseas usar Saxon:

### Linux

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

### Mac Os

```bash
brew reinstall saxon
# Busca la ruta de instalacion
# /usr/local/Cellar/saxon/12.5: 16 files, 6.6MB
# o
# /opt/homebrew/Cellar/saxon/12.5

sudo ln -s /usr/local/Cellar/saxon/12.5/bin/saxon /usr/local/bin/transform
```

## npm

```bash
npm i --save @cfdi/xml
```

Si vas a ocupar complementos:

```bash
npm i --save @cfdi/complementos
```
