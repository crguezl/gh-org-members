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
  - When in fzf, use CTRL-A to select all, tab to select/deselect
```

## Example

```
➜  github-profile-readme gh org-members ULL-MFP-AET-2122
AdelaGM
Alex100260076
alu0100108859
alu0100879902
alu0100948387
alu0100951844
amarrerod
AnabelCP
casiano
CGuerra2021
ChloeBoistel
crguezl
ivan-ga
Jaimetaks
Juacabga87
magodelnorte
ManCurTru
NoeliaRguezHdez
Ramallin
```
