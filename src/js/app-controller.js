angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl', 'locale',
		function($scope, $rootScope, $q, $state, audioControl, locale){

            $scope.appLoading = true;

            var promises = [];

			//audio
			promises.push(audioControl.loadSoundFile('js/sound/ocean.mp3'));
			$scope.volume = 100;

			$scope.changeVolume = function(value){
				audioControl.changeVolume($scope.volume/100);
			};

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
				function(event){
					console.log('state-start');
				}
			);

            $rootScope.$on('$stateChangeSuccess',
				function(event){
					console.log('state-success');
				}
			);

            //Resolving promises will hide splash screen
            $q.all(promises).then(function(){
                $scope.appLoading = false;
            }, function(){
                console.log('fail');
            });
}]);
