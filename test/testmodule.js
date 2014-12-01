var divvy = require("../divvy.js").divvy;



var mod = {
    print: function(res, text){
        res.end(text);
    },
    success: function(){
        console.log('Success!');
    }
};
console.log(divvy);
mod.send = divvy.createSender('divvy.js', __dirname);
mod.middleWare = divvy.createMiddleWare('divvy.js', __dirname);

module.exports = mod;
