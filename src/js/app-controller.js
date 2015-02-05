angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl', 'graphicService',
		function($scope, $rootScope, $q, $state, audioControl, graphicService){

            $scope.appLoading = true;

            $scope.loadScene = function (sceneName) {
                graphicService.create();
            };

            setTimeout(function(){
                console.log('stop');
                graphicService.dispose();
            }, 6000);

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
				function(event){
					//console.log('state-start');
				});

            $rootScope.$on('$stateChangeSuccess',
				function(event){
					//console.log('state-success');
				});
        }
    ]);
