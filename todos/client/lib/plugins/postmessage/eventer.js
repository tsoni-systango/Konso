var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

postMessageParent = function(message, domain){
    window.parent.postMessage(message, domain || "*");
}
listenMessageParent = function(callback){
    window.parent[eventMethod](messageEvent, callback, false);
}
