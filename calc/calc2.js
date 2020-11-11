const readline = require('readline')
    .createInterface({input: process.stdin, output: process.stdout});
const input = msg => new Promise(resolve => readline.question(''||msg, ans => resolve(ans))); 

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

function ast(tokens){

    const
        ops = {
            '+': 1, '-': 1,
            '*': 2, '/': 2,
            '^': 3
        },
        notNumbers = '+-*/^()'
    ;

    function err(msg){
        msg = msg || 'EOF';
        throw `Unexpected node "${JSON.stringify(msg) }" while parsing!`;
    }

    function next(){
        const token = tokens.shift();
        if(token === '(')
            return {type: 'in-brackets', body: recursive(undefined, ')')};
        else return token;
    }

    function merge(nodeA, nodeB){
        const 
            precA = ops[nodeA.type] || Infinity,
            precB = ops[nodeB.type] || Infinity
        ;

        let merged;

        if(precA >= precB){

        }
        else{

        }

        return merged;
    }

    function recursive(prev, stop){
        const a = next();
        if( (!a && !prev) ||  notNumbers.includes(a))
            err(a);
        
        const b = next();
        if( !((b === stop) || (b in ops)) )
            err(b);
        
        let cur;
        if(b === stop){
            cur = a;
        }
        else{
            const half = {type: b, left: a};
            cur = recursive(half, stop);
        }

        if(!prev)
            return cur;
        
        
        const
            myPrec = ops[cur.type]   || Infinity,
            hisPrec = ops[prev.type] || Infinity
        ;

        const final = (hisPrec >= myPrec)
        ? {
            type: cur.type,
            left: {
                type: prev.type,
                left: prev.left,
                right: cur.left
            },
            right: cur.right || cur
        }
        : {
            type: prev.type,
            left: prev.left,
            right: cur
        }
        ;
        
        return final;
    }

    return recursive();

}

function run(line){
    const
        tokens = split(line),
        ast_   = ast(tokens)
    ;

    console.log(ast_);
}

void async function main(){
    while(true){
        const line = await input('~ ');
        try{
            run(line);
        }
        catch(e){
            console.log(e);
        }
    }
    readline.close();
}();
