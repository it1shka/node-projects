const readline = require('readline')
    .createInterface({input: process.stdin, output: process.stdout});
const input = msg => new Promise(
    resolve => readline.question(
        ''||msg, ans => resolve(ans)
    )
);
const number = /^\d+(\.\d+)?/;
const notNumbers = '+-*/^()';
const ops = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3
};

function createRpnStack(input){
    input = input.split(' ').join('');
    function next(){
        if(!input)return undefined;
        let match;
        if(match = input.match(number)){
            input = input.slice(match[0].length);
            return Number(match[0]);
        }
        if(notNumbers.includes(match = input.charAt(0))){
            input = input.slice(1);
            return match;
        }
        throw `Unknown shit "${input.charAt(0)}"`;
    }

    let token;
    const opstack  = [];
    const outstack = [];
    while(token = next()){
        if(typeof token == 'number'){
            outstack.push(token);
        }
        else if(token == '('){
            opstack.push(token);
        }
        else if(token == ')'){
            let back;
            while( (back = opstack.pop()) != '('){
                if(!back){
                    throw 'Where is "("?';
                }
                outstack.push(back);
            }
        }
        else {
            while(ops[opstack[opstack.length - 1]] >= ops[token]){
                outstack.push(opstack.pop());
            }
            opstack.push(token);
        }
    }
    while(token = opstack.pop()){
        if(token == '(')
            throw 'Where is ")"?';
        outstack.push(token);
    }

    return outstack;
}

function evaluateRpnStack(rpnstack){
    const funcs = Object.create(null);
    ['+', '-', '*', '/'].forEach(
        e => funcs[e] = Function('a, b', `return a ${e} b;`)
    );
    funcs['^'] = Function('a, b', 'return a ** b;');

    const runstack = [];
    let token;
    while(token = rpnstack.shift()){
        if(typeof token == 'number'){
            runstack.push(token);
        }
        else{
            const b = runstack.pop();
            const a = runstack.pop();
            runstack.push(funcs[token](a, b));
        }
    }

    return runstack.shift();
}

function run(line){
    try{
        const rpnstack = createRpnStack(line)
        console.log('RPN STACK:');
        console.log(rpnstack);
        console.log('RESULT:');
        console.log(evaluateRpnStack(rpnstack));
    }
    catch(e){
        console.log(e);
    }
}

void async function main(){
    while(true){
        const line = await input('~ ');
        run(line);
    }
}();