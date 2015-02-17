angular.module('caribbean-war')
	.controller('settingsCtrl', ['$scope', '$rootScope', '$translate', 'audioControl', 'appConfig',
		function ($scope, $rootScope, $translate, audioControl, appConfig) {
			$scope.languages = appConfig.languages;
			$scope.servers = appConfig.servers;

			$scope.musicVolume = localStorage.musicVolume || 100;
			$scope.effectsVolume = localStorage.effectsVolume || 100;
			$scope.locale = localStorage.locale || appConfig.languages[0].code;
			$scope.server = localStorage.server || $scope.servers[0].url;

			$scope.showSettings = false;

			//locale
			$scope.$watch('locale', function (newVal, oldVal) {
				if (newVal != oldVal) {
					$translate.use(newVal);
				}
			});

			//server
			$scope.$watch('server', function (newVal, oldVal) {
				if (newVal != oldVal) {
					localStorage.server = newVal;
				}
			});

			$scope.saveConfigurations = function () {
				localStorage.locale = $scope.locale;
				localStorage.server = $scope.server;
				localStorage.musicVolume = $scope.musicVolume;
				localStorage.effectsVolume = $scope.effectsVolume;
			};

			$scope.changeVolume = function (target) {
				audioControl.changeVolume($scope.musicVolume / 100, target);
			};

			$rootScope.$on('toggleMenu', function () {
				$scope.showSettings = !$scope.showSettings;
				$scope.$apply();
			});

			(function (){
				$scope.changeVolume('music');
				$scope.changeVolume('effects');
			})();

		}]);
