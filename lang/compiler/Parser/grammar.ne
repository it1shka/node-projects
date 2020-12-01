#grammar of my language
@{%
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
%}
@lexer custom

prog -> 
    stmt:* {% ([list]) => ({node: 'prog', body: list}) %}

stmt ->
    "beg" prog "end" {% ([, prog, ]) => (prog) %}
    | ident ":=" expr ";" {% bin %}
    | "while" expr "do" stmt {% ([, expr, , stmt]) => ({node: 'while', cond: expr, body: stmt}) %}
    | "if" expr "do" stmt {% ([, expr, , stmt]) => ({node: 'if', cond: expr, body1: stmt}) %}
    | "if" expr "do" stmt "else" stmt {% ([, expr, , stmt1, , stmt2]) => ({node: 'if', cond: expr, body1: stmt1, body2: stmt2})%}

expr -> 
    expr1 {% id %}

expr1 ->
    expr1 "or" expr2 {% bin %}
    | expr2 {% id %}

expr2 ->
    expr2 "and" expr3 {% bin %}
    | expr3 {% id %}

expr3 ->
    expr3 "=" expr4 {% bin %}
    | expr3 "<>" expr4 {% bin %}
    | expr4 {% id %}

expr4 ->
    expr4 ">=" expr5 {% bin %}
    | expr4 ">" expr5 {% bin %}
    | expr4 "<=" expr5 {% bin %}
    | expr4 "<" expr5 {% bin %}
    | expr5 {% id %}

expr5 ->
    expr5 "+" expr6 {% bin %}
    | expr5 "-" expr6 {% bin %}
    | expr6 {% id %}

expr6 ->
    expr6 "*" expr7 {% bin %}
    | expr6 "/" expr7 {% bin %}
    | expr6 "%" expr7 {% bin %}
    | expr7 {% id %}

expr7 -> primary {% id %}

primary -> ident {% id %}
    | integer {% ([integer]) => ({node: 'num', val: parseInt(integer)}) %}
    | floating {% ([floating]) => ({node: 'num', val: parseFloat(floating)}) %}
    | "true" {% () => ({node: 'bool', val: true}) %}
    | "false" {% () => ({node: 'bool', val: false}) %}

#atoms
ident -> %ident {% ([ident]) => ({node: 'var', id: ident.value}) %}
integer -> %int {%([num]) => (num.value)%}
floating -> %float {%([num]) => (num.value)%}