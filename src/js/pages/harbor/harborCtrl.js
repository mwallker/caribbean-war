angular.module('caribbean-war').controller('harborCtrl', function ($scope, $rootScope, $state, connection, userStorage) {

	//SCENE INIT
	if(!userStorage.status()){
		connection.close();
		userStorage.reset();
		$state.go('login');
	}else{
		$scope.user = userStorage.get();
		$scope.ships = userStorage.get().Ships;

		$scope.selectedShip = (($scope.ships && $scope.ships.length) ? $scope.ships[0] : {ID:0});

		angular.forEach($scope.ships, function(value, key) {
  			value.selected = false;
  			if(value.ID == $scope.selectedShip.ID){
  				value.selected = true;
  			}
		});
	}

	$scope.pickShip = function(index){
		if($scope.selectedShip.ID != $scope.ships[index].ID){
			angular.forEach($scope.ships, function(value, key) {
  				value.selected = false;
			});
			$scope.ships[index].selected = true;
			$scope.selectedShip = $scope.ships[index];
		}
	};

	$scope.exit = function(){
		$rootScope.$emit("close", "Exit");
	};

	$scope.toWorld = function(){
		if($scope.selectedShip.ID){
			connection.send("shipSelect", {shipId:+$scope.selectedShip.ID});		
		}
		else{
			$rootScope.$emit("error", "No ships avaible");
		}
	};

	$scope.enterWorld = function(event, details){
		if(details.success === true){
			$state.go('world');
		}
	};

	$rootScope.$on("shipSelect", $scope.enterWorld);
});