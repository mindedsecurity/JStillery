var esprima = require("esprima");
var escodegen = require("escodegen");
var esmangle = require("esmangle");
var esdeob = require("../src/jstiller.js");
var pass = require("../src/custom_esmangle_pipeline.js").createPipeline;

window.deobfuscate = function deob(code, normalizejs) {
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
  var ast = astFromCode(code, true)
  if(normalizejs)
    ast = esmangle.optimize(ast, pass(), {
      destructive: true
    });
  esdeob.init();
  try {
    ast = esdeob.deobfuscate(ast, null, true);
  } catch (e) {
    console.log(e)
  }

  return escodegen.generate(ast, {
    comment: true
  });
}