angular.module('caribbean-war').controller('loginCtrl', function ($scope, $state, connection, events, userStorage) {

	$scope.email = localStorage.email||"";

	console.log(localStorage.remember);

	userStorage.reset();
	
	$scope.connect = function(){
		localStorage.email = $scope.email || "";

		var credits = {
			login: $scope.email,
			password: new jsSHA(($scope.password).toString(), 'TEXT').getHash('SHA-256', 'HEX')
		}

		console.log(credits);

		connection.open(credits).then(
			function(){
				$scope.onResponse = events.subscribe("auth", function(data){
					if(data){
						userStorage.set(data);
						$state.go('harbor');
					}
				});
				connection.send("auth", credits);
			}
		);
	}
});
