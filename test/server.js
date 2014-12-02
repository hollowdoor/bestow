
var bestow = require('../bestow.js'),
    fs = require('fs'),
    path = require('path');

var server = bestow.testServer(require('./testmodule.js'), function(req, res){
    
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
