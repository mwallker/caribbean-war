angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl', 'renderService',
		function ($scope, $rootScope, $q, $state, audioControl, renderService) {

			$scope.appLoading = true;

			setTimeout(function () {
				console.log('stop');
				renderService.dispose();
			}, 6000);


			setTimeout(function () {
				console.log('start again');
				renderService.load('login');
			}, 10000);

			$scope.registrateTasks = function (tasks) {
				$scope.appLoading = true;
				$q.all(tasks).then(function () {
					$scope.appLoading = false;
				}, function () {
					console.log('fail');
				});
			};

			$rootScope.$on('$stateChangeStart',
				function (event, toState) {
					renderService.dispose();
				});

			$rootScope.$on('$stateChangeSuccess',
				function (event, toState) {
					renderService.load(toState.name);
				});
        }
    ]);
