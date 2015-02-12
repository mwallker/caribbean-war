angular.module('render').service('renderHandler', ['CameraHandle', 'Templates', function (CameraHandle, Templates) {

	//Find canvas
	var canvas = $('#renderCanvas')[0];
	var engine = null;
	var scene = null;
	var camera = null;

	var content = null;

	//Timer setup
	var deltaTime = 0;
	var delay = 0;

	//Render events
	window.addEventListener('resize', function () {
		if (engine) {
			engine.resize();
		}
	});

	//RENDER API's METHODS
	function createScene(label) {
		engine = new BABYLON.Engine(canvas, true);
		scene = new BABYLON.Scene(engine);
		camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

		content = Templates[label](scene, camera);

		scene.activeCamera = camera;
		camera.attachControl(canvas);

		deltaTime = Date.now();

		var update = function () {
			delay = Math.abs(deltaTime - Date.now()) * 0.001;

			content.onUpdate(delay);

			deltaTime = Date.now();
		};

		scene.registerBeforeRender(update);

		engine.runRenderLoop(function () {
			scene.render();
		});
	}

	function disposeScene() {
		if (engine) {
			engine.stopRenderLoop();
			engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true);
			engine.dispose();
			return true;
		} else {
			return false;
		}
	}

	return {
		load: createScene,
		dispose: disposeScene
	};
}]);

function ShipController(mesh, options) {
	var ship = angular.extend(mesh, options);

	var sailsMode = 0;
	var wheelMode = 0;

	if (ship.controled) {

	} else {

	}

	// EVENTS
	KeyboardJS.on('up, w', function () {
		if (checkFocus() && sailsMode <= 3) {
			sailsMode++;
		}
	});

	KeyboardJS.on('down, s', function () {
		if (checkFocus() && sailsMode > 0) {
			sailsMode--;
		}
	});

	KeyboardJS.on('left, d', function () {
		if (checkFocus()) wheelMode = -1;
	}, function () {
		if (checkFocus()) wheelMode = 0;
	});

	KeyboardJS.on('right, a', function () {
		if (checkFocus()) wheelMode = 1;
	}, function () {
		if (checkFocus()) wheelMode = 0;
	});

	function startRotation() {};

	function stopRotation() {};

	return {
		move: function (delay) {
			obs = lerp(obs, ranged(-0.3, 0.3), 0.03);

			ship.speed = lerp(ship.speed, sailsMode * ship.maxSpeed * delay / 4, 0.01);

			//Movement
			ship.position.x = ship.position.x + Math.cos(ship.rotation.y) * ship.speed;
			ship.position.z = ship.position.z + Math.sin(ship.rotation.y) * ship.speed;
			ship.position.y = ship.position.y + Math.sin(timer * 1.2) / (ship.weight * 0.3);

			//Rotation
			ship.rotation.y = ship.rotation.y + (wheelMode * ship.speed * 0.075) / (sailsMode + 1);
			ship.rotation.x = lerp(ship.rotation.x, wheelMode * ship.speed * 0.7 + obs, 0.02);
			ship.rotation.z = ship.speed * 0.4 + Math.sin(timer * 1.2) * 0.06;
		}
	};
}


var holdenE = false,
	holdenQ = false,
	holdenSpace = false;
var direction = TargetingDirections.none;

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
		if (checkFocus()) {
			if ((holdenE || holdenQ) && !holdenSpace) holdenSpace = true;
		}
	},
	function () {
		if (holdenSpace) {
			holdenSpace = false;
		}
	});
