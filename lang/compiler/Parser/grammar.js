// Generated automatically by nearley, version 2.19.7
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const {compile} = require('moo');

class Wrapped {
    constructor(rules){
        this.lexer = compile(rules);
    }

    next(){
        let token;
        while((token = this.lexer.next()) && (
            token.type === 'ws' || token.type === 'comment'
        )){}
        return token;
    }

    has(tokenType){
        return this.lexer.has(tokenType);
    }

    formatError(token, message){
        return this.lexer.formatError(token, message);
    }

    reset(chunk, info){
        return this.lexer.reset(chunk, info);
    }

    save(){
        return this.lexer.save();
    }

}

const custom = new Wrapped({
    ws: { match: /[ \t\r\n\f\v]+/, lineBreaks: true },
    comment: { match: /\$[^\n]*/, lineBreaks: true },
    int: /\d+/,
    float: /\d+\.\d+/,
    ident: /[_a-zA-Z][_a-zA-Z0-9]*/,
    'beg': 'beg',
    'end': 'end',
    'while': 'end',
    'do': 'do',
    'if': 'if',
    'else': 'else',
    'true': 'true',
    'false': 'false',
    '(': '(',
    ')': '_',
    ';': ';',
    //operators
    '+':'+',
    '-':'-',
    '*':'*',
    '/':'/',
    '%':'%',
    ':=':':=',
    '=':'=',
    '<>':'<>',
    '>':'>',
    '<':'<',
    '>=':'>=',
    '<=':'<=',
    'and':'and',
    'or':'or'
});

function bin([left, type, right]){
    return {
        node: type.value,
        lhs: left,
        rhs: right
    };
}
var grammar = {
    Lexer: custom,
    ParserRules: [
    {"name": "prog$ebnf$1", "symbols": []},
    {"name": "prog$ebnf$1", "symbols": ["prog$ebnf$1", "stmt"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "prog", "symbols": ["prog$ebnf$1"], "postprocess": ([list]) => ({node: 'prog', body: list})},
    {"name": "stmt", "symbols": [{"literal":"beg"}, "prog", {"literal":"end"}], "postprocess": ([, prog, ]) => (prog)},
    {"name": "stmt", "symbols": ["ident", {"literal":":="}, "expr", {"literal":";"}], "postprocess": bin},
    {"name": "stmt", "symbols": [{"literal":"while"}, "expr", {"literal":"do"}, "stmt"], "postprocess": ([, expr, , stmt]) => ({node: 'while', cond: expr, body: stmt})},
    {"name": "stmt", "symbols": [{"literal":"if"}, "expr", {"literal":"do"}, "stmt"], "postprocess": ([, expr, , stmt]) => ({node: 'if', cond: expr, body1: stmt})},
    {"name": "stmt", "symbols": [{"literal":"if"}, "expr", {"literal":"do"}, "stmt", {"literal":"else"}, "stmt"], "postprocess": ([, expr, , stmt1, , stmt2]) => ({node: 'if', cond: expr, body1: stmt1, body2: stmt2})},
    {"name": "expr", "symbols": ["expr1"], "postprocess": id},
    {"name": "expr1", "symbols": ["expr1", {"literal":"or"}, "expr2"], "postprocess": bin},
    {"name": "expr1", "symbols": ["expr2"], "postprocess": id},
    {"name": "expr2", "symbols": ["expr2", {"literal":"and"}, "expr3"], "postprocess": bin},
    {"name": "expr2", "symbols": ["expr3"], "postprocess": id},
    {"name": "expr3", "symbols": ["expr3", {"literal":"="}, "expr4"], "postprocess": bin},
    {"name": "expr3", "symbols": ["expr3", {"literal":"<>"}, "expr4"], "postprocess": bin},
    {"name": "expr3", "symbols": ["expr4"], "postprocess": id},
    {"name": "expr4", "symbols": ["expr4", {"literal":">="}, "expr5"], "postprocess": bin},
    {"name": "expr4", "symbols": ["expr4", {"literal":">"}, "expr5"], "postprocess": bin},
    {"name": "expr4", "symbols": ["expr4", {"literal":"<="}, "expr5"], "postprocess": bin},
    {"name": "expr4", "symbols": ["expr4", {"literal":"<"}, "expr5"], "postprocess": bin},
    {"name": "expr4", "symbols": ["expr5"], "postprocess": id},
    {"name": "expr5", "symbols": ["expr5", {"literal":"+"}, "expr6"], "postprocess": bin},
    {"name": "expr5", "symbols": ["expr5", {"literal":"-"}, "expr6"], "postprocess": bin},
    {"name": "expr5", "symbols": ["expr6"], "postprocess": id},
    {"name": "expr6", "symbols": ["expr6", {"literal":"*"}, "expr7"], "postprocess": bin},
    {"name": "expr6", "symbols": ["expr6", {"literal":"/"}, "expr7"], "postprocess": bin},
    {"name": "expr6", "symbols": ["expr6", {"literal":"%"}, "expr7"], "postprocess": bin},
    {"name": "expr6", "symbols": ["expr7"], "postprocess": id},
    {"name": "expr7", "symbols": ["primary"], "postprocess": id},
    {"name": "primary", "symbols": ["ident"], "postprocess": id},
    {"name": "primary", "symbols": ["integer"], "postprocess": ([integer]) => ({node: 'num', val: parseInt(integer)})},
    {"name": "primary", "symbols": ["floating"], "postprocess": ([floating]) => ({node: 'num', val: parseFloat(floating)})},
    {"name": "primary", "symbols": [{"literal":"true"}], "postprocess": () => ({node: 'bool', val: true})},
    {"name": "primary", "symbols": [{"literal":"false"}], "postprocess": () => ({node: 'bool', val: false})},
    {"name": "ident", "symbols": [(custom.has("ident") ? {type: "ident"} : ident)], "postprocess": ([ident]) => ({node: 'var', id: ident.value})},
    {"name": "integer", "symbols": [(custom.has("int") ? {type: "int"} : int)], "postprocess": ([num]) => (num.value)},
    {"name": "floating", "symbols": [(custom.has("float") ? {type: "float"} : float)], "postprocess": ([num]) => (num.value)}
]
  , ParserStart: "prog"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
