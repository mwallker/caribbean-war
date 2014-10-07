$(".auth-form").on("submit", function(event){
	event.preventDefault();
	auth({
		login: $('[name="login-input"]').val()||"",
		password: $('[name="password-input"]').val()||""
	});
});