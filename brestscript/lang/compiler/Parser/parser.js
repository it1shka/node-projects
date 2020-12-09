module.exports = function(input){
    const nearley = require('nearley');
    const grammar = require('./grammar');
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try{
        parser.feed(input);
        const res = parser.results;
        return res;
    }
    catch(e){
        //const t = e.token;
        //throw `Unexpected token ${t.type ? `${t.value} of type ${t.type}` : `${t.value}`}\n<at line ${t.line}, at column ${t.col}>`;
        throw e;
    }
}