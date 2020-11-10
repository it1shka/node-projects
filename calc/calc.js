const readline = require('readline')
    .createInterface({input: process.stdin, output: process.stdout});

const input = msg => 
    new Promise(resolve => 
        readline.question(''||msg, ans =>
            resolve(ans)));

const OPS = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3
}

function split(input){
    let raw = input.split(' ').join('');
    const tokens = [];
    while(raw){
        let match;
        if(match = /^\d+(\.\d+)?/.exec(raw)){
            tokens.push(Number(match[0]) );
            raw = raw.slice(match[0].length);
        }
        else if((match = raw.charAt(0)) in OPS){
            tokens.push(match);
            raw = raw.slice(match.length);
        }
        else throw 'Incorrect input!';
    }
    return tokens;
}

function ast(tokens){

    function main(prevNode){
        const 
            a = tokens.shift(),
            b = tokens.shift();

        if(a in OPS){
            throw 'Before an OP there should be a number!';
        }
        
        if(!a && !b){
            if(prevNode != null)
                throw 'There is nothing after an operator!';
            else return null;
        }
        
        let normnode;
        if(b){
            const hfnode = {type: b, left: a};
            normnode = main(hfnode);
        }
        else{
            normnode = a;
        }

        if(prevNode == null)
            return normnode;
        else{
            const myPrec = OPS[normnode.type] || Infinity;
            const hisPrec = OPS[prevNode.type];
            return hisPrec >= myPrec
            ? {
                type: normnode.type,
                left: {
                    type: prevNode.type,
                    left: prevNode.left,
                    right: normnode.left
                },
                right: normnode.right || normnode
            }
            : {
                type: prevNode.type,
                left: prevNode.left,
                right: normnode
            }
            ;
        }
    }

    return main(null);

}


void async function main(){
    while(true){
        const line = await input('~ ');
        try{
            console.log(ast(split(line)));
        }
        catch(e){
            console.log(e);
        }
        finally{
            console.log('<----->');
        }
    }
}();