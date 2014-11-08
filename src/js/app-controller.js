angular.module('caribbean-war').controller('appCtrl', function($rootScope, $state){

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){
			switch (toState.name){
				case 'login':
					console.log(toState.name);
					break;
				case 'harbor':
					console.log(toState.name);
					break;
				case 'world':
					console.log(toState.name);
					break;
			}
		}
	);	
});