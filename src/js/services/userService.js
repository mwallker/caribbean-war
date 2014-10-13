caribbeanWarApp.service('userStorage',function(){
	var user = {
		authorized:false,
		id:false,
		nickname:false,
		cash:false,
		email:false
	}

	return{
		status:function(){
			return user.authorized;
		},
		set:function(data){
			user.authorized = true;
			user.nickname = data["Nick"];
			user.cash = data["Cash"];
			user.id = data["ID"];
			user.email = data["Email"];
		},
		get:function(){
			return user;
		},
		reset:function(){
			user.authorized = false;
			user.id = false;
			user.nickname = false;
			user.cash = false;
			user.email = false;
		}
	}
});