const
    readline = require('readline')
        .createInterface({input: process.stdin, output: process.stdout}),

    log = console.log,

    input = msg => new Promise(resolve => 
        readline.question(''||msg, ans => resolve(ans)))
;

function split(input){
    let raw = input.split(' ').join('');
    const 
        NUMBER  = /^\d+(\.\d+)?/,
        ELSE    = '()+-*/^',
        tokens  = []
    ;
    while(raw){
        let match;
        if(match = raw.match(NUMBER)){
            match = match[0];
        }
        else if(!ELSE.includes(match = raw.charAt(0)) )
            throw 'Incorrect input!';
        tokens.push(match);
        raw = raw.slice(match.length);
    }
    return tokens;
}

function parse(tokens){
    const
        ops = {
            1: ['+', '-'],
            2: ['*', '/'],
            3: ['^']
        },
        peek = () => tokens[0],
        skip = () => tokens.shift();
    ;
    
    function parseLow(){
        const tok = peek();
        //number
        if(/^\d+(\.\d+)?$/.test(tok)){
            skip();
            return tok;
        }
        else if('(' == tok){
            skip();
            const expr = parseExpr();
            if(')' != peek()){
                throw 'Expected ")"';
            }
            skip();
            return expr;
        }
        else throw 'Expected number or "("';
    }

    function parseExpr(priority = 1){
        const node = (
            (priority < Object.keys(ops).length)
            ? (() => parseExpr(priority + 1))
            : (() => parseLow())
        );

        let expr = node();
        let op = peek();
        while(ops[priority].includes(op)){
            skip();
            const rhs = node();
            expr = {type: op, left: expr, right: rhs};
            op = peek();
        }

        return expr;
    }

    return parseExpr();
}

function evaluator(ast){
    const funcs = Object.create(null);
    ['+', '-', '*', '/'].forEach(e => funcs[e] = Function('a, b', `return a ${e} b;`));
    funcs['^'] = Function('a, b', 'return a ** b;');
    
    function getArg(arg){
        if(typeof arg == 'object'){
            return evaluate(arg);
        }
        else return Number(arg);
    }

    function evaluate(node){
        const func = funcs[node.type];
        const
            left  = getArg(node.left),
            right = getArg(node.right)
        ;

        return func(left, right);
    }

    return getArg(ast);
}

function run(line){
    let tokens;
    try{
        tokens = split(line);
        log('Tokens:');
        log(tokens);
    }catch(e){
        log('Lexical error:');
        log(e);
        return;
    }

    let ast;
    try{
        ast = parse(tokens);
        log('AST:');
        log(ast);
    }catch(e){
        log('Parser error:');
        log(e);
        return;
    }

    log('Result:');
    log(evaluator(ast));

}

void async function main(){
    while(true){
        const line = await input('~ ');
        run(line);
    }
}();