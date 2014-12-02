
# Bestow

Bestow is destributed with an MIT license.

## Send modules to the browser as code.

**This project is mostly for my personal use. If someone decides that they want to use this module it is publicly available. You can use it at your own risk. For now you should consider this module experimental, and it's interface may change in the future.**

**Being that bestow serves a purpose shared by tools like Browserfiy it will work only in certain situations, and may not work for your use case. bestow is not meant to replace other tools. You should use what fits your use case, what works, or what you like to use. bestow is just another option.**

## Explanation

I've grappled with the idea of using scripts both server side, and client side. There are some basic things one can do.

* Have two files.
  1. One for the client.
  2. One for the server.
* Add to exports in node, or window in the browser.
  1. Use a check to see if node is the environment.
  2. Check if the browser is the environment.
* Use two totally different scripts for the same purpose in both environments.
* Use a tool like browserify.
* Don't use Javascript in the server.
* Don't use Javascript in the browser.

Some of the above are non-solutions. Others are solutions that are used frequently enough to almost be standard/best practices. I'll let you decide which is which.

Bestow is a module that fulfills that need for reducing repetition for what seems common methods used to accomplish browser, or server compatibilty. It brings it's interface to the module, and application level to accompish this.

## A Warning

Node has it's special code. This special code relies on compiled C++ to accomplish what javascript can't do. If a module relies on those C++ codes it will not work with bestow. You should see undefined errors for those modules that do use C++. In some cases you may be able to replace those modules with a paritally compatible browser implementaion.

Node has a lot of modules that can work in the browser already. The purpose of bestow isn't to support those modules. Maybe in the future there can be a flag that a developer can set to allow bestow support, or some other method can be used to make modules compatible.

These problems can be solved in one's own modules using ajax, or sockets, but there's no guarantee that any publicly available modules will try those solutions, or even be using bestow.

For now bestow can be used to load scripts that are modules using bestow methods. The documentation explains how this can be accompished for a module.



## Making a script ready for bestow

You can just use the bestow methods to make a script work browser side, but there are some things you can do to make a script work better. Here are those things.

Wrap your whole script in a self invoking function that looks like this.

```
(function(_global){
"use strict";
/*My code here*/
}(GLOBAL /*node's global*/ || window));
```

Use `"use strict";` in your self invoking function if you like what it provides. I suggest using it because it's helpful in many situations.

**Handling exports properly.**

You're going to want to export, and send your code to the browser so you want to do this. **bestow does nothing to help your objects be exposed to the environment so you have to do this yourself. bestow is for making modules static.**

```
(function(_global){
"use strict";
if(typeof module !== 'undefined' && module.exports){
    var bestow = require('bestow');
}

var MyObject = {};
/*My code here*/
//Check if we're in node.
if(bestow.running === 'node'){
    module.exports = MyObject;
}else{
    //Attache my object to the browser instead.
    window.MyObject = MyObject
}
}(GLOBAL /*node's global*/ || window));
```

`bestow.running` is redundant because of the first module check, and you'd have to send bestow to the browser to use it so you can just use your own check.

```
(function(_global, usingNode){
"use strict";
if(usingNode){
    var bestow = require('bestow');
}

var MyObject = {};
/*My code here*/
//Check if we're in node.
if(usingNode){
    module.exports = MyObject;
}else{
    //Attache my object to the browser instead.
    window.MyObject = MyObject
}
}(GLOBAL /*node's global*/ || window, (typeof module !== 'undefined' && module.exports));
```

## API Documentation

### bestow.createSender

`bestow.createSender(name[string], dirname[__dirname|string], options[{}]);`

bestow.createSender produces a function that can be used with the request, and response variables
created by a node server.

###Creating a sender

```
if(usingNode){
    var bestow = require('bestow');
}

var myModule = {};

if(usingNode){
    //A new sender is created.
    myModule.send = bestow.createSender('mymodule.js', __dirname);
    module.exports = myModule;
}
```

###Using the sender

```
var http = require('http'),
    mymodule = require('mymodule.js');


var server = http.createServer(function(req, res){
    
    //Try to send the module static.
    var testing = mymodule.send(req, res);
    
    if(!testing.success){
        //do something else
    }
});

server.listen(8080);
```

In your html file.

```
<!DOCTYPE html>
<html>
<head>
<script src="mymodule.js"></script>
</head>
<body>
<script>
//You can use your module script methods, and properties on the client side now.
</script>
</body>
</html>
```

### bestow.createMiddleWare

`bestow.createMiddleware(name[string], dirname[__dirname|string], options[{}])`

bestow.createMiddleware has the same signature as bestow.createSender.

The only difference is the createMiddleware function creates a function that is compatible
with express, or any middle ware using object that sends request, response, and next variables to middleware.

### Create Middleware

```
if(usingNode){
    var bestow = require('bestow');
}

var myModule = {};

if(usingNode){
    //A new sender is created.
    myModule.middleware = bestow.createMiddleware('mymodule.js', __dirname);
    module.exports = myModule;
}
```

### Use Middleware

```
var express = require('express')
    mymodule = require('mymodule.js');

var app = express();

//If a mymodule.js is used in the browser no other gets are used.
app.use(mymodule.middleware());

app.get('apath', function(req, res){
    //do something else
});
```

In your html file.

```
<!DOCTYPE html>
<html>
<head>
<script src="mymodule.js"></script>
</head>
<body>
<script>
//You can use your module script methods, and properties on the client side now.
</script>
</body>
</html>
```
