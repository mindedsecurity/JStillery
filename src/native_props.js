var natives={
  "Object":["__proto__","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__",
        "constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable",
        "toLocale","to","valueOf"],

  "Array" :["__proto__","concat","every","filter","forEach", "indexOf","join","lastIndexOf","length",
         "map","pop","push","reduce", "reduceRight","reverse","shift","slice",
         "some","sort","splice","unshift"],

  "Number":["__proto__","toExponential","toFixed","toPrecision"],

  "String":["__proto__","anchor","big","blink","bold","charAt","charCodeAt","concat","fixed",
            "fontcolor","fontsize","indexOf","italics","lastIndexOf","length","link","localeCompare",
          "match","replace","search","slice","small","split","strike","sub",
          "substr","substring","sup","toLocaleLowerCase","toLocaleUpperCase","toLowerCase",
          "toUpperCase","trim","trimLeft","trimRight"],

  "Function":["__proto__","apply","arguments","bind","call","caller","length","name"],

}

/* 
var nativesChain={
  "Object":["__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__",
        "constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable",
        "toLocale","to","valueOf"],

  "Array" :[{type:"Identifier",name:"concat"},
           {type:"Identifier",name:"every"},
           {type:"Identifier",name:"filter"},
           {type:"Identifier",name:"forEach"},
           {type:"Identifier",name: "indexOf"},
           {type:"Identifier",name:"join"},
           {type:"Identifier",name:"lastIndexOf"},
           {type:"Identifier",name:"length"},
       {type:"Identifier",name:"map"},
       {type:"Identifier",name:"pop"},
       {type:"Identifier",name:"push"},
       {type:"Identifier",name:"reduce"},
       {type:"Identifier",name: "reduceRight"},
       {type:"Identifier",name:"reverse"},
       {type:"Identifier",name:"shift"},
       {type:"Identifier",name:"slice"},
       {type:"Identifier",name:"some"},
       {type:"Identifier",name:"sort"},
       {type:"Identifier",name:"splice"},
       {type:"Identifier",name:"unshift"}],

  "Number":["toExponential","toFixed","toPrecision"],

  "String":["anchor","big","blink","bold","charAt","charCodeAt","concat","fixed",
            "fontcolor","fontsize","indexOf","italics","lastIndexOf","length","link","localeCompare",
          "match","replace","search","slice","small","split","strike","sub",
          "substr","substring","sup","toLocaleLowerCase","toLocaleUpperCase","toLowerCase",
          "toUpperCase","trim","trimLeft","trimRight"],

  "Function":["apply","arguments","bind","call","caller","length","name"],
  
}
var protoChain={ "array":{"__proto__":"Array","constructor":"Array"},
             "Array":{"prototype":"Self","constructor":"Function"},

         "object":{"__proto__":"Object","constructor":"Object"},
         "Object":{"prototype":"Self","constructor":"Function"},

         "function":{"__proto__":"Function","prototype":"Object","constructor":"Function"},
         "Function":{"prototype":"Self","constructor":"Function"},

        }
*/
exports.natives=natives;