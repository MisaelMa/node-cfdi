# Requisitos

Dependencias externas del sistema necesarias para trabajar con CFDI.

## Node.js

- **Node.js** >= 22
- **npm** o **pnpm**

## OpenSSL

Requerido para generar los archivos `.pem` a partir de los certificados del SAT (`.cer` y `.key`).

### Linux

```bash
# Debian/Ubuntu:
sudo apt-get install openssl
# CentOS, Red Hat:
yum install openssl
# Archlinux:
sudo pacman -S openssl
```

### MacOS

```bash
brew install openssl@1.1
```

### Windows

Instalar desde [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html).

Agregar la ruta del `bin` de OpenSSL (ej. `C:\Archivos de programa\OpenSSL-Win64\bin`) a la variable de entorno `PATH`.

Ver [generar-pem.md](./generar-pem.md) para el procedimiento completo.

## Saxon-HE + Java (opcional)

Saxon-HE **ya no es requerido**: la cadena original se genera de forma nativa en Node.js. Solo instalalo si quieres seguir usando el flujo anterior con el XSLT oficial del SAT (por ejemplo, para pipelines de CI/CD ya integrados o auditorias que requieren paridad exacta con la salida oficial).

Requiere Java JDK (`>= 11`) y Saxon-HE (`>= 9.9`).

### Linux

```bash
# Debian/Ubuntu:
sudo apt install default-jre default-jdk

# Archlinux
sudo pacman -S jre-openjdk-headless jre-openjdk jdk-openjdk

# Instalacion automatica de Saxon-HE
git clone https://github.com/MisaelMa/saxon-he
sudo chmod a+x ./saxon-he.sh
sudo ./saxon-he.sh
```

### MacOS

```bash
brew reinstall saxon
# Busca la ruta de instalacion, por ejemplo:
# /usr/local/Cellar/saxon/12.5
# /opt/homebrew/Cellar/saxon/12.5

sudo ln -s /usr/local/Cellar/saxon/12.5/bin/saxon /usr/local/bin/transform
```
