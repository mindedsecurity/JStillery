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
  if (normalizejs) {
    try {
      ast = esmangle.optimize(ast, pass(), {
        destructive: true
      });
    } catch (e) {
      console.error("[EE] Problem in mangling", e);
      console.error("[II] Mangle normalization were not performed due to errors. the code is going to be passed as it is to JSTillery");
    }
  }
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
