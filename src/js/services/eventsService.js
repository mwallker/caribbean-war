caribbeanWarApp.service('events', function (){
	var subscribtions = {};

	return{
		subscribe:function(listener, callback){
			if(!subscribtions[listener]) subscribtions[listener] = callback;
			return callback;
		},
		emit:function(listener, data){
			if(subscribtions[listener]) subscribtions[listener](data);
		}
	}
});