caribbeanWarApp.service('connection', function ($q, events) {
	var socketUrl = "ws://warm-crag-3328.herokuapp.com/ws";

	var result = {};

	var socket = null;	

	var deferred = null;

	result.open = function(credits){

		if(!connectionOpened()){
			
			deferred = $q.defer();

			try{
				socket = new WebSocket(socketUrl);
				
				socket.onopen = function() {
					console.log("Connection opened");
					deferred.resolve();
				};

				socket.onmessage = function(event){
					console.log(event.data);
					var data = angular.fromJson(event.data);
					events.emit(data.action, data.details);
				};

				socket.onerror = socket.onclose = function(e) {
					console.log(e);
					deferred.reject();
					events.emit("close", e);
				};
			}
			catch(e){
				console.log(e);
			}
		}
		return deferred.promise;
	};

	result.send = function(action, details){
		if (connectionOpened()) {
			try{
				console.log(envelopeMessage(action, details));
				socket.send(envelopeMessage(action, details));
			}
			catch(e){
				console.log(e);
			}			
		}
	};

	result.close = function(){
		if (connectionOpened()){
			socket.close();
		}
	};

	function connectionOpened() {
		return socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING);
	};

	function envelopeMessage(header, body){
		return angular.toJson({
			action:header,
			details:body
		});
	};

	return result;
});