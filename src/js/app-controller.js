angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl', 'graphicService',
		function($scope, $rootScope, $q, $state, audioControl, graphicService){

            $scope.appLoading = true;

            /*setTimeout(function(){
                console.log('stop');
                graphicService.dispose();
            }, 6000);*/

            /*
            setTimeout(function(){
                console.log('start again');
                graphicService.create();
            }, 15000);*/

            $scope.registrateTasks = function (tasks) {
                $scope.appLoading = true;
                $q.all(tasks).then(function(){
                    $scope.appLoading = false;
                }, function(){
                    console.log('fail');
                });
            };

			$rootScope.$on('$stateChangeStart', 
				function(event, toState){
                    graphicService.dispose();
				});

            $rootScope.$on('$stateChangeSuccess',
				function(event, toState){
					graphicService.load(toState.name);
				});
        }
    ]);
