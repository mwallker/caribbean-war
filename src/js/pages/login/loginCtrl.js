angular.module('caribbean-war').controller('loginCtrl', function ($scope, $rootScope, $state, connection, audioControl, userStorage) {
	$scope.email = localStorage.email || "";
	$rootScope.authorized = false;

	if(connection.status()){
		$rootScope.$broadcast("close", "");
	}

    $scope.registrateTasks([/*audioControl.loadSoundFile('js/sound/ocean.mp3')*/]);

	$scope.connect = function(){
		localStorage.email = $scope.email || "";

		var credits = {
			login: $scope.email,
			password: new jsSHA(($scope.password).toString(), 'TEXT').getHash('SHA-256', 'HEX')
		};

		connection.open(credits).then(function(){
			connection.send("auth", credits);
		});
	};

	$scope.authorize = function(event, data){
        try{
            if(data && data.authorize){
                userStorage.set(data);
                $state.go('harbor');
            }
        }catch(e){
            console.log(e);
        }
	};

	$scope.close = function(event, message){
		connection.close();
		userStorage.reset();
		$state.go('login');
	};

	$rootScope.$on("auth", $scope.authorize);
	$rootScope.$on("close", $scope.close);
});
