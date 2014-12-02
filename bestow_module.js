(function(_global){
"use strict";
if(typeof module !== 'undefined' && module.exports){
    
    if(_global.global_module_object === undefined && _global.require === undefined){
        
        
        _global.__global_module_object = {
            cache: {},
            exports: null
        };
        
        _global.require = function(file, useAsync){
            var httpRequest, fn;
            if (window.XMLHttpRequest) { // Mozilla, Safari, ...
              httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) { // IE
              try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
              } 
              catch (e) {
                try {
                  httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } 
                catch (e) {}
              }
            }
            
            
            
            //Start the actual request.
            if (!httpRequest) {
              alert('Giving up :( Cannot create an XMLHTTP instance');
              return false;
            }
            
            httpRequest.open('GET', file, false);  // `false` makes the request synchronous
            httpRequest.send(null);
            
            if(httpRequest.status === 200){
                
                fn = new Function(module, httpRequest.responseText);
                
                if(__global_module_object.cache[file] === undefined){
                    
                    fn(__global_module_object);
                    __global_module_object.cache[file] = module.exports;
                }
                
                return __global_module_object.cache[file];
            }
        };
    }
    
    
}

})(this);
