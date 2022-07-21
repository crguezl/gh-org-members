## Installation

```
gh extension install crguezl/gh-org-members
```

It is convenient to have [fzf](https://github.com/junegunn/fzf) installed.

## Help

```
✗ ./gh-org-members -h
Usage: gh org-members [options] [organization]

Options:
  -V, --version             output the version number
  -f, --fullname            show name of the user (if available)
  -j, --json                returns the full json object
  -r, --regexp <regexp>     filter <query> results using <regexp>
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

## Examples

Using several options together and getting info about users matching `cas`:

```
➜  gh-org-members git:(main) gh org-members -fusr cas                 
"Casiano Rodriguez-Leon","https://github.com/crguezl","https://crguezl.github.io"
"Casiano","https://github.com/casiano","https://casiano.github.io"
```

The same but in json:

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

Merging GitHub API info with info from info in a `.csv` file:

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

If the option `-c` is used but the `.csv` file is not specified via the `-p` option, it will use the most recent 
`*.csv` file in your `Downloads` folder mathching the regular expression pattern `/${org}.*\.csv/` where `org` refers to the specified or default
organization:

```
✗ ls -ltr ~/Downloads/ULL-MFP-AET-2122*                   
-rw-r--r--@ 1 casianorodriguezleon  staff  3537 20 jul 10:40 /Users/casianorodriguezleon/Downloads/ULL-MFP-AET-2122 - Evaluacion.csv
```

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
➜  gh-org-members git:(main) ✗ gh org-members -fr sara -c  'Grado desde el que accede'
"Alex100260076","Alejandro Glez. Sarasola","https://github.com/Alex100260076","member","https://Alex100260076.github.io","https://github.com/orgs/ULL-MFP-AET-2122/people/Alex100260076","Alejandro Glez. Sarasola","alu0100260076","Ingeniería industrial"
```

## Default Organization and Aliases

It helps to have these aliases:

```
➜  gh-org-members git:(main) gh pwd
ULL-MFP-AET-2122
➜  gh-org-members git:(main) gh alias list | grep cd
cd:     !gh config set current-org "$1" 2>/dev/null
➜  gh-org-members git:(main) gh alias list | grep pwd
pwd:    !gh config get current-org
```

```
➜  gh-org-members git:(develop) ✗ gh alias list | grep getc
getc:   !yq "$1" ~/.config/gh/config.yml
➜  gh-org-members git:(develop) ✗ gh getc '."current-org"'
"ULL-MFP-AET-2122"
➜  gh-org-members git:(develop) ✗ gh getc '.aliases.todo'  
"!open https://github.com/crguezl/todo/projects/1"
```