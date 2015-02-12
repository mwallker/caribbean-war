angular.module('render').factory('CameraHandle', function () {

	var options = {};

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

		//Params
		var camera = bindedCamera;
		camera.radius = options.radius || maxDist / 4;
		camera.alpha = options.alpha || normalAlpha;
		camera.beta = options.beta || normalBeta;
		camera.target = options.target || target;

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
			overviewCorrection: function () {
				if (!locked) {
					camera.alpha = lerp(camera.alpha, normalAlpha, lerpFactor);
					camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
				}
			},
			targetingCorrection: function (direction) {
				if (direction !== targetingDirection.none) {
					if (direction == targetingDirection.both) {
						camera.alpha = lerp(camera.alpha, -(Math.PI + target.rotation.y), lerpFactor);
						camera.beta = lerp(camera.beta, minBeta, lerpFactor);
					} else {
						camera.alpha = lerp(camera.alpha, -(Math.PI + target.rotation.y) - direction * Math.PI, lerpFactor);
						camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
					}
				}
			},
			observeCorrection: function () {
				observeTimer = (observeTimer + 0.0003) % (2 * Math.PI);
				if (camera) {
					camera.alpha = observeTimer;
					camera.beta = Math.cos(observeTimer) * Math.PI / 7 + Math.PI / 3;
				}
			}
		}

	};
});
