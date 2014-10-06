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
  conn.wsOpen();
  console.log(request);
  conn.wsSend(request);
}

function handle(data){
  if(data.action == "auth"){ 
    if(data.details!={}){
    	userInfo.id = data.details.id;
    	userInfo.name = data.details.name;
    	console.log(userInfo);
    }
    else{
    	conn.wsClose();
    }
  }
}     


