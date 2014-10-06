//A Singlton class to avoid set of connection
function Connector() {
	if(arguments.callee._singletonInstance){
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	var ws = false;
	var local = "ws://localhost:5000/";
	var host = "ws://safe-bayou-1072.herokuapp.com/";
	var host2 = "ws://warm-crag-3328.herokuapp.com/ws";

	//Open WebSocket connection
	this.wsOpen = function(){
  		if(!ws){
  			ws = new WebSocket(local);
			
			ws.onopen = function(event){
				console.log("Connected to server");
			};

			ws.onmessage = function (event) {
				try{
	    			var data = JSON.parse(event.data);
	  				console.log(data);
	  				handle(data);
				}catch(e){
					console.log(e);
				}
			};

			ws.onclose = function(){
				ws = false;
				console.log("Connection closed");
			};

			ws.onerror = function(){
				ws = false;
				console.log("connection failed");
			}
		}	
  	}

  	//Close Websocket connection
  	this.wsClose = function(){
  		console.log("Closing...");
  		if(ws){
  			ws.close();
  		}
  	}

  	//Method to send JSON object throuth the WebSockets
	this.wsSend = function(data) {
		if(ws){
			ws.send(data);
		}
		else{
			return false;
		}
	}
}