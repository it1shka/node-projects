const {Lexer} = require('./lexer');
function runProgram(input){
    try{
        const tokens = Lexer(input);
        console.log(tokens);
    }
    catch(e){
        console.log(e);
    }
}

module.exports = runProgram;