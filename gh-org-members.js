const ins = require("util").inspect;

const shell = require('shelljs');
const { Command } = require('commander');
const { getMembers, showError, setDefaultOrg, fzfGetOrg } = require('@crguezl/gh-utilities');
//const homedir = require('os').homedir();

function writeMembers(members, options) {
  if (options.json) {
    console.log(JSON.stringify(members, null, 2));
    process.exit(0);
  }
  
  let set = new Set(Object.keys(members[0]));
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
}

function main(members, options, org) {

  members = members.filter(m => regexp.test(m.name) || regexp.test(m.login))
  // read the csv file and decorate the filtered members with the additional info
  // Get the teams of those members and decorate the result with the team info
  
  // Decorate: add site
  members.forEach(x => x.site = `https://${x.login}.github.io`)
  
  members.map(x => x.orgurl = `https://github.com/orgs/${org}/people/${x.login}`)
  
  members.forEach(x => x.fullname = `${x?.name || x?.login}`);
  
  let csvFilePath;

  if (options.csv) {
    if (options.pathcsv) {
      csvFilePath = options.pathcsv;
    } else { // Get the last file matching /${org}.*\.csv/ in the downloads folder
      const downloadsFolder = require('downloads-folder');
      const path = require('path');
      const fs = require('fs');
  
      var downloadsDir = downloadsFolder(); // your downloads directory
      let escapedOrg = org.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      let regexp = new RegExp(`^${escapedOrg}.*\\.csv$`);
      var files = fs.readdirSync(downloadsFolder()).filter(file => file.match(regexp)).map(file => path.join(downloadsDir, file));
      //console.log(files);
      if (files.length === 0) {
        console.error(`No csv file matching regexp pattern /${regexp.source}/ found for organization "${org}" in folder "${downloadsDir}"`);
        process.exit(1);
      }
  
      // sort by date
      files.sort((a, b) => fs.statSync(a).mtime.getTime()-fs.statSync(b).mtime.getTime());
      //console.log(files);
          
      csvFilePath = files.pop(); // get the last file matching the org name in the downloads folder  
    }
    //console.log(csvFilePath);

    const csv=require('csvtojson');
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        jsonObj.forEach((x, j) => {
          members.forEach(m => {
            if (m.login === x.login) {
              //console.log(`${m.login},${x.id}`);
              if (x.id) m.id = x.id;
              //console.log(options.csv)
              if (Array.isArray(options.csv)) {
                options.csv.forEach(c => {
                  m[c] = x[c];
                }
                )
              } else {
                m = Object.assign(m, x);
              }
            }
          });
        });
        writeMembers(members, options);
    })
    .catch(err =>{
      console.error(`Error trying to  read file "${csvFilePath}"\n${err}`);
      process.exit(1);
    })  
  } else {
    writeMembers(members, options);
  };
} // end main

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
  .option('-p, --pathcsv <csv file>', 'path to the csv file')
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
  console.error(ins(...args, { depth: null }));
};
// deb(options);

if (!shell.which('git')) {
  showError('Sorry, this extension requires git installed!');
}
if (!shell.which('gh')) {
  showError('Sorry, this extension requires GitHub Cli (gh) installed!');
}

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

main(members, options, org);


