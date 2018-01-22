var fs = require("fs");
var path = require("path");
var expect = require("chai").expect;
var assert = require("assert");

var esprima = require("esprima");
var escodegen = require("escodegen");

var esdeob = require("../src/jstiller.js");

function astFromFile(filename, loc, obj) {
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
  var ast = esprima.parse(fs.readFileSync(filename) + '', opts);
  return ast;
}


var testsDir = path.join(__dirname, "tests_OK/");
var expectedDir = path.join(__dirname, './tests_OK/expected_acc/');

describe('JStillery', function() {
  var files = (fs.readdirSync(expectedDir));
  for (var i = 0, l = files.length; i < l; i++) {

    if (/\.js$/.test(files[i])) {
      describe(files[i], function() {
        var file = this.title;

        var expected = fs.readFileSync(expectedDir + this.title).toString();

        it('should be reduced correctly', function() {
          this.timeout(5000);
          var ast = astFromFile(testsDir + file);
          esdeob.init();
          ast = esdeob.deobfuscate(ast, null, true);
          var reduced = escodegen.generate(ast);

          expect(reduced.trim()).to.be.equal(expected.trim());
        });
      });
    }
  }
})
