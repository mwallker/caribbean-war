caribbeanWarApp.service('cameraSetup', function () {
	var camera = null;
	var target = null;

	//Defaults consts
	var minDist = 5,
		maxDist = 40,
		normalBeta = 1.2,
		minBeta = 0.03,
		maxBeta = (Math.PI / 2) * 0.9,
		lerpFactor = 0.1;

	var settings = {
		radius: 23,
		alpha: 0,
		beta: 1.2
	};

	var lockCamera = false;

	$(document).on('mouseup', function (event) {
		lockCamera = false;
		console.log(lockCamera);
	});

	$('#renderCanvas').on('mousedown', function (event) {
		lockCamera = true;
		console.log('mousedown');
	});

	return {
		generalCorrection: function () {

		},
		correctCamera: function (targeting) {
			if (camera && target) {
				if (targeting <= 2 && targeting >= -1) {
					if (targeting !== 2) {
						settings.alpha = -(Math.PI + target.rotation.y);
						settings.beta = maxBeta - 0.9;
					} else {
						settings.alpha = -(Math.PI + target.rotation.y) - targeting * Math.PI / 2;
						settings.beta = normalBeta;
					}
				}

				if (!lockCamera) {
					camera.alpha = lerp(camera.alpha, settings.alpha, lerpFactor);
					camera.beta = lerp(camera.beta, settings.beta, lerpFactor);
				}

				if (camera.beta < minBeta) camera.beta = minBeta;
				else
				if (camera.beta > maxBeta) camera.beta = maxBeta;

				if (camera.radius > maxDist) camera.radius = maxDist;

				if (camera.radius < minDist) camera.radius = minDist;
			}
		},
		initCamera: function (cam, tar) {
			camera = cam;
			target = tar;

			camera.target = target.position || BABYLON.Vector3.Zero();
			camera.alpha = -(Math.PI + (target.rotation.y || 0));
			camera.beta = settings.beta;
			camera.radius = settings.radius;
		}
	};
});
