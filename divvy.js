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
divvy.proxy = function(){};

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
            
            for(var n in opts){
                if(!n in options){
                    options[n] = opts[n];
                }
            }
            
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
            success.method = req.method;
            
            if(req.method !== 'GET')
                return success;
            
            if(thisname !== basename)
                return success;
            
            if(root !== dirname)
                return success;
            
            var readstream = fs.createReadStream(modulename);
            
            res.setHeader('content-type', 'application/javascript');
            
            if(options.before)
                options.before(success);
            
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
            
            if(options.after)
                options.after(success);
            
            success.success = true;
            return success;
                
        };
    };
    
    divvy.createMiddleware = function(name, getdirname){
        
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
    divvy.middleWare = divvy.createMiddleware('divvy.js', __dirname);
    
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
    
    divvy.proxy = function(options){
        
        var http = require('http'),
            fs = require('fs'),
            path = require('path'),
            mime = require('mime'),
            stackSave = [],
            errorList = [];
        
        var fn = function(req, res){
            
            req.errorList = [];
            
            var stack = stackSave.concat([]);
            
            stack.push(function(req, res, next){
                http.request(options).pipe(res);
            });
            
            var index = -1;
            
            var next = function(err){
                ++index;
                                
                if(index < stack.length){
                    
                    if(err && stack[index].length === 4)
                        stack[index](err, req, res, next);
                    else if(stack[index].length === 3)
                        stack[index](req, res, next);
                }
                
            };
            
            next();
        };
        
        fn.use function(fn){
            if(fn.handle)
                stackSave.push(fn.handle);
            else
                stackSave.push(fn);
        };
        
        fn.staticFolder = function(name, actualname){
            
            actualname = actualname || name;
            
            return function(req, res, next){
                
                var pathname = url.parse(req.url).pathname,
                    dirname = path.dirname(pathname),
                    filename = path.join(actualname, path.basename(pathname));
                
                if(req.method !== 'GET')
                    return next();
                if(dirname !== name)
                    return next();
                
                fs.exists(filename, function(exists){
                    
                    if(!exists)
                        next();
                    
                    var mimetype = mime.lookup(filename);
                        
                    res.setHeader('content-type', mimetype);
                    
                    var readstream = fs.createReadStream(filename);
                    
                    readstream.pipe(res).on('error', function(e){
                
                        res.writeHead(500);
                        res.end();
                    });
                }
            };
        };
        
        return fn;
        
    };
}


switch(divvy.running){
    case 'node': module.exports = divvy; break;
    case 'browser': _global.divvy = divvy; break;
}


})(GLOBAL || this);
