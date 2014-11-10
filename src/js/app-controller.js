angular.module('caribbean-war').controller('appCtrl', ['audioControl', '$scope', '$rootScope', '$state', function($scope, $rootScope, $state, audioControl){
	console.log(audioControl);
	audioControl.loadSoundFile('js/sound/ocean.mp3');

	$scope.play = function(){
		audioControl.play();
	};

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){
			//load scene
		}
	);	
}]);