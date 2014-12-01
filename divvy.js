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
                sender = {sending: false};
            
            sender.basename = basename;
            sender.module = thisname;
            sender.moduleName = thisname;
            sender.thisname = thisname;
            sender.root = root;
            sender.dirname = dirname;
            sender.method = req.method;
            
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
            return sender;
                
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
                
                if(!sent.sending)
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
            
            console.log(testing.moduleName+'.success = ', testing.sending);
            
            if(!testing.sending){
                
                console.log(testing.moduleName+'.success = ', testing.sending);
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
