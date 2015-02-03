angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl', 'graphicService',
		function($scope, $rootScope, $q, $state, audioControl, graphicService){

            $scope.appLoading = true;

            graphicService.create();
/*
            setTimeout(function () {
                graphicService.dispose();
                console.log('end');
            }, 30000);

            setTimeout(function () {
                graphicService.create();
                console.log('new start');
            }, 60000);
   */
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
				}
			);

            $rootScope.$on('$stateChangeSuccess',
				function(event){
					//console.log('state-success');
				}
			);
        }
    ]);
