angular.module('render').service('cameraHandler', function () {
	console.log('ssd');
	var camera = {},
		options = {};

	var locked = false;

	//Consts
	var minDist = 5,
		maxDist = 40,
		normalAlpha = -Math.PI,
		normalBeta = 1.2,
		minBeta = 0.2,
		maxBeta = (Math.PI / 2) * 0.9,
		lerpFactor = 0.1;

	var observeTimer = 0;

	var target = {
		position: BABYLON.Vector3.Zero(),
		rotation: BABYLON.Vector3.Zero()
	};

	$(document).on('mouseup', function (event) {
		locked = false;
	});

	$('#renderCanvas').on('mousedown', function (event) {
		locked = true;
	});

	return function (bindedCamera, options) {

		camera = bindedCamera;

		//Params
		target = options.target || target;
		camera.radius = options.radius || maxDist / 4;
		camera.alpha = options.alpha || normalAlpha;
		camera.beta = options.beta || normalBeta;

		return {
			baseCorrection: function () {
				if (camera) {
					if (camera.beta < minBeta) {
						camera.beta = minBeta;
					} else {
						if (camera.beta > maxBeta) camera.beta = maxBeta;
					}

					if (camera.radius > maxDist) camera.radius = maxDist;

					if (camera.radius < minDist) camera.radius = minDist;

					return true;
				} else {
					return false;
				}
			},
			lockCorrection: function (locked) {
				if (!locked) {
					camera.alpha = lerp(camera.alpha, alpha, lerpFactor);
					camera.beta = lerp(camera.beta, beta, lerpFactor);
				}
			},
			targetingCorrection: function (direction) {
				if (direction !== targetingDirection.none) {
					if (direction == targetingDirection.both) {
						camera.alpha = -(Math.PI + target.rotation.y);
						camera.beta = minBeta;
					} else {
						camera.alpha = -(Math.PI + target.rotation.y) - targeting * Math.PI / 2;
						camera.beta = normalBeta;
					}
				}
			},
			observeCorrection: function () {
				observeTimer = (observeTimer + 0.0003) % (2 * Math.PI);
				camera.alpha = observeTimer;
				camera.beta = Math.cos(observeTimer) * Math.PI / 7 + Math.PI / 3;
			}
		}

	};
});
