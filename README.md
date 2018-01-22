# JStillery

Advanced JS Deobfuscation via Partial Evaluation.


See http://blog.mindedsecurity.com/2015/10/advanced-js-deobfuscation-via-ast-and.html 

# Install

```
npm install
```

# Usage

## Cli

Deobfuscate file:
```
 ./jstillery_cli.js filename
```
Deobfuscate from stdin
```
echo 'a= String.fromCharCode(41);b=a'|  ./jstillery_cli.js
```

## Server
If you wish change ```server/config_server.json```
Then launch the server:
```
npm start
```
Visit http://0:3001/

## RESTServer
Launch server then:
```
$ curl 'http://localhost:3001/deobfuscate' -d '{"source":"a=1"}' -H 'Content-type: application/json' 
{"source":"a = 1;"}
```

# LICENSE

GPL 3.0

# Contribute

Feel free to contribute in any way!
