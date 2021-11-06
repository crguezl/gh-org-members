const ins = require("util").inspect;

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

function shStderr(executable, ...args) {

  let command = `${executable} ${args.join('')}`;
  // console.log(command);
  let result = shell.exec(command, { silent: true });
  return result.stderr;
}


const gh = (...args) => sh("gh", ...args);
const ghCont = (arg,cb) => shContinue("gh", arg, cb);

debugger;

if (!options.org && (program.args.length == 1)) options.org = program.args[0];

let org = options.org || process.env["GITHUB_ORG"];

let regexp = /./;
if (options.regexp) {
  regexp = new RegExp(options.regexp, 'i');
}

if (!org) program.help();


let result = ghCont(`api --paginate "/orgs/${org}/members"`);

if (result.stderr) {
  if (/Not.*Found.*HTTP\s+404/.test(result.stderr)) showError(`Org "${org}" not found!`)
  showError(result.stderr)
}

let members = JSON.parse(result.stdout);

if (options.json) {
  console.log(JSON.stringify(members, null, 2));
  process.exit(0);
}

let logins = members.map(m => m.login).filter(login => regexp.test(login));

if (options.fullname) {
  process.setMaxListeners(members.length);

  // let getUserName = (user, cb) => shell.exec(`gh api ${user.url}`, {silent: true, async: true}, cb);
  let getUserName = (user, cb) => shell.exec(`gh api graphql -f query='
  query  {
    user(login: "${user}") {
      name
    }
  }
  '`, {silent: true, async: true}, cb);

  let count = 0;
  let users = [];
  members.forEach((m,i)  => {
    getUserName(m.login, (err, userInfo) => {
       if (err) {
         count++
         users[i] = logins[i]+": Error accesing this user"
         console.log(users[i]);
       } else {
         userInfo = JSON.parse(userInfo);
         count++
         users[i] = logins[i]+": "+(userInfo.data.user.name || "Not filled name");
         console.log(users[i])
         //if (count === members.length) {
         // console.log(users.join("\n"));
         //}
       }
    })
  })
} else {
  console.log(logins.join("\n"));
}

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

  /*
  memmberswithrole
  query {
    organization(login: "${org}") {
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
  */
