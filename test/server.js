
var divvy = require('../divvy.js'),
    fs = require('fs'),
    path = require('path');

var server = divvy.testServer(require('./testmodule.js'), function(req, res){
    
    console.log('req.url ', req.url);
    
    if(path.basename(req.url) === 'test.html'){
        fs.readFile(path.join(__dirname,'/test.html'), 'utf8', function(err, text){
            if(err){
                res.end(err.message);
                return;
            }
            
            res.end(text);
        });
    }
});

server.listen(8080);
/*var http = require('http'),
    test = require('./testmodule.js'),
    fs = require('fs'),
    path = require('path');


var server = http.createServer(function(req, res){
    
    var testing = test.send(req, res);
    
    console.log('testing.success ', testing.success);
    if(!testing.success){
        console.log('no send');
        if(path.basename(req.url) === 'test.html'){
            fs.readFile(path.join(__dirname,'/test.html'), {encoding: 'utf-8'}, function(err, text){
                if(err){
                    res.end(err.message);
                    return;
                }
                
                res.end(text);
            });
        }
    }
});

server.listen(8080);*/
