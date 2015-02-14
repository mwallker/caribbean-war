angular.module('render').factory('KeyEvents', function ($rootScope, connection) {

	var userId = null;

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
				if (connection.status() && userId) {
					connection.send('move', {
						type: 'upward'
					});
				}
			}
		},
		function () {
			if (holdenUp) holdenUp = false;
		});

	KeyboardJS.on('down, s',
		function (event) {
			if (!holdenDown && checkFocus()) {
				holdenDown = true;
				if (connection.status() && userId) {
					connection.send('move', {
						type: 'backward'
					});
				}
			}
		},
		function () {
			if (holdenDown) holdenDown = false;
		});

	KeyboardJS.on('left, a',
		function () {
			if (!holdenLeft) {
				holdenLeft = true;
				if (connection.status() && userId) {
					connection.send('move', {
						type: 'left'
					});
				}
			}
		},
		function () {
			if (holdenLeft) {
				holdenLeft = false;
				if (connection.status() && userId) {
					connection.send('move', {
						type: 'none'
					});
				}
			}
		});

	KeyboardJS.on('right, d',
		function () {
			if (!holdenRight) {
				holdenRight = true;
				if (connection.status() && userId) {
					connection.send('move', {
						type: 'right'
					});
				}
			}
		},
		function () {
			if (holdenRight) {
				holdenRight = false;
				if (connection.status() && userId) {
					connection.send('move', {
						type: 'none'
					});
				}
			}
		});

	KeyboardJS.on('q',
		function () {
			if (!holdenQ && checkFocus()) {
				holdenQ = true;
				if (holdenE && holdenQ) direction = TargetingDirections.both;
				else direction = TargetingDirections.left;
			}
		},
		function () {
			if (holdenQ) {
				holdenQ = false;
				if (!holdenE) direction = TargetingDirections.none;
				else direction = TargetingDirections.right;
			}
		});

	KeyboardJS.on('e',
		function () {
			if (!holdenE && checkFocus()) {
				holdenE = true;
				if (holdenE && holdenQ) direction = TargetingDirections.both;
				else direction = TargetingDirections.right;
			}
		},
		function () {
			if (holdenE) {
				holdenE = false;
				if (!holdenQ) direction = TargetingDirections.none;
				else direction = TargetingDirections.left;
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
		function () {
			if (!holdenEsc && checkFocus()) {
				holdenEsc = true;
				console.log('Toggle menu');
			}
		},
		function () {
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
		bind: function (id) {
			userId = id;
		},
		unbind: function () {
			userId = null;
		}
	}
});

var direction = TargetingDirections.none;
