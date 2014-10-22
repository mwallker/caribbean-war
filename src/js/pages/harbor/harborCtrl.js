angular.module('caribbean-war').controller('harborCtrl', function ($scope, $rootScope, $state, connection, userStorage) {

	//SCENE INIT
	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}else{
		$scope.user = userStorage.get();
		$scope.ships = userStorage.get().Ships;
		console.log($scope.ships);
		$scope.selectedShip = (($scope.ships && $scope.ships.length) ? $scope.ships[0] : {ID:0});
		for(ship in $scope.ships){
			ship.selected = false;
			if($scope.ships[ship].ID == $scope.selectedShip.ID){
  				$scope.ships[ship].selected = true;
  			}
		}
		if($scope.selectedShip){
			connection.send("shipSelect", {shipId:+$scope.selectedShip.ID});
		}
	}

	$scope.pickShip = function(index){
		if($scope.selectedShip.ID != $scope.ships[index].ID){
			angular.forEach($scope.ships, function(value, key) {
  				value.selected = false;
			});
			$scope.ships[index].selected = true;
			$scope.selectedShip = $scope.ships[index];
			connection.send("shipSelect", {shipId:+$scope.selectedShip.ID});
		}
	};

	$scope.exit = function(){
		$rootScope.$emit("close", "Exit");
	};

	$scope.toWorld = function(){
		if($scope.selectedShip.ID){
			$state.go('world');
		}
		else{
			$rootScope.$emit("error", "No ships avaible");
		}
	};
});