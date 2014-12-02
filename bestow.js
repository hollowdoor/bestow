(function(_global){
"use strict";
var bestow = {};



function establishEnv(){
    if(typeof module !== 'undefined' && module.exports){
        bestow.running = 'node';
    }else{
        bestow.running = 'browser';
    }
}

establishEnv();


bestow.createSender = function(){
    return function(){};
};
bestow.toMiddleWare = function(){
    return function(){};
};
bestow.send = function(){};
bestow.middleWare = function(){};
bestow.testServer = function(){};
bestow.proxy = function(){};

if(bestow.running === 'node'){
    
    var fs = require('fs'),
        path = require('path'),
        url = require('url');
    
    bestow.createSender = function(thisname, pathname, options){
        
        var opts = options || {};
        
        var mname = path.join(pathname, thisname);
        
        fs.exists(mname, function(exists){
            if(!exists){
                throw new Error('bestow.createSender Error: arguments resolve to '+
                mname+' which does not exist.');
            }
        });
        
        
        if(bestow.running !== 'node')
            return function(){};
        
        try{
            pathname = pathname || request.resolve(thisname);
        }catch(e){
            throw new Error('bestow.createSender Error: '+thisname+' can not be resolved.');
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
                sender = {sending: false};
            
            sender.basename = basename;
            sender.module = thisname;
            sender.moduleName = thisname;
            sender.thisname = thisname;
            sender.root = root;
            sender.dirname = dirname;
            sender.method = req.method;
            //TODO add querystring to sender
            
            if(req.method !== 'GET')
                return sender;
            
            if(thisname !== basename)
                return sender;
            
            if(root !== dirname)
                return sender;
            
            var readstream = fs.createReadStream(modulename);
            
            
            sender.readStream = readstream;
            
            res.setHeader('content-type', 'application/javascript');
            
            if(options.before)
                options.before(sender);
            
            if(options.after){
                readstream.on('end', function(){
                    options.after(sender);
                });
            }
            
            readstream.pipe(res);
            
            sender.sending = true;
            
            return Object.create(sender);
                
        };
    };
    
    bestow.createMiddleware = function(name, getdirname){
        
        if(bestow.running !== 'node')
            return function(){};
        
        try{
            var sender = bestow.createSender(name, getdirname);
        }catch(e){
            throw new Error('bestow.createMiddleWare Error: Can not create sender.');
            console.log(e.message);
        }
        
        return function(options){
            
            return function(req, res, next){
                
                var sent = sender(req, res, options);
                
                if(!sent.sending)
                    next();
            };
        };
    };
    
    
    bestow.send = bestow.createSender('bestow.js', __dirname);
    bestow.middleWare = bestow.createMiddleware('bestow.js', __dirname);
    
    bestow.testServer = function(test, cb){
        
        var http = require('http'),
            fs = require('fs'),
            path = require('path');
        
        return http.createServer(function(req, res){
            
            try{
                var testing = test.send(req, res);
            }catch(e){
                console.log(e.message);
            }
            
            console.log(testing.moduleName+'.success = ', testing.sending);
            
            if(!testing.sending){
                
                console.log(testing.moduleName+'.success = ', testing.sending);
                cb(req, res);
            }
        });
    };
    
}


switch(bestow.running){
    case 'node': module.exports = bestow; break;
    case 'browser': _global.bestow = bestow; break;
}


})(GLOBAL || this);
