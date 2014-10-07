// +--------------------+
// | 	USER DATAS 		|
// +--------------------+
var userInfo = {
	id:false,
	name:false,
	cash:false,
	ship:{

	}
}

// +----------------------+
// | INPUT EVENTS HANDLE: |
// +----------------------+
var conn = new Connector();

function auth(credits){
	var request = JSON.stringify({
		action:"auth",
		details:{
			login:credits.login||"",
			password:CryptoJS.SHA256(credits.password).toString()
    	}
  	});
  	console.log("Open with param: "+request);
	conn.wsOpen(request);
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
	if(data.details!="{}"){
		userInfo.id = data.details["ID"];
    	userInfo.name = data.details["Email"];
    	userInfo.cash = data.details["Cash"];
    	console.log(userInfo);
    }
    else{
    	conn.wsClose();
    }
});

