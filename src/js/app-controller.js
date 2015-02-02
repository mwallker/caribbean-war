angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl',
		function($scope, $rootScope, $q, $state, audioControl){

            $scope.appLoading = true;
            var promises = [];

			//audio
			promises.push(audioControl.loadSoundFile('js/sound/ocean.mp3'));

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
