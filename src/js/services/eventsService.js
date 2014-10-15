caribbeanWarApp.service('events', function (){
	var eventsList = [];

	return{
		subscribe:function(listener, callback, context){
			if(!eventsList[listener]) {
				eventsList[listener] = {
					context:context,
					callback:callback
				}
			};
			return eventsList[listener];
		},
		emit:function(listener, data){
			var event = eventsList[listener];
			if(event) event.callback.call(event.context, data);
		}
	}
});