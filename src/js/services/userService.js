caribbeanWarApp.service('userStorage', function(){
	var user = {
		authorize:false
	};

	return{
		status:function(){
			return user.authorize || false;
		},

		set:function(data){
			user = data.userInfo;
			user.authorize = true;
		},

		get:function(){
			return user;
		},

		reset:function(){
			user = {
				authorize:false
			};
		}
	};
});