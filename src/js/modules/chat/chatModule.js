angular.module('caribbean-war')
	.directive('chat', ['userStorage', 'connection', function (userStorage, connection) {
			return {
				templateUrl: 'js/modules/chat/chat-template.html',
				restrict: 'E',
				scope: {},
				controller: function ($scope, $rootScope) {
					var content = $('.chat-content ul');
					var history = [];
					var chatBuffer = 4;
					var message = {
						sender: '',
						senderId: '',
						timestamp: '',
						text: ''
					}

					$scope.unreaded = 0;
					$scope.chatCollapsed = false;

					function prepareTemplate(msg) {
						return '<li><span>[' + timeFormat(msg.timestamp) + ']</span><a href="" data-sender="' + msg.senderId + '"> <span>[' + msg.sender + ']</span></a> : <span>' + messageFormat(msg.message) + '</span></li>'
					}

					content.on('click', 'a', function () {
						if(userStorage.get().id != $(this).data('sender')){
							$scope.message = $(this).children()[0].innerText;
						}
					});

					$scope.clearChatHistory = function () {
						$scope.unreaded = 0;
						$('.chat-content ul li').remove();
						history = [];
					};

					$scope.recieveChatMessage = function (event, data) {
						if (history.length >= chatBuffer) {
							history.shift();
						}

						content.parent().animate({
							scrollTop: content.height()
						}, "slow");

						content.append(prepareTemplate(data));

						$scope.unreaded = $scope.chatCollapsed ? ++$scope.unreaded : 0;

						history.push({
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
