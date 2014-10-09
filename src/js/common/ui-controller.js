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
var template = $(".message-template").clone();
var chatLayout = $("#chat-layout");
var chatLayoutForm = $("#chat-layout form");
var chatHistory = $(".chat-history");
var chatInput = $('[name="chat-input"]');


chatLayoutForm.on("submit", function(event){
	event.preventDefault();
	//chatLayoutForm.reset();
	chatHistory[0].scrollTop = chatHistory[0].scrollHeight;
	sendChatMessage({
		sender:userInfo.nickname,
		message:chatInput.val()
	});
});

chatLayout.on("incoming", function(event){
	var ms = template.clone();
	ms.find(".sender").text(event.info.sender);
	ms.find(".message").text(event.info.message);
	ms.show();
	chatHistory.append(ms);
});
