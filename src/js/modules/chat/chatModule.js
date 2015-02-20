angular.module('caribbean-war')
	.directive('chat', ['userStorage', 'connection', function (userStorage, connection) {
			return {
				templateUrl: 'js/modules/chat/chat-template.html',
				restrict: 'E',
				scope: {},
				controller: function ($scope, $rootScope) {
					var content = $('.chat-content ul');
					var history = [];
					var message = {
						sender: '',
						senderId: '',
						timestamp: '',
						text: ''
					}

					function prepareTemplate(data) {
						return '<li><span>[' + data.timestamp + ']</span><a href="" data-sender="'+data.senderId+'"><span>[' + data.sender + ']</span></a> : <span>' + data.message + '</span></li>'
					}

					$scope.chatHistory = [];
					$scope.chatBuffer = 42;
					$scope.unreaded = 0;
					$scope.chatCollapsed = false;

					$scope.clearChatHistory = function () {
						$scope.chatHistory = [];
						$scope.unreaded = 0;
					};

					$scope.recieveChatMessage = function (event, data) {
						if ($scope.chatHistory.length >= $scope.chatBuffer) $scope.chatHistory.shift();

						$('.chat-content ul').append(prepareTemplate(data));

						$scope.unreaded = $scope.chatCollapsed ? ++$scope.unreaded : 0;

						$scope.chatHistory.push({
							sender: data.sender,
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
