## Installation

```
gh extension install crguezl/gh-org-members
```

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

## Example

```
➜  gh-org-members git:(main) ./gh org-members -fwr cas
"Casiano Rodriguez-Leon","https://github.com/orgs/ULL-MFP-AET-2122/people/crguezl"
"Casiano","https://github.com/orgs/ULL-MFP-AET-2122/people/casiano"
```
