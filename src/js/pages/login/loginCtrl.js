angular.module('caribbean-war').controller('loginCtrl', function ($scope, $state, connection) {

	$scope.email = localStorage.email||"";

	console.log(localStorage.remember);

	$scope.connect = function(){
		localStorage.email = $scope.email || "";

		var credits = {
			login: $scope.email,
			password: new jsSHA(($scope.password).toString(), 'TEXT').getHash('SHA-256', 'HEX')
		}

		console.log(credits);

		connection.open(credits).then(
			function(){
				connection.send("auth", credits);
			}
		);
	}
});
