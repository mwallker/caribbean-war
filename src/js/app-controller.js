angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', '$translate', 'audioControl', 'appConfig',
		function($scope, $rootScope, $q, $state, $translate, audioControl, appConfig){

            $scope.appLoading = true;
            $scope.languages = appConfig.languages;
            $scope.locale= localStorage.locale || appConfig.languages[0].code;

            var promises = [];

			//audio
			promises.push(audioControl.loadSoundFile('js/sound/ocean.mp3'));

            //locale
            $scope.$watch('locale', function(newVal, oldVal){
                console.log(newVal);
                if(newVal != oldVal){
                    $translate.use(newVal);
                }
            });

            $scope.saveConfigurations = function () {
                localStorage.locale = $scope.locale;
            };

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
