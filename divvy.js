(function(_global){
"use strict";
var divvy = {};



function establishEnv(){
    if(typeof module !== 'undefined' && module.exports){
        divvy.running = 'node';
    }else{
        divvy.running = 'browser';
    }
}

establishEnv();


divvy.createSender = function(){
    return function(){};
};
divvy.toMiddleWare = function(){
    return function(){};
};
divvy.send = function(){};
divvy.middleWare = function(){};
divvy.testServer = function(){};

if(divvy.running === 'node'){
    
    var fs = require('fs'),
        path = require('path'),
        url = require('url');
    
    divvy.createSender = function(thisname, pathname, options){
        
        var opts = options || {};
        
        var mname = path.join(pathname, thisname);
        
        fs.exists(mname, function(exists){
            if(!exists){
                throw new Error('divvy.createSender Error: arguments resolve to '+
                mname+' which does not exist.');
            }
        });
        
        
        if(divvy.running !== 'node')
            return function(){};
        
        try{
            pathname = pathname || request.resolve(thisname);
        }catch(e){
            throw new Error('divvy.createSender Error: '+thisname+' can not be resolved.');
        }
        
        return function(req, res, options){
            
            options = options || {};
            
            var root = (options.root) ? options.root : '/',
                basename = path.basename(req.url),
                dirname = path.dirname(url.parse(req.url).pathname),
                modulename = path.join(pathname, thisname),
                success = {success: false};
            
            success.basename = basename;
            success.module = thisname;
            success.thisname = thisname;
            success.root = root;
            success.dirname = dirname;
            
            if(thisname !== basename)
                return success;
            if(root !== dirname)
                return success;
            
            var readstream = fs.createReadStream(modulename);
            
            res.setHeader('content-type', 'application/javascript');
            
            readstream.pipe(res).on('error', function(e){
                res.writeHead(500);
                
                if(!options.errorPage){
                    res.end('500 Internal server error.');
                }else{
                    fs.readFile(options.errorPage, 'utf8' , function(err, text){
                        if(err)
                            console.log(err); return;
                        res.end(text);
                    });
                }
                console.log(thisname+' javascript stream failed. 500 error was sent.');
            });
            
            success.success = true;
            return success;
                
        };
    };
    
    divvy.createMiddleWare = function(name, getdirname){
        
        if(divvy.running !== 'node')
            return function(){};
        
        try{
            var sender = divvy.createSender(name, getdirname);
        }catch(e){
            throw new Error('divvy.createMiddleWare Error: Can not create sender.');
            console.log(e.message);
        }
        
        return function(options){
            
            return function(req, res, next){
                
                var sent = sender(req, res, options);
                
                if(!sent.success)
                    next();
            };
        };
    };
    
    divvy.send = divvy.createSender('divvy.js', __dirname);
    divvy.middleWare = divvy.createMiddleWare('divvy.js', __dirname);
    
    divvy.testServer = function(test, cb){
        
        var http = require('http'),
            fs = require('fs'),
            path = require('path');
        
        return http.createServer(function(req, res){
            
            try{
                var testing = test.send(req, res);
            }catch(e){
                console.log(e.message);
            }
            
            console.log(testing.module+'.success = ', testing.success);
            
            if(!testing.success){
                
                console.log(testing.module+'.success = ', testing.success);
                cb(req, res);
            }
        });
    };
}


switch(divvy.running){
    case 'node': module.exports = divvy; break;
    case 'browser': _global.divvy = divvy; break;
}


})(GLOBAL || this);
