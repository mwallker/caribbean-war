angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'renderHandler', 'audioControl',
		function ($scope, $rootScope, $q, $state, renderHandler, audioControl) {

			$scope.appLoading = true;
			$scope.manageTasks = function (tasks) {
				//$scope.appLoading = true;
				$q.all(tasks).then(function () {
					$scope.appLoading = false;
				}, function () {
					console.log('fail');
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
					$rootScope.loading = false;
					renderHandler.load(toState.name);
					//$scope.manageTasks([]);
				});

			$rootScope.$on('$stateChangeError',
				function (event, toState) {
					$rootScope.$emit('error', 'ERROR_ROUT');
				});
		}
	]);
