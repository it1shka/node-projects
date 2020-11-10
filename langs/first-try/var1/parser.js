function Parser(input){
    const PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
        "**": 30,
    };

    return parseTopLevel();

    function parseExpression(){
        
    }

    function parseTopLevel(){
        const prog = [];
        while(!input.eof()){
            prog.push(parseExpression());
            if(!input.eof()) skipPunc(';');
        }
        return {type: 'prog', prog: prog};
    }

}