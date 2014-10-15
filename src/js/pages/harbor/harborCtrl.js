angular.module('caribbean-war').controller('harborCtrl', function ($scope, $state, connection, events, userStorage) {
	console.log(userStorage.status());

	$scope.user = userStorage.get();

	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}

	$scope.exit = function(){
		events.emit("close", "");
	};
});