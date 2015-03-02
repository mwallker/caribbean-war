angular.module('caribbean-war')
	.directive('chat', ['userStorage', 'connection', function (userStorage, connection) {
			return {
				templateUrl: 'templates/chat/chat-template.html',
				restrict: 'E',
				scope: {},
				controller: function ($scope, $rootScope) {
					var content = $('.chat-content ul');
					var history = [];
					var chatBuffer = 42;
					var message = {
						sender: '',
						senderId: '',
						receiverId: '',
						timestamp: '',
						text: ''
					}

					$scope.unreaded = 0;
					$scope.receiverId = 0;
					$scope.chatCollapsed = false;

					function prepareTemplate(msg) {
						return '<li> [' + timeFormat(msg.timestamp) + '] ' +
							'<a href="" data-sender="' + msg.senderId + '"> <span>[' + msg.sender + '] </span>: </a>' +
							(msg.receiverId ? '<span class="glyphicon glyphicon-user"></span>' : '') + msg.message +
							'</li>'
					}

					content.on('click', 'a', function () {
						if (userStorage.get().id != $(this).data('sender')) {
							$scope.receiverId = $(this).data('sender') || 0;
							$scope.message = $(this).children()[0].innerText + ', ';
						}
					});

					content.on('click', 'li', function () {
						console.log('drop');
						$scope.receiverId = 0;
					});

					$scope.clearChatHistory = function () {
						$scope.unreaded = 0;
						$('.chat-content ul li').remove();
						history = [];
					};

					$scope.receiveChatMessage = function (event, data) {
						console.log(data);
						var visiable = !!data.receiverId ? (data.receiverId == userStorage.get().id || data.senderId == userStorage.get().id) : true;
						console.log(visiable);
						if (visiable) {
							if (history.length >= chatBuffer) {
								history.shift();
							}

							content.parent().animate({
								scrollTop: content.height()
							}, 'slow');

							content.append(prepareTemplate(data));

							$scope.unreaded = $scope.chatCollapsed ? ++$scope.unreaded : 0;

							history.push({
								sender: data.sender,
								message: data.message,
								timestamp: data.timestamp,
							});

							$scope.$apply();
						}
					};

					$scope.sendChatMessage = function () {
						if ($scope.message) {
							connection.send('chat', {
								sender: userStorage.get().nick,
								senderId: userStorage.get().id,
								receiverId: $scope.receiverId,
								timestamp: Date.now(),
								message: $scope.message
							});
							$scope.message = '';
						}
					};

					$rootScope.$on('chat', $scope.receiveChatMessage);
				}
			};
	}
]);
