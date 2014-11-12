var caribbeanWarApp = angular.module('caribbean-war', [
	'ui.router',
    'ngResource'
]);

caribbeanWarApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/login');
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'js/pages/login/login-layer.html',
            controller:"loginCtrl"
        })

        .state('harbor', {
     		url: '/harbor',
            templateUrl: 'js/pages/harbor/harbor-layer.html',
            controller:"harborCtrl"
        })

        .state('world', {
     		url: '/world',
            templateUrl: 'js/pages/world/world-layer.html',
            controller:"worldCtrl"
        });
});