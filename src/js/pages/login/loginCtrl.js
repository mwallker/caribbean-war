angular.module('caribbean-war').controller('loginCtrl', function ($scope, $state) {
	$scope.email = localStorage.email||"";
	$scope.confirm = localStorage.confirm;

	console.log(localStorage.confirm);

	$scope.remember = function() {
		localStorage.confirm = $scope.confirm;
		console.log(localStorage.confirm);
	}

	$scope.connect = function(){
		if(localStorage.confirm){
			localStorage.email = $scope.email;
			var t = angular.toJson({
				action:"auth",
				details:{
					login: $scope.email,
					password: new jsSHA(($scope.password).toString(), 'TEXT').getHash('SHA-256', 'HEX')
				}
			});
			console.log(t);
			connection.open(t);
		}
		else{

		}
	}
});
