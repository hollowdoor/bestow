var divvy = require("../divvy.js");

var mod = {
    print: function(res, text){
        res.end(text);
    },
    success: function(){
        console.log('Success!');
    }
};

mod.send = divvy.createSender('divvy.js', __dirname);
mod.middleWare = divvy.createMiddleWare('divvy.js', __dirname);

module.exports = mod;
