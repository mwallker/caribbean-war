angular.module('caribbean-war').controller('loginCtrl', function ($scope, $state, connection, events, userStorage) {

	$scope.email = localStorage.email||"";

	userStorage.reset();

	$scope.connect = function(){
		localStorage.email = $scope.email || "";

		var credits = {
			login: $scope.email,
			password: new jsSHA(($scope.password).toString(), 'TEXT').getHash('SHA-256', 'HEX')
		};

		console.log(credits);

		connection.open(credits).then(
			function(){
				connection.send("auth", credits);
			}
		);
	};

	$scope.authorize = function(data){
		if(data && data.authorize){
			userStorage.set(data);
			$state.go('harbor');
		}
	};

	$scope.close = function(message){
		console.log("Closing...");
		connection.close();
		userStorage.reset();
		$state.go('login');
	};

	events.subscribe("auth", $scope.authorize, $scope);
	events.subscribe("close", $scope.close, $scope);
});
