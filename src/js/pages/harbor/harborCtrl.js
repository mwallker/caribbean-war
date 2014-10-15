angular.module('caribbean-war').controller('harborCtrl', function ($scope, $state, connection, events, userStorage) {
	console.log(userStorage.status());

	$scope.user = userStorage.get();

	if(!userStorage.status()){
		events.emit("close", "");
	}

	$scope.exit = function(){
		events.emit("close", "");
	};
});