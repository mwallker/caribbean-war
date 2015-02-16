angular.module('caribbean-war')
	.controller('settingsCtrl', ['$scope', '$rootScope', '$translate', 'audioControl', 'appConfig',
		function ($scope, $rootScope, $translate, audioControl, appConfig) {
			$scope.languages = appConfig.languages;

			$scope.musicVolume = localStorage.musicVolume || 100;
			$scope.effectsVolume = localStorage.effectsVolume || 100;
			$scope.locale = localStorage.locale || appConfig.languages[0].code;

			//locale
			$scope.$watch('locale', function (newVal, oldVal) {
				if (newVal != oldVal) {
					$translate.use(newVal);
				}
			});

			$scope.saveConfigurations = function () {
				localStorage.locale = $scope.locale;
				localStorage.musicVolume = $scope.musicVolume;
				localStorage.effectsVolume = $scope.effectsVolume;
			};

			$scope.changeVolume = function (target) {
				audioControl.changeVolume($scope.musicVolume / 100, target);
			};

		}]);
