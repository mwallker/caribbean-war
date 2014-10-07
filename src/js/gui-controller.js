$(".auth-form").on("submit", function(event){
	event.preventDefault();
	authorize({
		login: $('[name="login-input"]').val()||"",
		password: $('[name="password-input"]').val()||""
	});
});

$(".auth-form").on("auth-succeed", function(event){
	//Убираем форму, выводим инфу о человеке, инфо лежит в обьекте userInfo, меняем фон, pисуем окно чата
	console.log("Succeed");
});

$(".auth-form").on("auth-fail", function(event){
	//Выводим окошко с инфой, почему авторизация не удалась (инфа будет в event.info)
	console.log("Fail");
});