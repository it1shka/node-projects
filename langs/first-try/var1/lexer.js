function InputStream(input){
    let 
        position = 0,
        line     = 1,
        column   = 0;
    
    return {
        next,
        peek,
        eof,
        croak
    };

    function next(){
        const ch = input.charAt(position++);
        if (ch == '\n'){
            line++;
            column = 0;
        }
        else
            column++;
        
        return ch;
    }

    function peek(){
        return input.charAt(position);
    }

    function eof(){
        return peek() == '';
    }

    function croak(message){
        throw new Error(`${message}: at line ${line}, at column ${column}`);
    }

}

function TokenStream(input){
    const 
        KEYWORDS  = [
            'break',
            'continue',
            'else',
            'loop',
            'if',
            'fnc',
            'return',
            'obj',
        ],
        OPERATORS = [
            '=',
            '+',
            '-',
            '*',
            '/',
            '%',
            '**',
            '==',
            '!=',
            '>',
            '<',
            '>=',
            '<=',
            '&&',
            '||',
            //'!',
        ],
        PUNCTS = [
            ',',
            ';',
            '{',
            '}',
            '(',
            ')',
            '[',
            ']',
            ':',
        ];

    let current = null;
    const croak = input.croak;
    return {
        next,
        peek,
        eof,
        croak
    };
    
    function isKeyword(x){
        return KEYWORDS.includes(x);
    }

    function isDigit(ch){
        return /\d/.test(ch);
    }

    function isIdStart(ch){
        return /[_a-zA-Z]/.test(ch);
    }

    function isId(ch){
        return isIdStart(ch) || isDigit(ch);
    }

    function isOp(ch){
        return '=+-*/%!><&|'.indexOf(ch) >= 0;
    }

    function isPunc(ch){
        return PUNCTS.includes(ch);
    }

    function isWhitespace(ch){
        return /\s/.test(ch);
    }

    function readOp(){
        const op = readWhile(isOp);
        if(OPERATORS.includes(op))
            return {type: 'op', value: op};
        else
            input.croak(`Unknown operator "${op}"`);
    }

    function readWhile(predicate){
        let str = "";
        while(!input.eof() && predicate(input.peek()) )
            str += input.next();
        return str;
    }

    function readNumber(){
        let has_dot = false;
        let number = readWhile(ch => {
            if(ch == '.'){
                if(has_dot) return false;
                has_dot = true;
                return true;
            }
            return isDigit(ch);
        });
        return {type: "num", value: parseFloat(number) };
    }

    function readId(){
        const id = readWhile(isId);
        return {
            type: isKeyword(id) ? 'keyword' : 'variable',
            value: id
        };
    }

    function readEscaped(end) {
        let escaped = false, str = "";
        input.next();
        while (!input.eof()) {
            const ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }
    function readString(){
        return {type: 'str', value: readEscaped('"')};
    }

    function skipComment(){
        readWhile(e => e != '\n');
        input.next();
    }

    function readNext(){
        readWhile(isWhitespace);
        if(input.eof()) return null;
        const ch = input.peek();
        if(ch == '#'){
            skipComment();
            return readNext();
        }
        if  (ch == '"')       return readString();
        if  (isDigit(ch))     return readNumber();
        if  (isIdStart(ch))   return readId();
        if  (isPunc(ch))      return {type: 'punc', value: input.next()};
        if  (isOp(ch))        return readOp();
        input.croak(`Unexpected char "${ch}"`);
    }

    function next(){
        const token = current;
        current = null;
        return token || readNext();
    }

    function peek(){
        return current || (current = readNext());
    }

    function eof(){
        return peek() == null;
    }

}

function Lexer(input){
    const inputStream = InputStream(input);
    const tokenStream = TokenStream(inputStream);
    const tokens = [];
    while(!tokenStream.eof()){
        tokens.push(tokenStream.next());
    }
    return tokens;
}

exports.Lexer           = Lexer;
exports.InputStream     = InputStream;
exports.TokenStream     = TokenStream;