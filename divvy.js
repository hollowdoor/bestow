(function(_global){
var running = null,
    divvy = {},
    stack = [];

var fs, path, url; //node specific

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

if(divvy.running === 'node'){
    fs = require('fs');
    path = require('path');
    url = require('url');
}

divvy.toMiddleWare = function(){};
if(divvy.running === 'node'){
    divv.createSender = function(name){
        
        return function(req, res, options){
            options = options || {};
            
        };
    };
    
    divvy.toMiddleWare = function(name){
        return function(){
            
            return function(req, res, next){
                var basename = path.basename(req.url);
                var modulename = require.resolve(name);
                
                if(moduleName !== basename){
                    return next();
                }
                
                fs.readFile(modulename, 'utf8', function(err, text){
                    if(err) return next(err);
                    if(!text) return next();
                    res.send(text);
                });
            };
        
        };
    };
}

switch(divvy.running){
    case 'node': module.exports.divvy = divvy; break;
    case 'browser': window.divvy = divvy; break;
}


})(this);
