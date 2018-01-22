var DEBUGNAME = __filename.slice(__dirname.length+1,-3);
var debug = require('util').debuglog(DEBUGNAME);

var pass = require("esmangle").pass;
var estraverse = require("estraverse");
var escode = require("escodegen");



function createPipeline() {
  var pipeline;

 // Original ESMangle pipeline, each pipe is commented out if not needed.
 // left for doc and didactical purpose.
  pipeline = [
  // Nope, on the contrary we dont' want it
  // 'pass/concatenate-variable-definition', 

  // Don't think so...
  // 'pass/eliminate-duplicate-function-declaration',
  
  /* No
    (function (a,b){var t=0})(2,"ss") 
    (function (a,b,t){t=0})(2,"ss") */
  // 'pass/hoist-variable-to-arguments',

  /*Yep, actually we already do that..*/
  'pass/transform-dynamic-to-static-property-access', 
  
  /* Maybe yes,trasforms x["xxxx"] to x.xxxx */
  'pass/transform-dynamic-to-static-property-definition', //Mah.. {"xxx":"f"} in {xxx:"f"}

  /*____*/
  // 'pass/transform-immediate-function-call', //???
  
  /*No. It transforms
    a && (b && c) => (a && b) && c
    a || (b || c) => (a || b) || c 
  */
  // 'pass/transform-logical-association',
  
  /*
    Yep! function hoisting.
  */
  'pass/reordering-function-declarations',
  
  /*
    No, we dont know how they are implemented..
    Better leave them.
  */
  // 'pass/remove-unused-label', 

  /*Dunno.., removes if(){}else{empty} or similar*/
  // 'pass/remove-empty-statement', 

  /*Yep, removes useless BlockStatement and flatten + minimize the subtree*/
  'pass/remove-wasted-blocks',

  /* //No, a = a + b > a += b*/
  // 'pass/transform-to-compound-assignment',

  //Nope, sequence expression are harder
  // 'pass/transform-to-sequence-expression', 

  //No, if-then-else to (T)?X:Y
  // 'pass/transform-branch-to-expression',

  // not important, if(c==undefined ) or similar in typeof c ==="undefined"
  // 'pass/transform-typeof-undefined',
  
  // Yes, most of all have a look at it for nested assignments 
  // useful for d=(t=9)+(b=4)
  // which becomes d=(t=9,t)+XXX
  // so: t=9 , d=9+XXX problem, it does not always work 
  'pass/reduce-sequence-expression', 

  //Dunno, operates on if(){return..}
  // 'pass/reduce-branch-jump', 
  
  // Mm, useless? 
  // 'pass/reduce-multiple-if-statements', 
  
  // No, could eliminate FP
  // 'pass/dead-code-elimination', 
  
  //Mah.. I would like to transform all Sequences
  // 'pass/remove-side-effect-free-expressions', 
  
  /*____*/
  // 'pass/remove-context-sensitive-expressions', //??

  // We already do that
  // 'pass/tree-based-constant-folding', 
  
  //No,removes "unused" var e fun 
  // could remove FP
  // 'pass/drop-variable-definition', 

  //Don't think we need it. Tests & removes the branch when if(cond) is contstant
  // 'pass/remove-unreachable-branch'
  ];

  pipeline = [pipeline.map(pass.require)];
  
  return pipeline;
}

exports.createPipeline = createPipeline