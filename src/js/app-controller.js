angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$state', 'audioControl', 'locale',
		function($scope, $rootScope, $state, audioControl, locale){
			//audio
			audioControl.loadSoundFile('js/sound/ocean.mp3');
			$scope.volume = 100;
			
			//localization
			$scope.languages = [
				{label:'English', code:'en-EN'},
				{label:'Русский', code:'ru-RU'}
			];

			$scope.changeLocate = function(code){
				localStorage.locale = code;
				locale.get({languageCode:code}, function(data){
					$scope.localeData = data;
				});
			};
			
			$scope.changeLocate($scope.languages[0].code);

			$rootScope.$on('$stateChangeStart', 
				function(event, toState, toParams, fromState, fromParams){
					//load scene
				}
			);	
}]);