caribbeanWarApp.service('userStorage',function(){
	var user = {
		authorize:false
	};

	return{
		status:function(){
			return user.authorize || false;
		},

		set:function(data){
			user = data;
			user.authorize = true;
		},

		get:function(){
			return user;
		},

		reset:function(){
			user = {
				authorize:false
			}
		}
	}
});