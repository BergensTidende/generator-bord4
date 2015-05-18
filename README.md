# generator-bord4
```bash
 __  __  ______       _______   ______   ______    ______   __   __       
/_/\/_/\/_____/\    / _______/\/___ __/\/___ __/\ /___ __/\/__/ \/__/\     
\ \ \ \ \:::_ \ \   \ ::: _  \ \::: _ \ \::: _ \ \\::: _ \ \  \  \: \ \__  
 \:\_\ \ \:\ \ \ \    \::(_)  \/\:\  \ \ \:( _) ) )\:\  \ \ \:: \_\::\/_/\ 
  \::::_\/\:\ \ \ \    \::  _  \ \: \ \ \ \:  __  \ \: \ \ \ \_ :::   __\/ 
    \::\ \ \:\_\ \ \    \::(_)  \ \ :\_\ \ \  \  \ \ \ :\/.:| |    \::\ \  
     \__\/  \_____\/     \_______\/ \_____\/ \_\/ \_\/ \____/_/     \__\/  
                                                                           
```
## Hva er det?
Generator-bord4 er en yeoman generator for å sette opp grunnmuren til nye apper.

## Hva må på plass for å bruke den?
* [nodejs] - Nodejs må være innstalert
* [yeoman] - Yeoman må være installert ```npm install -g yo ```
* [Github ssh] - Maskinen din må være autentisert hos Github.

## Installere generatoren
Klon [generator-bord4] til maskinen din, enten ved hjelp av et GUI eller via terminal

```bash
git clone git@github.com:BergensTidende/generator-bord4.git
```

Fyr opp en terminal, cd deg inn generator-katalogen.
```bash
cd /path/to/generator-bord4
```
Innstaller nødvendige node moduler
```bash
npm install
```
Link generatoren opp slik at den kan brukes.

```bash
npm link
```

## Bruke generatoren
### Main
Lag en folder hvor appen din skal bo, cd inn i den

```bash
mkdir folder_til_app && cd $_
```
Kjør generatoren

```bash
yo bord4
```
### Conf
Conf lager dev.json i config/enviroments

```bash
yo bord4:conf
```

## Oppdatere generatoren
Sync repoet og kjør ```npm install ```

## Dette gjør generatoren

* Først sjekker den om den kjøres fra apps/workspace. Da vil den feile
* Vil og feile om den finner en Gruntfile.js i katalogen den kjøres fra
* Den trenger Github tilgang, sjekker om passordet er korrekt
* Den har en lokal kopi av app templaten. Er den foreldet oppdateres den
* Den kjenner igjen daily graphics folderen og velger automatisk minitemplate og fjerner valget om å lage repo
* Hvis ikke daily graphics får du velge mini eller mega app
* Velger du mini app må du velge template. Mega har bare en.
* Så kopierer den først inn app-katalogen fra app template
* Så vanilla
* Om det er valgt å bruke en annen template enn vanilla kopieres denne nå inn
* bower-filen bygges
* git repo lages og det pushes til github om det er valgt
* så npm og bower install
* til slutt grunt copy:cssAsScss og grunt serve

## Kjente feil
### npm vil bare kjøre som sudo
```bash
sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` /usr/local
```
### Generatoren finner ikke app-template
Om man sletter app-template folderen under generator-bord4 ved en inkurie vil generatoren feile.
Men det finnes håp. I generatoren ligger en fil som heter .bord4config. Dette er en json-fil som holder orden på enkle settings. Parameteret "appTemplate" holder orden på hvilken versjon av app-templaten generatoren har. Slett denne og generatoren vil laste ned app-template på nytt.

### generatoren kræsjer
Kjeft på Lasse

[nodejs]: http://nodejs.org
[yeoman]: http://yeoman.io
[Github ssh]: https://help.github.com/articles/generating-ssh-keys
[generator-bord4]: https://github.com/BergensTidende/generator-bord4/
