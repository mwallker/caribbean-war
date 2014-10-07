var userInfo = {
	id:false,
	name:false,
	cash:false
}

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

function handle(data){
	console.log(data);
	if(data.action == "auth"){ 
		if(data.details!="{}"){
			userInfo.id = data.details["ID"];
    		userInfo.name = data.details["Email"];
    		userInfo.cash = data.details["Cash"];
    		console.log(userInfo);
    	}
    	else{
    		conn.wsClose();
    	}
  	}
}     


