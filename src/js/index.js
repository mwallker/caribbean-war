// +--------------------+
// | 	USER DATAS 		|
// +--------------------+
var userInfo = {
	id:false,
	name:false,
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
		$(".auth-form").trigger({
			type:"auth-fail",
			info:"Empty email or password"
		});
	}
}

function envelopeRequest(header, body){
	return JSON.stringify({
		action:header,
		details:body
  	});
}


// +----------------------------------+
// | INCOMMING MESSAGES EVENT HANDLE: |
// +----------------------------------+
function handle(data){
	console.log(data);

	if(data.action){
		$("body, html").trigger({
			type:data.action,
			details:data.details
		});
	}	
}  

$("body, html").on("auth", function(event){
	console.log(event.details);
	if(event.details!="{}"){
		userInfo.id = event.details["ID"];
    	userInfo.name = event.details["Email"];
    	userInfo.cash = event.details["Cash"];
    	console.log(userInfo);
    	$(".auth-form").trigger({
    		type:"auth-succeed"
    	});
    }
    else{
    	$(".auth-form").trigger({
			type:"auth-fail",
			info:"No user found"
		});
		conn.wsClose();
    }
});

