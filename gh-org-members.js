const ins = require("util").inspect;
const balanced = require('balanced-match');

const deb = (...args) => {
  if (debug) console.log(ins(...args, { depth: null }));
};

const shell = require('shelljs');
const { Command } = require('commander');

const program = new Command();
program.version(require('./package.json').version);

program
  .name("gh org-members [options] [organization]")
  .option('-f, --fullname', 'show name of the user (if available)')
  .option('-j, --json', 'returns the full json object')
  .option('-r, --regexp <regexp>', 'filter <query> results using <regexp>')
  .option('-o --org <org>', 'default organization or user');

program.addHelpText('after', `
  - You can set the default organization through the GITHUB_ORG environment variable
`);

program.parse(process.argv);

const debug = program.debug;

const options = program.opts();
deb(options);

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

function sh(executable, ...args) {
  let command = `${executable} ${args.join('')}`;
  deb(command);
  let result = shell.exec(command, { silent: true });
  if (result.code !== 0) {
    shell.echo(`Error: Command "${command}" failed\n${result.stderr}`);
    shell.exit(result.code);
  }
  return result.stdout.replace(/\s+$/, '');
}

function shContinue(executable, arg, cb) {
  let command = `${executable} ${arg}`;
  deb(command);
  let result = shell.exec(command, { silent: true }, cb);
  return result;
}

const ghCont = (arg,cb) => shContinue("gh", arg, cb);

debugger;

if (!options.org && (program.args.length == 1)) options.org = program.args[0];

let org = options.org || process.env["GITHUB_ORG"];

let regexp = /./;
if (options.regexp) {
  regexp = new RegExp(options.regexp, 'i');
}

if (!org) program.help();

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

let rout = result.stdout;
//console.log(rout);
let chunkInfo, members = [];

while (chunkInfo = balanced('{', '}', rout)) {
  //console.log(chunkInfo);
  let currentObj = JSON.parse('{'+chunkInfo.body+'}');
  let currMembers = currentObj.data.organization.membersWithRole.edges.map(x =>  {
    let y = x.node;
    y.role = x.role.toLowerCase();
    return y;
  }); 
  //console.log(currMembers); 
  members = members.concat(currMembers);  
  rout = chunkInfo.post;

}

if (options.json) {
  console.log(JSON.stringify(members, null, 2));
  process.exit(0);
}

if (options.fullname) {
  members.forEach(x => console.log(`${x.login}: ${x.name} (${x.role})`))
  process.exit(0);
}

members.forEach(x => console.log(x.login))



// parallel console.log at the end. branch print-at-the-end
// gh org-members ULL-MFP-AET-2122 -f  2,84s user 1,11s system 122% cpu 3,218 total
// gh org-members ULL-MFP-AET-2122 -f  2,73s user 1,08s system 119% cpu 3,193 total

// sequential branch: sequential
// gh org-members ULL-MFP-AET-2122 -f  3,31s user 1,16s system 35% cpu 12,754 total
// gh org-members ULL-MFP-AET-2122 -f  3,36s user 1,18s system 35% cpu 12,784 total

// parallel: print as soon as it is available. branch: main
// gh org-members ULL-MFP-AET-2122 -f  2,92s user 1,18s system 119% cpu 3,445 total
// gh org-members ULL-MFP-AET-2122 -f  2,81s user 1,14s system 120% cpu 3,289 total

// graphql only for the username, parallel, print asap 
// gh org-members ULL-MFP-AET-2122 -f  2,89s user 1,24s system 127% cpu 3,244 total
// gh org-members ULL-MFP-AET-2122 -f  3,01s user 1,34s system 129% cpu 3,352 total

// GraphQl all 
// gh org-members ULL-MFP-AET-2122 -f  0,32s user 0,17s system 32% cpu 1,505 total
// gh org-members ULL-MFP-AET-2122 -f  0,34s user 0,18s system 35% cpu 1,499 total

// Conclusion: A factor of 8 

/*
  gh api graphql --paginate -f query='
  query($endCursor: String) {
    organization(login: "ULL-MFP-AET-2122") {
      membersWithRole(first: 4, after:$endCursor) {
        pageInfo { 
          hasNextPage, 
          endCursor 
        }

        edges {

          node {
            login
            name
          }
          role
        }
      }
    }
  }
'

  gh api graphql --paginate -f query='
  query {
    organization(login: "ULL-MFP-AET-2122") {
      membersWithRole(first: 100) {
        edges {
          cursor
          node {
            login
            name
          }
          role
        }
      }
    }
  }
'

*/
