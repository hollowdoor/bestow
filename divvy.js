(function(_global){
"use strict";
var running = null,
    divvy = {},
    stack = [];



function establishEnv(){
    if(typeof module !== 'undefined' && module.exports){
        divvy.running = 'node';
        _global = GLOBAL;
    }else{
        divvy.running = 'browser';
        _global = window;
    }
}

establishEnv();


divvy.createSender = function(){};
divvy.toMiddleWare = function(){};
divvy.send = function(){};
divvy.middleWare = function(){};

if(divvy.running === 'node'){
    
    var fs = require('fs'),
        path = require('path'),
        url = require('url');
    
    divvy.createSender = function(thisname, pathname){
        
        if(divvy.running !== 'node')
            return function(){};
        
        pathname = pathname || request.resolve(thisname);
        return function(req, res, options){
            
            var root = (options.root) ? options.root : '/',
                basename = path.basename(req.url),
                dirname = path.dirname(url.parse(req.url).pathname),
                modulename = path.join(pathname, thisname);
            
            if(thisname !== basename)
                return false;
            if(root !== dirname)
                return false;
            
            var readstream = fs.createReadStream(modulename);
            
            res.setHeader('content-type', 'application/javascript');
            readstream.pipe(res).on('error', function(e){
                res.writeHead(500);
                res.end('500 Internal server error.');
                console.log(thisname+' javascript stream failed. 500 error was sent.');
            });
            
            return true;
                
        };
    };
    
    divvy.createMiddleWare = function(name, getdirname){
        
        if(divvy.running !== 'node')
            return function(){};
        
        var sender = divvy.createSender(name, getdirname);
        
        return function(options){
            
            return function(req, res, next){
                
                var sent = sender(req, res, options);
                
                if(!sent)
                    next();
            };
        };
    };
    
    divvy.send = divvy.createSender('divvy.js', __dirname);
    divvy.middleWare = divvy.createMiddleWare('divvy.js', __dirname);
}


switch(divvy.running){
    case 'node': module.exports.divvy = divvy; break;
    case 'browser': _global.divvy = divvy; break;
}


})(GLOBAL || this);
