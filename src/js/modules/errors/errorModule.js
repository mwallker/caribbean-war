caribbeanWarApp
	.directive('error', function () {
        return { 
            templateUrl: 'js/modules/errors/errors-template.html',
            restrict: 'E',
            scope:{},
            controller:function($scope, $rootScope){
                $scope.showError = false;

                $scope.toogleError = function(event, message){
                    $scope.showError = !$scope.showError;
                    if($scope.showError) 
                        $scope.message = message;
                    else
                        $scope.message = "";
                };

                $rootScope.$on('toogleError', $scope.toogleError);
            }    
        };
    });