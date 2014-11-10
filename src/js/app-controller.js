angular.module('caribbean-war').controller('appCtrl', ['$scope', '$rootScope', '$state', 'audioControl', function($scope, $rootScope, $state, audioControl){
	audioControl.loadSoundFile('js/sound/ocean.mp3');

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){
			//load scene
		}
	);	
}]);