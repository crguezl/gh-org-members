## Installation

```
gh extension install crguezl/gh-org-members
```

It is convenient to have [fzf](https://github.com/junegunn/fzf) installed.

## Help

```
✗ gh org-members -h
Usage: gh org-members [options] [organization]

Options:
  -V, --version          output the version number
  -f, --fullname         show name of the user (if available)
  -j, --json             returns the full json object
  -r, --regexp <regexp>  filter <query> results using <regexp>
  -u, --url              show github user url
  -l, --login            show github user login
  -w, --orgurl           show github user url as a member of the org
  -s, --site             show url of the members github pages web sites
  -o --org <org>         default organization or user
     --default           Set selected "org" as default organization for future uses
  -h, --help             display help for command

  - If the organization is not explicitly specified or there is a default org, 
    the selection will be done interactively among the list of your organizations
  - You can set the default organization through the "--default" option for future uses of this program
   saving it inside the `gh` config file using `gh config set 'current-org' '${org}'`
  - When in fzf, use CTRL-A to select all, tab to select/deselect
```

## Examples

```
➜  gh-org-members git:(main) gh org-members -fwr cas
"Casiano Rodriguez-Leon","https://github.com/orgs/ULL-MFP-AET-2122/people/crguezl"
"Casiano","https://github.com/orgs/ULL-MFP-AET-2122/people/casiano"
```

```
➜  gh-org-members git:(main) gh org-members -fusr cas                 
"Casiano Rodriguez-Leon","https://github.com/crguezl","https://crguezl.github.io"
"Casiano","https://github.com/casiano","https://casiano.github.io"
```

```
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