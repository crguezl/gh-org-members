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

Getting not only GitHub API info but also info (option `-c`) from info a specified `.csv` file (option `-p`). 
The `.csv`file has to have a column `.login` with the GitHub logins of the members. Here we search for student entries matching `sara`:

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
`*.csv` file in your `Downloads` folder matching the regular expression pattern `/${org}.*\.csv/` where `org` refers to the specified or default
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
✗ gh org-members -r sara -c  Apellidos 'Grado desde el que accede'
"González Sarasola","Ingeniería industrial"
```

## Default Organization and Aliases

It helps to have these `gh` aliases `gh pwd` and `gh cd` to define the default organization

```
➜  gh-org-members git:(main) gh pwd
ULL-MFP-AET-2122
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
✗ gh getc '.aliases.todo'  
"!open https://github.com/crguezl/todo/projects/1"
```