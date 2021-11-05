const ins = require("util").inspect;
const map = require("async/map");

const deb = (...args) => {
  if (debug) console.log(ins(...args, { depth: null }));
};

const fs = require("fs");
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
const ghCode = (...args) => shStderr("gh", ...args);

let repoList;

debugger;

if (!options.org && (program.args.length == 1)) options.org = program.args[0];

let org = options.org || process.env["GITHUB_ORG"];

let regexp = /./;
if (options.regexp) {
  //console.log(options.regexp);
  regexp = new RegExp(options.regexp, 'i');
  //console.log(regexp.source);
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
  let getUserName = (user, cb) => {
    shell.exec(`gh api ${user.url})`, cb);
  }

  map(members, getUserName)
  .then(
    names => console.log(names.join("\n"))
  ).catch(err => console.log(err)) 
}

console.log(logins.join("\n"));


