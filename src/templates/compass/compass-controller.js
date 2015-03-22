angular.module('caribbean-war')
	.directive('compass', function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/compass/compass-template.html',
			scope: {
				location: "="
			},
			link: function (scope, element, attrs) {
				scope.positionX = '';
				scope.positionY = '';

				scope.$watch('location', function (value) {
					if (!value) return;
					scope.positionX = Math.abs(~~value.x) + '°' + (value.x >= 0 ? 'N' : 'S');
					scope.positionY = Math.abs(~~value.y) + '°' + (value.y >= 0 ? 'E' : 'W');
					element.find('.compass-axes').css({
						'transform': 'rotate(' + value.alpha + 'rad)'
					});
				});
			}
		};
	});
