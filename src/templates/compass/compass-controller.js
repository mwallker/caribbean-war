angular.module('caribbean-war')
	.directive('compass', function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/compass/compass-template.html',
			scope: {
				location: "="
			},
			link: function (scope, element, attrs) {
				scope.$watch('location', function (value) {
					if (!value) return;
					element.find('#compass').css({
						'transform': 'rotate(' + value.alpha + 'rad)'
					});
				});
			}
		};
	});
