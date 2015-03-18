angular.module('caribbean-war')
	.directive('compass', function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/compass/compass-template.html',
			scope: false,
			link: function (scope, element, attrs) {
				scope.$watch(attrs.ngModel, function (value) {
					console.log(value);
					element.css({
						'transform': 'rotate(' + value.alpha + 'rad)'
					})
				});
			}
		}
	})
