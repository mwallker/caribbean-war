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
		holdenSpace = false;

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

	KeyboardJS.on('left, d',
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

	KeyboardJS.on('right, a',
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
				console.log(event);
				holdenQ = true;
				if (holdenE && holdenQ) direction = TargetingDirections.both;
				else direction = TargetingDirections.left;
			}
		},
		function () {
			if (holdenQ) {
				console.log(event);
				holdenQ = false;
				if (!holdenE) direction = TargetingDirections.none;
				else direction = TargetingDirections.right;
			}
		});

	KeyboardJS.on('e',
		function () {
			if (!holdenE && checkFocus()) {
				console.log(event);
				holdenE = true;
				if (holdenE && holdenQ) direction = TargetingDirections.both;
				else direction = TargetingDirections.right;
			}
		},
		function () {
			if (holdenE) {
				console.log(event);
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
