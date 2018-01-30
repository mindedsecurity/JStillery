// AST stuff
var esprima = require('esprima');
var escodegen = require('escodegen');
var esmangle = require('esmangle');

// Express Server stuff
var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express');

// Jstillery / Custom AST 
var esdeob = require('../src/jstiller.js');
var pass = require("../src/custom_esmangle_pipeline.js").createPipeline;

// Custom 
var app = express();

const server_config = require('./server_config.json');
const PORT = server_config.port;
const ALLOWED_ORIGIN_REGEXP = new RegExp(server_config.allowed_origins, "i");

// Serve HTML UI
app.use('/', express.static(__dirname + server_config.static_html));

app.use(compression());
app.use(bodyParser.json({
  type: "application/json"
}));


function isOriginAllowed(origin) { 
  return ALLOWED_ORIGIN_REGEXP.test(origin);
}

// Set CORS Headers if allowed
app.all('/deobfuscate', function(req, res, next) {
  if (isOriginAllowed(req.headers.origin)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  }
  next();
});

// Deobfuscate REST API
// expecting {source: "code"}
// returns {source: "new_code"}
app.post(server_config.rest_api_deobfuscate, function(req, res) {

  try {
    var ast = esprima.parse(req.body.source);
    try{
    ast = esmangle.optimize(ast, pass(), {
      destructive: true
    });
    }catch(e){
      console.error("[EE] Problem in mangling",e);
      console.error("[II] Mangle normalization were not performed due to errors. the code is going to be passed as it is to JSTillery");
    }
    esdeob.init();
    ast = esdeob.deobfuscate(ast, null, true);

    var reduced = escodegen.generate(ast, {
      comment: true
    });

    res.status(200);

    res.json({
      source: reduced
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: e
    })
  }
  res.end();
  return;
});


app.listen(PORT, function() {
  console.log(`Visit http://localhost:${PORT} or Submit POST to http://localhost:${PORT}/deobfuscate`);
});

