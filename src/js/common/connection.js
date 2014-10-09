var connection = (function () {
	var ws = false;
	var local = "ws://localhost:5000/";
	var host = "ws://warm-crag-3328.herokuapp.com/ws";

	var result = {}

	//Open WebSocket connection
	result.open = function(request){
  		if(!ws){
  			ws = new WebSocket(host);
			
			ws.onopen = function(event){
				console.log("Connected to server");
				ws.send(request);
			};

			ws.onmessage = function (event) {
				try{
	    			var data = JSON.parse(event.data);
	  				console.log(data);
				}catch(e){
					console.log(e);
				}
			};

			ws.onclose = function(event){
				ws = false;
				console.log(event);
			};

			ws.onerror = function(){
				ws = false;
				console.log("connection failed");
			}
		}	
  	}

  	//Close Websocket connection
  	result.close = function(){
  		console.log("Closing...");
  		if(ws){
  			ws.close();
  		}
  	}

  	//Method to send JSON object throuth the WebSockets
	result.send = function(data) {
		if(ws){
			ws.send(data);
			console.log("Send: "+data);
		}
		else{
			return false;
		}
	}

	return result;
})();


angular.module('caribbean-war').service('connection', function ($q) {
	var socketUrl = "ws://warm-crag-3328.herokuapp.com/ws";

	var exports = Object.create(require('events').EventEmitter.prototype);

	var socket = null;
	var defer = null;

	var getSocket = function () {
		if (!connectionOpened()) {
			defer = $q.defer();
			try {
				socket = new WebSocket(socketUrl);
				socket.onopen = function() {
					defer.resolve(socket);
					socket.onmessage = onmessageCallback;
				};
				socket.onerror = function(e) {
					exports.emit('connectionError');
				};
				socket.onclose = function(e) {
					exports.emit('connectionError');
				};
			} catch (message) {
				exports.emit('connectionError');
			}
		}
		return defer.promise;
	};

	var connectionOpened = function () {
		return socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING);
	};

	var onmessageCallback = function (message) {
		var data = angular.fromJson(message.data);
		exports.emit(data.action, data.details);
	};

	exports.send = function (type, data) {
		getSocket().then(function(socket) {
			socket.send(angular.toJson({
				action: type,
				details: data
			}));
		});
		return this;
	};
	return exports;
});