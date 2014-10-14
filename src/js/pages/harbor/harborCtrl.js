angular.module('caribbean-war').controller('harborCtrl', function ($scope, $state, connection, events, userStorage) {
	console.log(userStorage.status());

	$scope.user = userStorage;

	if(!userStorage.status()){
		userStorage.reset();
		connection.close();
		$state.go('login');	
	}

	$scope.exit = function(){
		userStorage.reset();
		connection.close();
		$state.go('login');
	}
});