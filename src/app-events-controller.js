angular.module('caribbean-war')
	.controller('eventsCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'connection', 'userStorage',
		function ($scope, $rootScope, $state, $timeout, connection, userStorage) {

			$scope.errorShown = false;

			//CONNECTION EVENTS
			$rootScope.$on('open', function (event, credits) {
				$rootScope.loading = true;
				connection.open().then(
					function () {
						connection.send('auth', credits);
					},
					function () {
						$rootScope.$emit('error', 'ERRORS_CONN');
					});
			});

			$rootScope.$on('send', function (event, data) {
				try {
					$rootScope.loading = true;
					connection.send(data.action, data.details);
				} catch (e) {
					$rootScope.$emit('error', 'ERRORS_SEND_FAIL');
				}
			});

			$rootScope.$on('close', function (event, wasClean) {
				connection.close();
				userStorage.reset();
				$state.go('login');
				if (!wasClean) $rootScope.$emit('error', 'ERRORS_ROUT');
			});


			//INFORMATION EVENTS
			$rootScope.$on('wait', function (event, data) {

			});

			$scope.errorHandler = function (event, type) {
				$rootScope.loading = false;
				if (type) {
					if ($scope.errorShown) return;
					$scope.errorType = type && (type.indexOf('ERROR') + 1) ? type : 'ERRORS_UNKNOWN_ACTION';
					$scope.errorShown = true;
					$timeout(function () {
						$scope.errorType = '';
						$scope.errorShown = false;
					}, 5000);
				} else {
					$scope.errorType = '';
					$scope.errorShown = false;
				}
			};
			$rootScope.$on('error', $scope.errorHandler);


			//WORLD GLOBAL EVENTS
			$rootScope.$on('enterWorld', function (event, details) {
				if (details.success === true) {
					userStorage.setNeighbors(details);
					userStorage.setShip(details);
					$state.go('world');
				}
			});

			$rootScope.$on('exitWorld', function (event) {
				connection.send('exitWorld', {});
				$state.go('harbor');
			});

		}]);
