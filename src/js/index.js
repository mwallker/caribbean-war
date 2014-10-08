// USER DATAS
var userInfo = {
	id:false,
	nickname:false,
	email:false,
	cash:false,
	ship:[]
}

var conn = new Connector();

function authorize(credits){
	//Simpe validation
	if(credits.login && credits.password){
		credits.password = CryptoJS.SHA256(credits.password).toString();
		conn.wsOpen(envelopeRequest("auth",credits));
	}
	else{
		$("#login-layout").trigger({
			type:"auth-fail",
			info:"Empty email or password"
		});
	}
}

function sendChatMessage(message){
	if(userInfo.id){
		conn.wsSend(envelopeRequest("chat", message));
	}
}

function envelopeRequest(header, body){
	return JSON.stringify({
		action:header,
		details:body
  	});
}


// INCOMMING MESSAGES EVENT HANDLE: 
function handle(data){
	console.log(data);

	if(data.action){
		$("body").trigger({
			type:data.action,
			details:data.details
		});
	}	
} 

//AUTH. SCREEN LOGIC CONTROL
$("body").on("auth", function(event){
	console.log(event.details);
	if(event.details!="{}"){
		userInfo.id = event.details["ID"];
    	userInfo.name = event.details["Email"];
    	userInfo.nickname = event.details["Nick"];
    	userInfo.cash = event.details["Cash"];
    	console.log(userInfo);
    	$("#lobby-layout").trigger({
    		type:"load-lobby"
    	});
    }
    else{
    	$("#login-layout").trigger({
			type:"auth-fail",
			info:"No user found"
		});
		conn.wsClose();
    }
});

//CHAT LOGIC CONTROL
$("body").on("chat", function(event){
	if(userInfo.id){
		$("#chat-layout").trigger({
			type:"incoming",
			info:event.details
		});
	}	
});
