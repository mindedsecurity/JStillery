#! /usr/bin/env node

var DEBUGNAME = __filename.slice(__dirname.length + 1, -3);
var debug = require('util').debuglog(DEBUGNAME);

var esprima = require("esprima");
var escodegen = require("escodegen");
var esmangle = require("esmangle");
var fs = require("fs");

var esdeob = require("./src/jstiller.js");

function astFromCode(code, loc, obj) {
  var LOC = loc || false;
  var opts = {
    loc: LOC,
    locations: LOC
  };
  if (obj) {
    for (var i in obj) {
      opts[i] = obj[i];
    }
  }
  var ast = esprima.parse(code + '', opts);
  return ast;
}

var filename;
const argv = process.argv;
if (argv.indexOf("-h")!==-1) {
  console.log(`${argv[1]} [filename_to_be_deobfuscated]
    if no filename is given expects input from stdin.
    Eg.
  echo "var a=1;var b=a;"|./cli.js
    `);
  process.exit(1);
}

if (!argv[2])
  filename = "/dev/stdin";
else
  filename = argv[2];
try {
  var code = fs.readFileSync(filename);
} catch (exc) {
  console.error(exc);
  process.exit(1);
}

var p = {
  pp: function(a) {
    return JSON.stringify(JSON.decycle(a), null, 2); return JSON.stringify(a, function(k, v) {
      if (k !== "parent" || k === '') return v;else return '[Circ]'
    }, 2)
  }
};
var ast = astFromCode(code, true)
esdeob.init();
//ast =  esmangle.optimize(ast);
try {
  ast = esdeob.deobfuscate(ast, null, true);
} catch (e) {
  console.log(e)
}

var deobfuscated_code = escodegen.generate(ast, {
  comment: true
});

debug("AST: ", p.pp(ast), "SCOPES: ", p.pp(esdeob.scopes))

console.log(`Original:
====================
${code}
====================
____________________
Deobfuscated Code
${deobfuscated_code}
`);
