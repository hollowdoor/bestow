(function(){
if(typeof module !== 'undefined' && module.exports){
    var divvy = require("../divvy.js");
}else{
    var divvy = {running: 'browser'};
}


var mod = {
    success: function(){
        console.log('Success!');
    }
};

if(divvy.running === 'node'){
    mod.send = divvy.createSender('testmodule.js', __dirname);
    mod.middleWare = divvy.createMiddleware('testmodule.js', __dirname);

    module.exports = mod;
}else{
    mod.alert = function(){
        alert('success');
    };
    window.mod = mod;
}
})();
