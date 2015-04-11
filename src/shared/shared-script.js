//Smoothing value's changes
function lerp(start, end, delta) {
	return (start + (delta || 0.01) * (end - start));
}

//Get random value from range
function randomRange(min, max) {
	return Math.random() * (max - min) + min;
}

//Calculate coordinates of the plane
function coordinateOrigin(location, size) {
	if (!location || !size) return new BABYLON.Vector3(0, 0, 0);
	return new BABYLON.Vector3((location.x / size).toFixed() * size || 0, 0, (location.z / size).toFixed() * size || 0);
}

//Common objects
var TargetingDirections = {
	none: 0,
	left: -1,
	right: 1,
	both: 2
};

function checkFocus() {
	return !$("input").is(':focus');
}

function correctAngle(angle) {
	var min = Math.PI / 180,
		max = Math.PI / 32;
	if (isNaN(angle)) return min;
	if (angle > max) {
		return max;
	} else {
		if (angle < min) {
			return min;
		}
		return angle;
	}
}

function resolveAngles(angle, direction) {
	var normalAngle = -(Math.PI + angle);
	if (direction == TargetingDirections.both) {
		return [normalAngle - Math.PI / 2, normalAngle + Math.PI / 2];
	} else {
		return [normalAngle + direction * Math.PI / 2];
	}
}

//TODO remove "magic numbers" with constants
/**
 * Calculate targetting curves
 * @param {Object} position - Position of central point
 * @param {number} position.x - X coord
 * @param {number} position.y - Y coord
 * @param {Object} options - Options
 * @param {string} options - Options
 */
function calculateCurve(position, options) {
	if (options.direction == TargetingDirections.none) {
		return [];
	} else {
		var curve = [];

		var angles = resolveAngles(options.alpha, options.direction);
		var distance = getDistance(100, correctAngle(options.angle));
		var height = getHeight(100, correctAngle(options.angle))/2;
		var scatter = options.scatter || 0;

		//Cashing values
		var cosS = distance * Math.cos(scatter),
			sinS = distance * Math.sin(scatter),
			cosA = 0,
			sinA = 0;

		//Coordinates of the corners
		var dxU = 0,
			dxD = 0,
			dzU = 0,
			dzD = 0;

		//Count of steps
		var n = 5;

		console.log(height);

		for (var i = 0; i < angles.length; i++) {
			cosA = Math.cos(angles[i]);
			sinA = Math.sin(angles[i]);

			dxU = cosA * cosS - sinA * sinS;
			dxD = cosA * cosS + sinA * sinS;
			dzU = sinA * cosS + cosA * sinS;
			dzD = sinA * cosS - cosA * sinS;


			for (var j = 0; j <= n; j++) {
				curve.push({
					x: position.x + dxU * j / n - sinA,
					y: Math.sin(Math.PI * j / n) * height,
					z: position.z + dzU * j / n + cosA
				});
			}
			for (var k = n; k >= 0; k--) {
				curve.push({
					x: position.x + dxD * k / n + sinA,
					y: Math.sin(Math.PI * k / n) * height,
					z: position.z + dzD * k / n - cosA
				});
			}
		}
		return curve;
	}
}

function getDistance(speed, alpha) {
	return speed * speed * Math.sin(2 * alpha) / 9.8;
}

function getHeight(speed, angle) {
	return (speed * speed * Math.sin(angle) * Math.sin(angle)) / (2 * 9.8);
}

function timeFormat(timestamp) {
	var time = new Date(timestamp);
	var hours = (time.getHours() > 9 ? '' : '0') + time.getHours(),
		minutes = (time.getMinutes() > 9 ? '' : '0') + time.getMinutes(),
		seconds = (time.getSeconds() > 9 ? '' : '0') + time.getSeconds();
	return hours + ':' + minutes + ':' + seconds;
}

function switchFullscreen(condition) {
	if (!condition) {
		if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	} else {
		if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen();
		}
	}
}
