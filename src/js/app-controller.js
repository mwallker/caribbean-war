angular.module('caribbean-war')
	.controller('appCtrl', ['$scope', '$rootScope', '$q', '$state', 'audioControl',
		function($scope, $rootScope, $q, $state, audioControl){

            //$scope.appLoading = true;
            var promises = [];

            //$scope.taskManager = [];

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
}]);
