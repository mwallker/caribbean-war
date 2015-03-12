angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', '$timeout', 'audioControl', 'connection', 'renderHandler', 'userStorage',
		function ($scope, $rootScope, $q, $state, $timeout, audioControl, connection, renderHandler, userStorage) {

			$scope.appLoading = true;
			$scope.errorShown = false;

			$scope.manageTasks = function (tasks) {
				$scope.appLoading = true;
				$q.all(tasks).then(function () {
					$scope.appLoading = false;
				}, function () {
					console.log('fail');
				});
			};

			$scope.manageTasks([ /*audioControl.loadSoundFile('theme', 'music'), audioControl.loadSoundFile('ocean', 'effects')*/ ]);

			$scope.errorHide = function () {
				$scope.errorType = '';
				$scope.errorShown = false;
			};

			$rootScope.$on('error', function (event, type) {
				$rootScope.loading = false;
				if (!$scope.errorShown && type) {
					$scope.errorType = type;
					$scope.errorShown = true;
					$timeout($scope.errorHide, 5000);
				}
			});

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

			$rootScope.$on('exit', function (event) {

			});

			$rootScope.$on('fuckup', function () {
				$rootScope.$emit('error', 'ERRORS_FUCKUP');
			});

			$rootScope.$on('exitWorld', function (event) {
				connection.send('exitWorld', {});
				$state.go('harbor');
			});

			$rootScope.$on('enterWorld', function (event, details) {
				if (details.success === true) {
					userStorage.setNeighbors(details);
					userStorage.setShip(details);
					$state.go('world');
				}
			});

			$rootScope.$on('$stateChangeStart',
				function (event, toState) {
					$scope.errorShown = false;
					renderHandler.dispose();
				});

			$rootScope.$on('$stateChangeSuccess',
				function (event, toState) {
					$rootScope.loading = false;
					renderHandler.load(toState.name);
					//$scope.manageTasks([]);
				});

			$rootScope.$on('$stateChangeError',
				function (event, toState) {
					$scope.errorType = 'ERROR_ROUT';
					$scope.errorShown = true;
				});
		}
	]);
