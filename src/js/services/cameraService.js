caribbeanWarApp.service('cameraSetup', function(){
	var camera = null;
	var target = null;
	var canvas = null;

	var settings = {
		//Distance
		radius: 23,
		minDist: 5,
		maxDist: 50,
		//Rotation
		beta: 1.2,
		minBeta: 0.1,
		maxBeta: 0.9,
		factor: 0.1
	};

	var lockCamera = false;

	return {
		settings: settings,
		correctCamera: function(){
			if(camera && target && canvas){

				if(!lockCamera){
	            	camera.alpha = lerp(camera.alpha, -(Math.PI + target.rotation.y), settings.factor);
	            	camera.beta = lerp(camera.beta, settings.beta, settings.factor);
	            }
				if (camera.beta < settings.minBeta)
					camera.beta = settings.minBeta;
	            else if (camera.beta > (Math.PI / 2) * settings.maxBeta)
	                camera.beta = (Math.PI / 2) * settings.maxBeta;

	            if (camera.radius > settings.maxDist)
	                camera.radius = settings.maxDist;

	            if (camera.radius < settings.minDist)
	                camera.radius = settings.minDist;
			}
		},
		lockCamera: function(status){
			lockCamera = status;
		},
		initCamera: function(cam, tar, can){
			camera = cam;
			target = tar;
			canvas = can;

			camera.target = target.position || BABYLON.Vector3.Zero();
			camera.alpha = -(Math.PI + (target.rotation.y || 0));
			camera.beta = settings.beta;
			camera.radius = settings.radius;
		}
	};
});