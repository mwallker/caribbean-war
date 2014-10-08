//AUTH. SCREEN GUI CONTROL
$("#login-layout form").on("submit", function(event){
	event.preventDefault();
	authorize({
		login: $('[name="login-input"]').val()||"",
		password: $('[name="password-input"]').val()||""
	});
});

$("#login-layout").on("auth-fail", function(event){
	//Выводим окошко с инфой, почему авторизация не удалась (инфа будет в event.info)
	console.log("Fail");
});

//LOBBY GUI CONTROL
$("#lobby-layout").on("load-lobby", function(event){
	//Убираем форму, выводим инфу о человеке, инфо лежит в обьекте userInfo, меняем фон, pисуем окно чата
	console.log("Succeed");
});

//CHAT GUI CONTROL
var template = $("#chat-layout section article").clone();

$("#chat-layout form").on("submit", function(event){
	event.preventDefault();
	sendChatMessage({
		sender:userInfo.name,
		message:$('[name="chat-input"]').val()
	});
});

$("#chat-layout").on("incoming", function(event){
	var m = template.clone();
	m.find("sender").text(event.info.sender);
	m.find("message").text(event.info.message);
	m.show();
	$("#chat-layout section").append(m);
});
