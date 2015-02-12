angular.module('render').factory('eventsHandle', function () {

	var subs = {};

	return {
		subscribe: function (type, callback) {
			if(subs[type]){
				subs
			}
		},
		publish: function () {

		}
	}
});
