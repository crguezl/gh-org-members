const ins = require("util").inspect;
const balanced = require('balanced-match');

const shell = require('shelljs');
const { Command } = require('commander');
const { setDefaultOrg, fzfGetOrg } = require('@crguezl/gh-utilities');
const { off } = require("process");

const program = new Command();
program.version(require('./package.json').version);

program
  .name("gh org-members")
  .usage("[options] [organization]")
  .option('-f, --fullname', 'show name of the user (if available)')
  .option('-j, --json', 'returns the full json object')
  .option('-r, --regexp <regexp>', 'filter <query> results using <regexp>')
  .option('-u, --url', 'show github user url')
  .option('-l, --login', 'show github user login')
  .option('-w, --orgurl', 'show github user url as a member of the org')
  .option('-s, --site', 'show url of the members github pages web sites')
  .option('-c, --csv [field...]', 'shows the values of the fields of the organization csv')
  .option('-o --org <org>', 'default organization')
  .option('   --default', 'Set selected "org" as default organization for future uses');

program.addHelpText('after', `
  - If the organization is not explicitly specified or there is a default org, 
    the selection will be done interactively among the list of your organizations using 'fzf'
  - You can set the default organization through the "--default" option for future uses of this program
  - When in 'fzf', use CTRL-A to select all, tab to select/deselect
  `
);


program.parse(process.argv);


const options = program.opts();

const deb = (...args) => {
  console.log(ins(...args, { depth: null }));
};

//deb(options);

function getMembers(org) {
  // Get the list of members of the organization
  let result = ghCont(`api graphql --paginate -f query='
  query($endCursor: String) {
    organization(login: "${org}") {
      membersWithRole(first: 10, after:$endCursor) {
        pageInfo {
          hasNextPage,
          endCursor
        }
        edges {
          node {
            login
            name
            url
          }
          role
        }
      }
    }
  }
  '
  `);

  /* example of output
  {
  "data": {
    "organization": {
      "membersWithRole": {
        "pageInfo": {
          "hasNextPage": true,
          "endCursor": "Y3Vyc29yOnYyOpHOAVenaQ=="
        },
        "edges": [
          {
            "node": {
              "login": "crguezl",
              "name": "Casiano Rodriguez-Leon"
            },
            "role": "ADMIN"
          },
          {
            "node": {
              "login": "casiano",
              "name": "Casiano"
            },
            "role": "MEMBER"
          },
          {
            "node": {
              "login": "amarrerod",
              "name": "Alejandro Marrero"
            },
            "role": "MEMBER"
          },
          {
            "node": {
              "login": "ivan-ga",
              "name": "Iván González"
            },
            "role": "MEMBER"
          }
        ]
      }
    }
  }
  }
  */

  if (result.stderr) {
    let messages = JSON.parse(result.stdout).errors.map(x => x.message);
    console.log(messages.join("\n"));
    process.exit(1);
  }

  rout = result.stdout;
  //console.log(rout);
  let chunkInfo, members = [];

  while (chunkInfo = balanced('{', '}', rout)) {
    //console.log(chunkInfo);
    let currentObj = JSON.parse('{' + chunkInfo.body + '}');
    let currMembers = currentObj.data.organization.membersWithRole.edges.map(x => {
      let y = x.node;
      y.role = x.role.toLowerCase();
      return y;
    });
    //console.log(currMembers); 
    members = members.concat(currMembers);
    rout = chunkInfo.post;
  }
  return members;
} // end getMembers

if (!shell.which('git')) {
  showError('Sorry, this extension requires git installed!');
}
if (!shell.which('gh')) {
  showError('Sorry, this extension requires GitHub Cli (gh) installed!');
}

function showError(error) {
  if (error) {
    console.error(`Error!: ${error}`);
    process.exit(1);
  }
}

function shContinue(executable, arg, cb) {
  let command = `${executable} ${arg}`;
  //deb(command);
  let result = shell.exec(command, { silent: true }, cb);
  return result;
}

const ghCont = (arg, cb) => shContinue("gh", arg, cb);

debugger;

if (!options.org && (program.args.length == 1)) options.org = program.args[0];

let org = options.org || fzfGetOrg() || process.env["GITHUB_ORG"];

if (options.default) setDefaultOrg(org);

let regexp = /./;
if (options.regexp) {
  regexp = new RegExp(options.regexp, 'i');
}

if (!org) { // set org to the owner of the current repo 
  let r = shell.exec(`gh browse -n`);
  if (r.code !== 0) program.help();
  org = r.stdout.split('/').slice(-2)[0];
  //deb(org);
}

let members = getMembers(org);

members = members.filter(m => regexp.test(m.name) || regexp.test(m.login))
// read the csv file and decorate the filtered members with the additional info
// Get the teams of those members and decorate the result with the team info

// Decorate: add site
members.forEach(x => x.site = `https://${x.login}.github.io`)

members.map(x => x.orgurl = `https://github.com/orgs/${org}/people/${x.login}`)

members.forEach(x => x.fullname = `${x?.name || x?.login}`);

if (options.json) {
  console.log(JSON.stringify(members, null, 2));
  process.exit(0);
}

let set = new Set(Object.keys(options));
set.delete('regexp');
set.delete('json');
set.delete('org');
set.delete('debug');

members.forEach(x => {
  let output = [];
  for (opt of set) {
    //console.log(opt);
    output.push(`"${x[opt]}"`);
  }
  console.log(output.join(","));
});
process.exit(0)
