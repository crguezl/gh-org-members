const ins = require("util").inspect;
const deb = (...args) => { 
    if (debug) console.log(ins(...args, {depth: null})); 
};

const fs = require("fs");
const shell = require('shelljs');
const { Command } = require('commander');

const program = new Command();
program.version(require('./package.json').version);

program
  .name("gh org-members [options] [organization]")
  .option('-f, --fullname', 'show name of the user (if filled)')
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
    let result = shell.exec(command, {silent: true});
    if (result.code !== 0) {
      shell.echo(`Error: Command "${command}" failed\n${result.stderr}`);
      shell.exit(result.code);
    }    
    return result.stdout.replace(/\s+$/,'');
}

function shContinue(executable, ...args) {
  let command = `${executable} ${args.join('')}`;
  deb(command);
  let result = shell.exec(command, {silent: true});
  if (result.code !== 0) {
    shell.echo(`Error: Command "${command}" failed\n${result.stderr}`);
  }    
  return result.stdout.replace(/\s+$/,'');
}

function shStderr(executable, ...args) {
  
  let command = `${executable} ${args.join('')}`;
  // console.log(command);
  let result = shell.exec(command, {silent: true});
  return result.stderr; 
}


const gh = (...args) => sh("gh", ...args);
const ghCont = (...args) => shContinue("gh", ...args);
const ghCode = (...args) => shStderr("gh", ...args);

let repoList;

debugger;

if (!options.org && (program.args.length == 1) ) options.org = program.args[0];

let org = options.org || process.env["GITHUB_ORG"];

let regexp = /./;
if (options.regexp) {
  //console.log(options.regexp);
  regexp = new RegExp(options.regexp,'i');
  //console.log(regexp.source);
}

if (!org) program.help();

if (org) {
  let result = JSON.parse(gh(`api --paginate "/orgs/${org}/members"`));
  
  if (options.json) {
     console.log(JSON.stringify(result, null, 2));
     process.exit(0);
  } 
  result.forEach((user, i) => {
    let login =  output = user.login;
    
    if (options.fullname) {
      let userInfo = JSON.parse(gh(`api ${user.url}`));
      let name = userInfo.name || ""
    
      output += `: ${name}`;
    }
    if (regexp.test(String(output))) console.log(output)
  })
}
