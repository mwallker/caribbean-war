caribbeanWarApp
	.directive('game-menu', function () {
        return { 
            templateUrl: 'js/modules/menu/menu-template.html',
            restrict: 'E',
            scope:{},
            link:function($scope){
				$scope.options = [];
            }    
        };
    });