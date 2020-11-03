const fs = require('fs');
const colors = require('colors');
const RUN_PROGRAM = require('./runner');
const readline = require('readline')
    .createInterface({input: process.stdin, output: process.stdout});
const input = msg => 
    new Promise(resolve => 
        readline.question(''||msg, ans => 
            resolve(ans)));

const specialCommandTest = /^\$(\w*)/;
const COMMANDS = Object.create(null);
COMMANDS.exit = function(){
    process.exit(1);
}
COMMANDS.run = function(path){
    const cont = fs.readFileSync(path, {encoding: 'utf8'});
    RUN_PROGRAM(cont);
}
COMMANDS.echo = function(...args){
    args.forEach(e => console.log(e));
}
COMMANDS.read = function(path){
    const cont = fs.readFileSync(path, {encoding: 'utf8'});
    console.log(cont.yellow);
}
COMMANDS.help = function(){
    Object.keys(this).forEach(e => console.log(String(e).cyan));
}

void async function main(){
    while(true){
        const line = await input('~ ');
        const special = specialCommandTest.exec(line);
        if(special){
            const name = special[1];
            if(name in COMMANDS){
                const args = line.slice(special[0].length).split(' ').filter(e => e != '');
                console.log(`special command: "${name}", args: |${args}|`);
                COMMANDS[name](...args);
            }else{
                console.log(`There is no special command with name "${name}"`);
            }
        }
        else{
            RUN_PROGRAM(line);
        }
    }
}();