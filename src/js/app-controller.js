angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl', 'renderHandler',
		function ($scope, $rootScope, $q, $state, audioControl, renderHandler) {

			$scope.appLoading = true;
			$scope.pageLoading = true;

			/*
				setTimeout(function () {
					console.log('stop');
					renderService.dispose();
				}, 6000);


				setTimeout(function () {
					console.log('start again');
					renderService.load('login');
				}, 10000);
			*/

			$scope.manageTasks = function (tasks, state) {
				$scope.appLoading = true;
				$q.all(tasks).then(function () {
					$scope.appLoading = false;
					$scope.pageLoading = false;
				}, function () {
					console.log('fail');
				});
			};

			$rootScope.$on('$stateChangeStart',
				function (event, toState) {
					renderHandler.dispose();
				});

			$rootScope.$on('$stateChangeSuccess',
				function (event, toState) {
					renderHandler.load(toState.name);
					$scope.manageTasks([ /*audioControl.loadSoundFile('js/sound/ocean.mp3')*/ ], toState);
				});
		}
	]);
