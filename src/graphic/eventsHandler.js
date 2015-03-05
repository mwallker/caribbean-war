angular.module('render').factory('KeyEvents', function ($rootScope) {

	var canvas = $('#renderCanvas');
	var checkFocus = function () {
		return !$("input").is(':focus');
	};

	var holdenE = false,
		holdenQ = false,
		holdenUp = false,
		holdenDown = false,
		holdenLeft = false,
		holdenRight = false,
		holdenSpace = false,
		holdenEsc = false,
		holdenM = false;

	KeyboardJS.on('up, w',
		function (event) {
			if (!holdenUp && checkFocus()) {
				holdenUp = true;
				$rootScope.$emit('movementKey', 'upward');
			}
		},
		function () {
			if (holdenUp) holdenUp = false;
		});

	KeyboardJS.on('down, s',
		function (event) {
			if (!holdenDown && checkFocus()) {
				holdenDown = true;
				$rootScope.$emit('movementKey', 'backward');
			}
		},
		function () {
			if (holdenDown) holdenDown = false;
		});

	KeyboardJS.on('left, a',
		function () {
			if (!holdenLeft && checkFocus()) {
				holdenLeft = true;
				$rootScope.$emit('movementKey', 'left');
			}
		},
		function () {
			if (holdenLeft) {
				holdenLeft = false;
				$rootScope.$emit('movementKey', 'none');
			}
		});

	KeyboardJS.on('right, d',
		function () {
			if (!holdenRight && checkFocus()) {
				holdenRight = true;
				$rootScope.$emit('movementKey', 'right');
			}
		},
		function () {
			if (holdenRight) {
				holdenRight = false;
				$rootScope.$emit('movementKey', 'none');
			}
		});

	KeyboardJS.on('q',
		function () {
			if (!holdenQ && checkFocus()) {
				holdenQ = true;
				if (holdenE && holdenQ) canvas.trigger('directionKey', TargetingDirections.both);
				else canvas.trigger('directionKey', TargetingDirections.left);
			}
		},
		function () {
			if (holdenQ) {
				holdenQ = false;
				if (!holdenE) canvas.trigger('directionKey', TargetingDirections.none);
				else canvas.trigger('directionKey', TargetingDirections.right);
			}
		});

	KeyboardJS.on('e',
		function () {
			if (!holdenE && checkFocus()) {
				holdenE = true;
				if (holdenE && holdenQ) canvas.trigger('directionKey', TargetingDirections.both);
				else canvas.trigger('directionKey', TargetingDirections.right);
			}
		},
		function () {
			if (holdenE) {
				holdenE = false;
				if (!holdenQ) canvas.trigger('directionKey', TargetingDirections.none);
				else canvas.trigger('directionKey', TargetingDirections.left);
			}
		});

	KeyboardJS.on('space',
		function () {
			if (!holdenSpace && checkFocus()) {
				holdenSpace = true;
				if ((holdenE || holdenQ) && holdenSpace) holdenSpace = true;
			}
		},
		function () {
			if (holdenSpace) holdenSpace = false;
		});

	KeyboardJS.on('esc',
		function (e) {
			if (!holdenEsc) {
				holdenEsc = true;
				$rootScope.$emit('toggleMenu');
			}
		},
		function (e) {
			if (holdenEsc) {
				holdenEsc = false;
			}
		});

	KeyboardJS.on('m',
		function () {
			if (!holdenM && checkFocus()) {
				holdenM = true;
				console.log('Toggle map');
			}
		},
		function () {
			if (holdenM) {
				holdenM = false;
			}
		});

	return {
		get: function () {
			return 'KeyEvents';
		}
	};
});
