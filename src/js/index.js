var userInfo = {
  id:false,
  name:false,
  cash:false
}

var conn = new Connector();

function connect(){
  console.log("Trying to connect...");
  conn.wsOpen();
}

function closer(){
  console.log("Trying to close...");
  conn.wsClose();
}

function auth(){
  var responce = {
    action:"auth",
    details:{
      login:"mwallker@mail.com",
      password:CryptoJS.SHA256("12345678").toString()
    }
  }
  conn.wsSend(JSON.stringify(responce));
}

function handle(data){
  if(data.action == "auth"){ 
    id = data.details.id;
  }
  if(data.action == "chat"){
    var li = document.createElement('li');
    li.innerHTML = data.details.sender + ":" + data.details.body;
    document.querySelector('#pings').appendChild(li);
  }  
}
        