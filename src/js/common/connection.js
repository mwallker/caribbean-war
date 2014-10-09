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