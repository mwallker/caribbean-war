function CameraController(bindedCamera, options) {
	var camera = {};

	var direction = TargetingDirections.none;

	var locked = false;

	var minDist = 5,
		maxDist = 20,
		normalAlpha = -Math.PI,
		normalBeta = 1.35,
		minBeta = 0.2,
		maxBeta = (Math.PI / 2) * 0.9,
		lerpFactor = 0.1,
		targetAlpha = 0;

	var observeTimer = 0;

	if (bindedCamera) {
		camera = bindedCamera;
		camera.radius = maxDist / 2;
		camera.alpha = normalAlpha;
		camera.beta = normalBeta;
		if (options && options.target) {
			camera.target.x = options.target.x || 0;
			camera.target.z = options.target.z || 0;
			targetAlpha = options.target.alpha || 0;
		}
	}

	$('#renderCanvas').on('mousedown', function (event) {
		locked = true;
	});

	$(document).on('mouseup', function (event) {
		locked = false;
	});

	$('#renderCanvas').on('directionKey', function (event, data) {
		if (data) direction = data;
		else direction = TargetingDirections.none;
	});

	return {
		baseCorrection: function () {
			if (camera) {
				camera.alpha %= (2 * Math.PI);

				if (camera.beta < minBeta) {
					camera.beta = minBeta;
				} else {
					if (camera.beta > maxBeta) camera.beta = maxBeta;
				}

				if (camera.radius > maxDist) camera.radius = maxDist;

				if (camera.radius < minDist) camera.radius = minDist;
			}
		},
		targetingCorrection: function () {
			if (!locked && direction !== TargetingDirections.none) {
				if (direction == TargetingDirections.both) {
					camera.alpha = lerp(camera.alpha, -(Math.PI + targetAlpha), lerpFactor);
					camera.beta = lerp(camera.beta, minBeta, lerpFactor);
				} else {
					camera.alpha = lerp(camera.alpha, -(Math.PI + targetAlpha) % (2 * Math.PI) - (direction * Math.PI), lerpFactor);
					camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
				}
			}
		},
		trackingCorrection: function (target) {
			if (target) {
				camera.target.x = target.x;
				camera.target.z = target.z;
				targetAlpha = target.alpha || 0;
			}
			if (!locked) {
				camera.alpha = lerp(camera.alpha, (-targetAlpha + normalAlpha) % (2 * Math.PI), lerpFactor);
				camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
			}
		},
		observeCorrection: function () {
			observeTimer = (observeTimer + 0.003) % (2 * Math.PI);
			camera.alpha = observeTimer;
			camera.beta = Math.cos(observeTimer) * Math.PI / 7 + Math.PI / 3;
			camera.radius = maxDist / 2;
		},
		removeEvents: function () {
			$('#renderCanvas').off('mousedown');
			$(document).off('mouseup');
			$('#renderCanvas').off('directionKey');
		}
	};
}
