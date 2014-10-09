var caribbeanWarApp = angular.module('caribbean-war', [
	'ui.router'
]);

caribbeanWarApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'js/pages/login/login-layer.html',
            controller:"loginCtrl"
        })

        .state('harbor', {
     		url: '/harbor',
            templateUrl: 'js/pages/harbor/harbor-layer.html'
            //controller:"harborCtrl"
        })

        .state('world', {
     		url: '/world',
            templateUrl: 'js/pages/harbor/world-layer.html'
            //controller:"worldCtrl"
        });
});