angular.module('caribbean-war').controller('harborCtrl', function ($scope, $rootScope, $state, connection, userStorage) {

	//SCENE INIT
	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}else{
		$scope.user = userStorage.get();
		$scope.selectedShip = localStorage.selectedShip || (($scope.user.Ships && $scope.user.Ships.length) ? $scope.user.Ships[0].ID : 0);
		if($scope.selectedShip){
			connection.send("shipSelect", {shipId:+$scope.selectedShip});
		}
	}

	$scope.pickShip = function(id){
		if($scope.selectedShip != id){
			localStorage.selectedShip = id;
			$scope.selectedShip = id;
			connection.send("shipSelect", {shipId:+$scope.selectedShip});
		}
	};

	$scope.exit = function(){
		$rootScope.$emit("close", "Exit");
	};

	$scope.toWorld = function(){
		if($scope.selectedShip){
			$state.go('world');
		}
		else{
			$rootScope.$emit("error", "No ships avaible");
		}
	};
});