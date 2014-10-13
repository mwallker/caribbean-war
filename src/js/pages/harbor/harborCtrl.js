angular.module('caribbean-war').controller('harborCtrl', function ($scope, $state, connection, events, userStorage) {
	console.log(userStorage.status());

	$scope.user = userStorage;

	if(!userStorage.status()){
		userStorage.reset();
		connection.close();
		$state.go('login');	
	}

	$scope.chating = events.subscribe("chat", function(data){
		//if($scope.chatHistory.length >=100) $scope.chatHistory.shift();
		console.log("chat event");

		$scope.chatHistory.push({
			from:data.sender,
			message:data.message
		});
	});

	$scope.sendChatMessage = function(){
		console.log(userStorage.get().nickname);
		connection.send("chat", {
			sender:userStorage.get().nickname,
			message:$scope.message
		});
	}

	$scope.exit = function(){
		userStorage.reset();
		connection.close();
		$state.go('login');
	}
});