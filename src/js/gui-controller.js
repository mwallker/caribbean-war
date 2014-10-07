$(".auth-form").on("submit", function(event){
	event.preventDefault();
	auth({
		login: $('[name="login-input"]').val()||"",
		password: $('[name="password-input"]').val()||""
	});
});

$("body,html").on("auth-succeed", function(event){
	//Убираем форму, выводим инфу о человеке, меняем фон, инфо лежит в обьекте userInfo, рисуем окно чата
});

$("body,html").on("auth-fail", function(event){
	//Выводим окошко с инфой, почему авторизация не удалась (инфа будет в event.info)
});