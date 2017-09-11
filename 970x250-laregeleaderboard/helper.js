var helper = (function(){
  var my = {};
 /**
  * Builds header tags based on an array of strings that represent files to be loaded/referenced works with .js and .css
  * when all are done will call the given function with a BOOL value indicating success
  * @param {Array} arrayOfScripts - Array of files to add to the <head> as <script> or <link>
  * @param {Function} allLoadedCallBack - Function called once finished
  */
 my.loadScripts = function(arrayOfScripts, allLoadedCallBack) {
   var totalScriptsToLoad = arrayOfScripts.length;
   var amountOfScriptsLoaded = 0;
   var success = true;

   for (i = 0; i < totalScriptsToLoad; i++) {
     //fire off all the requests
     loadScript(arrayOfScripts[i], scriptLoaded)
   }

   function scriptLoaded(success) {
     amountOfScriptsLoaded++
     if (!success) {
       success = false
     }
     if (amountOfScriptsLoaded == totalScriptsToLoad) {
       allLoadedCallBack(success);
     }
   }

 }
 /**
  * Worker for loadScripts does the construction of the tags and calls back when done
  * @param {Array} path - Path to file to reference
  * @param {Function} callback - Function called once finished
  */
 loadScript = function(path, callback) {
   // used for clarity
   var success = true;
   var fail = false;
   // incase of double hits on onload and statechange
   var done = false;
   // ref to the new node
   var childNode;
   //get the last .ref this should indicate the file type
   var fileType = path.substring(path.lastIndexOf('.') + 1);

   if (fileType == "js") { //if filename is a external JavaScript file
     childNode = document.createElement('script');
     childNode.charset = "UTF-8"
     childNode.src = path;
   } else if (fileType == "css") { //if filename is an external CSS file
     childNode = document.createElement('link');
     childNode.href = path;
     childNode.type = 'text/css';
     childNode.rel = 'stylesheet';
   }

   // make sure childNode is set up and set its functions
   if (typeof childNode != "undefined") {

     childNode.onload = function() {
       if (!done) {
         done = true;
         callback(success);
       }
     };

     childNode.onreadystatechange = function() {
       var state;
       if (!done) {
         state = childNode.readyState;
         if (state === "complete") {
           done = true;
           callback(success);
         }
       }
     };

     childNode.onerror = function() {
       if (!done) {
         done = true;
         callback(fail);
       }
     };
     //set the node in the dom
     document.getElementsByTagName('head')[0].appendChild(childNode);
   } else {
     callback(fail);
   }
 }

 /**
  * Takes the path and downloads the file, then replaces the given node ID with the contents of the file
  * prefered format is .xml and must not contain <script> tags for security.
  * will call back the (callback) function with a BOOL value indicating success
  * @param {Array} path - Path to the file to GET
  * @param {Array} targetID - ID of node to replace
  * @param {Function} callback - Function called once finished
  */

 my.insertHtmlFile = function(path, targetID, callback) {

   /**
    * Create a browser dependant xml http object
    */

   function createRequestObject() {
     var obj;
     var browser = navigator.appName

     if (browser == "Microsoft Internet Explorer") {
       obj = new ActiveXObject("Microsoft.XMLHTTP");
     } else {
       obj = new XMLHttpRequest();
     }
     return obj;
   }

   var success = true;
   var fail = false;
   http = createRequestObject();
   http.open('get', path);
   http.onreadystatechange = function() {
     if (http.readyState == 4) {
       if (http.status == 200 || http.status == 0) {
         var response = http.responseText;
         //screen for <script> tags in the retrieved xml ~ is a bit wise inverter so -1 turns into 0
         if (~response.search(/<script/i)) {
           //report back that we had an error
           callback(fail);
         } else {
           //happy to load in the HTML
           try {
             //this looks to replace the node ID that was passed in
             var newNode = document.createElement('div');
             newNode.innerHTML = response;
             var oldNode = document.getElementById(targetID);
             var parentNode = oldNode.parentNode;
             parentNode.replaceChild(newNode.firstChild, oldNode);
           } catch (e) {
             //incase we fail
             callback(fail);
             return;
           }
           //report back that we are done
           callback(success);
         }
       } else {
         //report back that we had an error
         callback(fail);
       }
     }
   };
   /*
   http.ontimeout = function() {
     //report back that we had an error
     callback(fail);
   };
   */
   http.send(null);
 }
 
 return my;
 
})()