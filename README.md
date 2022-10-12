## Installation

```
gh extension install crguezl/gh-org-members
```

It is convenient to have [fzf](https://github.com/junegunn/fzf) installed.

## Help

```
✗ gh org-members                                                       
Usage: gh org-members [options] [organization]

Options:
  -V, --version             output the version number
  -f, --fullname            show name of the user (if available)
  -j, --json                returns the full json object
  -r, --regexp <regexp>     Only members with some field matching <regexp> will be shown
  -u, --url                 show github user url
  -l, --login               show github user login
  -w, --orgurl              show github user url as a member of the org
  -s, --site                show url of the members github pages web sites
  -c, --csv [field...]      shows the values of the fields of the organization csv
  -p, --pathcsv <csv file>  path to the csv file
  -o --org <org>            default organization
     --default              Set selected "org" as default organization for future uses
  -h, --help                display help for command

  - If the organization is not explicitly specified or there is a default org, 
    the selection will be done interactively among the list of your organizations using 'fzf'
  - You can set the default organization through the "--default" option for future uses of this program
  - When in 'fzf', use CTRL-A to select all, tab to select/deselect
  - You can merge the results of the GitHub API info with info from info in a '.csv' file using the "-c" and "-p" options. For instance: "gh org-members -jr sara -c -p ./ULL-MFP-AET-2122.csv"
  - If the option '-c' is used but the '.csv' file is not specified via the '-p' option, it will use the most recent '*.csv' file in your 'Downloads' folder mathching the regular expression pattern '/<org>.*.csv/' where 'org' refers to the specified or default organization  
  - When using '-c' it can be followed by any list of field names in the '.csv' file. 
  - The '.csv' file has to have a column named 'login' having the Github login of the members
```

## Simple Examples

Using several options together and getting info about users matching `cas`:

```
➜  gh-org-members git:(main) gh org-members -fusr cas                 
"Casiano Rodriguez-Leon","https://github.com/crguezl","https://crguezl.github.io"
"Casiano","https://github.com/casiano","https://casiano.github.io"
```

The same but the output is in json:

```json
✗ gh org-members -jr cas   
[
  {
    "login": "crguezl",
    "name": "Casiano Rodriguez-Leon",
    "url": "https://github.com/crguezl",
    "role": "admin",
    "site": "https://crguezl.github.io",
    "orgurl": "https://github.com/orgs/ULL-MFP-AET-2122/people/crguezl",
    "fullname": "Casiano Rodriguez-Leon"
  },
  {
    "login": "casiano",
    "name": "Casiano",
    "url": "https://github.com/casiano",
    "role": "member",
    "site": "https://casiano.github.io",
    "orgurl": "https://github.com/orgs/ULL-MFP-AET-2122/people/casiano",
    "fullname": "Casiano"
  }
]
```

## Adding info from a Spreadsheet 

Getting not only GitHub API info but also info (option `-c`) from a specified `.csv` file (option `-p`). 

⚠️ **The `.csv`file has to have a column `.login` with the GitHub logins of the members**. 

Here we search for student entries matching `sara`:

```json
✗ gh org-members -jr sara -c -p ./ULL-MFP-AET-2122.csv
[
  {
    "login": "Alex100260076",
    "name": "Alejandro Glez. Sarasola",
    "url": "https://github.com/Alex100260076",
    "role": "member",
    "site": "https://Alex100260076.github.io",
    "orgurl": "https://github.com/orgs/ULL-MFP-AET-2122/people/Alex100260076",
    "fullname": "Alejandro Glez. Sarasola",
    "id": "alu0100260076",
    "orden": "8",
    "Marca temporal": "26/10/2021 18:16:30",
    "Nombre 1": "Alejandro",
    "Apellidos": "González Sarasola",
    "Nombre": "Alejandro",
    "Primer Apellido": "González",
    "Segundo Apellido": "Sarasola",
    "Grado desde el que accede": "Ingeniería industrial",
    "Experiencia previa en la Enseñanza": "2",
    "markdown": "APTO",
    "profile": "APTO",
    "web site": "APTO",
    "pandoc": "APTO+",
    "TFP DCP": "APTO",
    "Calculada": "8,8",
    "Calificador Propuesta": "9",
    "Calificador propuesta": ""
  }
]
```

If the option `-c` is used, but the `.csv` file is not specified via the `-p` option, it will use the most recent 
`*.csv` file in your `Downloads` folder matching the regular expression pattern `/${org}.*\.csv/` where `org` refers to the specified or default
organization:

```
✗ ls -ltr ~/Downloads/ULL-MFP-AET-2122*                   
-rw-r--r--@ 1 casianorodriguezleon  staff  3537 20 jul 10:40 /Users/casianorodriguezleon/Downloads/ULL-MFP-AET-2122 - Evaluacion.csv
```

In this example, we don't specify the `.csv` file and it will use the file `/Users/casianorodriguezleon/Downloads/ULL-MFP-AET-2122 - Evaluacion.csv`:

```json
✗ gh org-members -jr sara -c   
[
  {
    "login": "Alex100260076",
    "name": "Alejandro Glez. Sarasola",
    "url": "https://github.com/Alex100260076",
    "role": "member",
    "site": "https://Alex100260076.github.io",
    "orgurl": "https://github.com/orgs/ULL-MFP-AET-2122/people/Alex100260076",
    "fullname": "Alejandro Glez. Sarasola",
    "id": "alu0100260076",
    "orden": "8",
    "Marca temporal": "26/10/2021 18:16:30",
    "Nombre 1": "Alejandro",
    "Apellidos": "González Sarasola",
    "Nombre": "Alejandro",
    "Primer Apellido": "González",
    "Segundo Apellido": "Sarasola",
    "Grado desde el que accede": "Ingeniería industrial",
    "Experiencia previa en la Enseñanza": "2",
    "markdown": "APTO",
    "profile": "APTO",
    "web site": "APTO",
    "pandoc": "APTO+",
    "TFP DCP": "APTO",
    "Calculada": "8,8",
    "Calificador Propuesta": "9",
    "Calificador propuesta": ""
  }
]
```

When using `-c` it can be followed by any list of field names in the `.csv` file. 
for instance:

```
✗ gh org-members -r sara -c  Apellidos 'Grado desde el que accede'
"González Sarasola","Ingeniería industrial"
```

Here is an example that give us the marks for a given exercise (the `markdown` exercise):

```
✗ gh org-members  -c Apellidos markdown -l | egrep -v 'casiano|crguezl' |  sort -f | cat -n
     1  "BOISTEL PÉREZ","APTO","ChloeBoistel"
     2  "CABRERA GARCIA","APTO","Juacabga87"
     3  "COELLO PÉREZ","APTO","AnabelCP"
     4  "EXPÓSITO GARCÍA","APTO","alu0100951844"
     5  "GARCÍA BULLEJOS","APTO","Jaimetaks"
     6  "GONZALEZ AGUIAR","APTO","ivan-ga"
     7  "GONZÁLEZ GONZÁLEZ","APTO","alu0100879902"
     8  "González López","APTO","alu0100108859"
     9  "González Maury","APTO","AdelaGM"
    10  "González Sarasola","APTO","Alex100260076"
    11  "GUERRA OLIVERA","APTO","CGuerra2021"
    12  "ManCurTru"
    13  "Marrero Díaz","APTO+","amarrerod"
    14  "PRIETO CURBELO","APTO","alu0100948387"
    15  "RAMALLO BENÍTEZ","APTO","Ramallin"
    16  "RODRIGUEZ HERNANDEZ","APTO","NoeliaRguezHdez"
    17  "Van Hoye","APTO","magodelnorte"
```

There will be error messages for entries in the spreadsheet file that do not have a login in the GitHub organization:

```
Spreadsheet entry:
"{"orden":"1","Marca temporal":"29/10/2021 0:24:32","Nombre 1":"MANUEL","Apellidos":"CURBELO TRUJILLO","Nombre":"Manuel","Primer Apellido":"Curbelo","Segundo Apellido":"Trujillo","id":"alu0100045130","login":"mancurtru","Grado desde el que accede":"Tecnologías Marinas","Experiencia previa en la Enseñanza":"3","markdown":"APTO","profile":"APTO","web site":"APTO","pandoc":"","TFP DCP":"APTO","Calculada":"6,8","Calificador Propuesta":"7","Calificador propuesta":""}"
not found in GitHub organization ULL-MFP-AET-2122!
```
The error is due to a misspelling `mancurtru` in the spreadsheet. The actual login is `ManCurTru`.
Once is fixed, we get the correct ouput row: `"CURBELO TRUJILLO","APTO","ManCurTru"`


## Default Organization and Aliases

It helps to have these `gh` aliases `gh pwd` and `gh cd` to get and define the default organization

Here is an example of use:

```
➜  gh-org-members git:(main) ✗ gh cd ULL-MFP-AET-2122
➜  gh-org-members git:(main) ✗ gh pwd
ULL-MFP-AET-2122
```

```
➜  gh-org-members git:(main) ✗ gh cd ULL-ESIT-PL-2122
➜  gh-org-members git:(main) ✗ gh pwd
ULL-ESIT-PL-2122
```

This is a definition for the `cd` alias:

```
➜  gh-org-members git:(main) gh alias list | grep cd
cd:     !gh config set current-org "$1" 2>/dev/null
```

This is a definition for the `pwd` alias:

```
➜  gh-org-members git:(main) gh alias list | grep pwd
pwd:    !gh config get current-org
```

Here is another alias that uses the program [yq](https://github.com/mikefarah/yq) to query the `gh` yml configuration file:

```
➜  gh-org-members git:(develop) ✗ gh alias list | grep getc
getc:   !yq "$1" ~/.config/gh/config.yml
```

It is used this way:

```
✗ gh getc '."current-org"'
"ULL-MFP-AET-2122"
✗ gh getc '.aliases.cd'  
"!gh config set current-org \"$1\" 2>/dev/null"
```