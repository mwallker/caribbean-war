angular.module('caribbean-war')
	.controller('settingsCtrl', ['$scope', '$rootScope', '$translate', '$state', 'audioControl', 'appConfig',
		function ($scope, $rootScope, $translate, $state, audioControl, appConfig) {
			$scope.languages = appConfig.languages;
			$scope.servers = appConfig.servers;

			$scope.musicVolume = localStorage.musicVolume || 100;
			$scope.effectsVolume = localStorage.effectsVolume || 100;
			$scope.inFullscreen = false;
			$scope.locale = localStorage.locale || appConfig.languages[0].code;
			$scope.server = localStorage.server ? localStorage.server : localStorage.server = $scope.servers[0].url;

			$rootScope.devInfo = getDevInfo(appConfig);

			function getDevInfo(config) {
				return {
					version: '0.3.2',
					environment: (function (servers) {
						for (var i in servers) {
							if (localStorage.server === servers[i].url) {
								return servers[i].label;
							}
						}
						return 'unknown';
					})(config.servers)
				}
			}

			var menuReady = true;

			$scope.saveConfigurations = function () {
				localStorage.locale = $scope.locale;
				$translate.use($scope.locale);
				localStorage.server = $scope.server;
				localStorage.musicVolume = $scope.musicVolume;
				localStorage.effectsVolume = $scope.effectsVolume;
				switchFullscreen($scope.inFullscreen);
				$rootScope.devInfo = getDevInfo(appConfig);
			};

			$scope.exitHandler = function (appConfig) {
				console.log();
				switch ($state.current.name) {
				case 'harborS':
					//connection.close();
					userStorage.reset();
					$state.go('login');
					break;
				case 'worldS':
					break;
				default:
					$rootScope.$emit('error', 'ERRORS_NOT_READY');
					break;
				}
			}

			$scope.changeVolume = function (target) {
				audioControl.changeVolume($scope.musicVolume / 100, target);
			};

			$rootScope.$on('toggleMenu', function () {
				if (menuReady) {
					$('#settingsModal').modal('toggle');
				}
			});

			$('#settingsModal').on('shown.bs.modal hidden.bs.modal', function (e) {
				menuReady = true;
			});

			$('#settingsModal').on('hide.bs.modal show.bs.modal', function (e) {
				menuReady = false;
			});

			(function () {
				$scope.changeVolume('music');
				$scope.changeVolume('effects');
			})();

		}]);
