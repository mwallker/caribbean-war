angular.module('caribbean-war')
	.directive('compass', function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/compass/compass-template.html',
			scope: {
				ngModel: '='
			},
			controller: function () {

			}
		}
	})
