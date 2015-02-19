angular.module('caribbean-war')
	.directive('chat', ['userStorage', 'connection', function (userStorage, connection) {
			return {
				templateUrl: 'js/modules/chat/chat-template.html',
				restrict: 'E',
				scope: {},
				controller: function ($scope, $rootScope) {
					$scope.chatHistory = [];
					$scope.battleLog = [];
					$scope.chatBuffer = 4;

					$scope.clearChatHistory = function () {
						$scope.chatHistory = [];
					};

					$scope.recieveChatMessage = function (event, data) {
						if ($scope.chatHistory.length >= $scope.chatBuffer) $scope.chatHistory.shift();

						$scope.chatHistory.push({
							from: data.sender,
							message: data.message,
							timestamp: data.timestamp,
						});

						$scope.$apply();
					};

					$scope.sendChatMessage = function () {
						var text = $scope.message;

						if (text) {
							connection.send("chat", {
								sender: userStorage.get().nick,
								senderId: userStorage.get().id,
								timestamp: Date.now(),
								message: text
							});
							$scope.message = '';
						}
					};

					$rootScope.$on("chat", $scope.recieveChatMessage);
				}
			};
    }
]);
