caribbeanWarApp.service('cameraHandler', function () {

	var locked = false;

	$(document).on('mouseup', function (event) {
		locked = false;
	});

	$('#renderCanvas').on('mousedown', function (event) {
		locked = true;
	});

	return {};});/*function (bindedCamera, options) {
		//Consts
		var minDist = 5,
			maxDist = 40,
			normalAlpha = 0,
			normalBeta = 1.2,
			minBeta = 0.03,
			maxBeta = (Math.PI / 2) * 0.9,
			lerpFactor = 0.1;

		var camera = bindedCamera;

		//Params
		var target = options.target || {
				position: BABYLON.Vector3.Zero(),
				rotation: BABYLON.Vector3.Zero()
			},
			radius = options.radius || maxDist / 2,
			alpha = options.alpha || normalAlpha,
			beta = normalBeta;

		var observeTimer = 0;

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
			targetingCorrection: function () {

			},
			observeCorrection: function () {
				observeTimer = (observeTimer + 0.0003) % (2 * Math.PI);
				camera.alpha = observeTimer;
				camera.beta = Math.cos(observeTimer) * Math.PI / 7 + Math.PI / 3;
			}
		}

	}

});
