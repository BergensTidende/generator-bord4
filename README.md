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
* [nodejs] - Nodejs må være installert
* [yeoman] - Yeoman må være installert ```npm install -g yo ```
* [Github ssh] - Maskinen din må være autentisert hos Github.
* Den trenger tre repository:
    - [App-template]: For store selvstendige apper. (Kan bruke bord4s app-template, les dokumentasjonen før bruk)
    - [Daily-template]: For små hverdagsapper som inkluderes som iframe. (Kan bruke bord4s daily template, les dokumentasjonen før bruk)
    - Daily-storage: Arkiv for hverdagsapper. (Må opprettes selv. Generatoren forutsetter at den finnes en projects mappe på roten.)

## Installere generatoren
Klon [generator-bord4] til maskinen din, enten ved hjelp av et GUI eller via terminal
```bash
git clone git@github.com:BergensTidende/generator-bord4.git
```

Start et terminalvindu, cd deg inn generator-katalogen.
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

Skift katalog til den du ønsker å bruke som rot for prosjektene dine
```bash
cd /path/to/prosjektkatalog
```

Første gang du skal bruke generatoren må du sette opp variabler og klone nødvendige repository
```bash
yo bord4:setup
```
## Bruke generatoren
### Main

Kjør generatoren fra rotkatalogen til generatorprosjektene dine
```bash
yo bord4
```

## Oppdatere generatoren
Sync repoet og kjør ```npm install ```

## Dette gjør generatoren

* Først sjekker den om den kjøres fra prosjektkatalogen som ble oppgitt under setup. Hvis ikke feiler den.
* For å være sikker dobbelsjekker den om den finner en Gruntfile.js i katalogen den kjøres fra. Det vil bety at den kjøres fra katalog hvor det allerede bor en app. Generatoren vil da avslutte.
* Sjekker om alle nødvendige variabler er satt. Feiler hvis ikke.
* Sjekker om den har nødvendige repoer. Feiler hvis ikke.
* Om alt er på plass oppdaterer den de tre repoene den trenger.
* Først får du valget om hvilken type app du vil lage: Fullt rigg eller Daily Graphic
* Er det Daily graphic ber den deg velge hvilken undertype du ønsker
* Så spør generator etter navn. Finner den at navnet allerede er i brukt vil den be deg om velge et anent navn.
* Den oppretter så appens mappe. For Daily Graphics plasseres appen i PROSJEKTMAPPE/daily-graphics-storage/projects/ÅR/MND/NAVN. Fullt rigg plasseres i PROSJEKTMAPPE/NAVN
* Flytter seg inn i appens katalog
* Kopierer så de nødvendige filene fra apptypens repository.
* Kjører npm install
* Om det er Daily Graphics kjører den ```bash grunt workon:[map|graphic|vanilla]```
* Kjører bower install
* Oppretter project.json som inneholder informasjon om appen
* Avslutter med grunt:serve

## Kjente feil
### npm vil bare kjøre som sudo
```bash
sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` /usr/local
```

###grunt feiler under bygging pga css filer
En del bower komponenter kommer ikke med scss-filer. Det kan føre til at grunt feiler under bygging. Skjer dette kan du kjøre ```bash grunt copy:cssAsScss``` for å gjøre css-filene om til Scss.

### generatoren kræsjer og det finnes ikke håp
Opprett issue eller send epost til utvikling@bt.no

[nodejs]: http://nodejs.org
[yeoman]: http://yeoman.io
[App-template]: https://github.com/BergensTidende/bord4-app-template
[Daily-template]: https://github.com/BergensTidende/bord4-daily-template
[Github ssh]: https://help.github.com/articles/generating-ssh-keys
[generator-bord4]: https://github.com/BergensTidende/generator-bord4/
