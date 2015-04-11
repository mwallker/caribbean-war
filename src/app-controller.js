angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'renderHandler', 'audioControl',
		function ($scope, $rootScope, $q, $state, renderHandler, audioControl) {

			$rootScope.callbacks = [];

			$scope.appLoading = true;
			$scope.manageTasks = function (tasks) {
				//$scope.appLoading = true;
				$q.all(tasks).then(function () {
					$scope.appLoading = false;
				}, function () {
					console.error('Fail execute tasks');
				});
			};

			$scope.manageTasks([ /*audioControl.loadSoundFile('theme', 'music'), audioControl.loadSoundFile('ocean', 'effects')*/ ]);

			$rootScope.$on('$stateChangeStart',
				function (event, toState) {
					$rootScope.$emit('error', false);
					renderHandler.dispose();
				});

			$rootScope.$on('$stateChangeSuccess',
				function (event, toState) {
					console.info('Clear ' + $rootScope.callbacks.length + ' events');
					for (var c in $rootScope.callbacks) {
						$rootScope.callbacks[c]();
					}
					$rootScope.callbacks = [];

					$rootScope.loading = false;
					renderHandler.load(toState.name);
					//$scope.manageTasks([]);
				});

			$rootScope.$on('$stateChangeError',
				function (event, toState) {
					$rootScope.$emit('error', 'ERROR_ROUT');
				});

			setTimeout(function () {
				loadConsole();
			}, 5000);
		}
	]);
