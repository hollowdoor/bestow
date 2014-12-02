(function(){
if(typeof module !== 'undefined' && module.exports){
    var bestow = require("../bestow.js");
}else{
    var bestow = {running: 'browser'};
}


var mod = {
    success: function(){
        console.log('Success!');
    }
};

if(bestow.running === 'node'){
    mod.send = bestow.createSender('testmodule.js', __dirname);
    mod.middleWare = bestow.createMiddleware('testmodule.js', __dirname);

    module.exports = mod;
}else{
    mod.alert = function(){
        alert('success');
    };
    window.mod = mod;
}
})();
