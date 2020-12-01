const nearley = require('nearley');
const grammar = require('./grammar');
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const fs = require('fs');
const file = fs.readFileSync('example.bjs', {encoding: 'utf-8'});
parser.feed(file);
const res = parser.results;
fs.writeFileSync('debug-output.json', JSON.stringify(res, null, 3));