angular.module('caribbean-war').controller('harborCtrl', function ($scope, $rootScope, $state, connection, userStorage) {
	console.log(userStorage.status());

	$scope.user = userStorage.get();

	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}

	$scope.exit = function(){
		$rootScope.$emit("close", "Exit");
	};
});