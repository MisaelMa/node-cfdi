# instalacion

# Instalacion PHP 2

## JDK

Linux```bash
# Manjaro Install OpenJDK 14  
sudo pacman -S jre-openjdk-headless jre-openjdk jdk-openjdk openjdk-doc openjdk-src  
  
#Ubuntu  
sudo apt install default-jre  
sudo apt install default-jdk  
      
```

## OpenSSL

### Linux

```bash
# Debian/Ubuntu:   
sudo apt-get install openssl  
# CentOS, Red Hat:   
yum install openssl  
# Archlinux:   
sudo pacman -S openssl      
```

###   
MacOs

```bash
brew install openssl@1.1
```

### Windows

Instalar [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)  
c:\OpenSSL-Win32\bin\openssl.exe O c:\OpenSSL-Win64\bin\openssl.exe  
Solo necesita agregar la ruta del bin OpenSSL   
(ej: C:\Archivos de programa\OpenSSL-Win64\bin)  
a la variable del sistema PATH como se muestra a continuación:  
![](https://ik.imagekit.io/gky5zgkgy/article/amir_pJAFU9edC)

## Saxon

Actualmente se puede omitir la instalacion de saxon, esta version del paquete contiene [**xslt3**](https://www.npmjs.com/package/xslt3)** **que permite generar el sello de forma mas sencilla pero con una perdida minima de tiempo. [consulte la siguiente seccion](https://cfdi.recreando.dev/es/empezando), ### Linux

```bash
# Debian/Ubuntu:   
sudo apt install unzip  
# Archlinux   
sudo pacman -S unzip  
  
official: http://saxon.sourceforge.net/  
Archlinux:  https://aur.archlinux.org/packages/saxon-he  
  
Automatic Installation Alternative  
git clone https://github.com/MisaelMa/saxon-he  
sudo  chmod a+x ./saxon-he.sh  
sudo ./saxon-he.sh  
  
███████╗ █████╗ ██╗  ██╗ ██████╗ ███╗   ██╗    ██╗  ██╗███████╗  
██╔════╝██╔══██╗╚██╗██╔╝██╔═══██╗████╗  ██║    ██║  ██║██╔════╝  
███████╗███████║ ╚███╔╝ ██║   ██║██╔██╗ ██║    ███████║█████╗  
╚════██║██╔══██║ ██╔██╗ ██║   ██║██║╚██╗██║    ██╔══██║██╔══╝  
███████║██║  ██║██╔╝ ██╗╚██████╔╝██║ ╚████║    ██║  ██║███████╗  
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝  
    
```

### Mac Os

```bash
brew reinstall saxon  
# Busca la ruta de instacion  
# /usr/local/Cellar/saxon/12.5: 16 files, 6.6MB      
# o   
# /opt/homebrew/Cellar/saxon/12.5
```

![](https://ik.imagekit.io/gky5zgkgy/article/amir_qXGlQErPo)

```bash
sudo ln -s /usr/local/Cellar/saxon/11.3/bin/saxon /usr/local/bin/transform            
```

###   
Windows

## npm

```bash
npm i --save @cfdi/xml
```

Si vas a ocupar complementos```bash
npm i --save @cfdi/complementos
```
