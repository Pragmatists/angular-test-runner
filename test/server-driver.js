
window.http = http;

function http(){

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.respondImmediately = true;
  
  var that = {
    post: method('POST'),
    get: method('GET'),
    delete: method('DELETE'),
    put: method('PUT'),
    stop: function(){
      server.restore();
    }
  };
  
  return that;
  
  function method(type){
    return function(url, handler){
      server.respondWith(type, url, function(req){
        handler(wrap(req));
      });
      return that;
    };
  }
}

function wrap(req){
  return {
    body: function(){
      return JSON.parse(req.requestBody);
    },
    sendJson: function(json){
      req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(json));
    }
  };
}