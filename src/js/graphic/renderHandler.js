angular.module('render').service('renderHandler', function () {

	//Find canvas
	var canvas = $('#renderCanvas')[0];
	var engine = null;
	var scene = null;
	var camera = null;

	var content = null;

	//Timer setup
	var deltaTime = 0;
	var delay = 0;

	function createScene(label) {
		engine = new BABYLON.Engine(canvas, true);
		scene = new BABYLON.Scene(engine);
		camera = new BABYLON.ArcRotateCamera("Camera0", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

		content = sceneTemplates[label](scene, camera);

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

	//Render events
	window.addEventListener('resize', function () {
		if (engine) {
			engine.resize();
		}
	});

	return {
		load: createScene,
		dispose: disposeScene
	};
});

var sceneTemplates = {
	'login1': function (scene, camera) {
		var start = {
				x: 0,
				y: 0,
				z: 0
			},
			end = {
				x: 0,
				y: 0,
				z: 50
			},
			options = {
				direction: targetingDirection.both,
				distance: 0,
				angle: 0,
				scatter: 0
			};
		//lines =

		var cameraControl = new cameraController(camera, {
			alpha: -Math.PI
		});

		basicComponents.water(scene);
		basicComponents.sun(scene);
		basicComponents.skybox(scene);
		basicComponents.ship(scene, true);

		return {
			onUpdate: function (delay) {
				options.distance = correctDistance(Math.hypot(end.x - start.x, end.z - start.z), 20, 100);
				options.angle = (options.angle + delay) % (Math.PI * 2);
				//options.scatter = (options.scatter + 0.01) % (Math.PI / 6);

				cameraControl.axisCorrection();
				cameraControl.lockCorrection();

				basicComponents.targetCurves(scene, calculateCurve(start, options));
			}
		}
	},
	'login': function (scene, camera) {

		var cameraControl = new cameraController(camera, {
			alpha: -Math.PI,
			beta: Math.PI / 4
		});

		basicComponents.water(scene);
		basicComponents.sun(scene);
		basicComponents.skybox(scene);
		basicComponents.ship(scene, true);
		//basicComponents.targetCurves(scene, []);

		return {
			onUpdate: function (delay) {
				cameraControl.baseCorrection();
				cameraControl.lockCorrection();
				cameraControl.targetingCorrection();
				//cameraControl.observeCorrection();
			}
		}
	},
	'harbor': function (scene, camera) {

		return {
			onUpdate: function (delay) {

			}
		}
	},
	'world': function (scene, camera) {

		return {
			onUpdate: function (delay) {

			}
		}
	}
};

var basicComponents = {
	//Light
	sun: function (scene) {
		var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1, -10, 0), scene);
		light.position = new BABYLON.Vector3(0, 40, 0);
		light.diffuse = new BABYLON.Color3(1, 1, 1);
		light.specular = new BABYLON.Color3(1, 1, 1);
		light.intensity = 1;
	},
	//Water
	water: function (scene) {
		var water = BABYLON.Mesh.CreateGround("water", 5000, 5000, 100, scene);

		var waterMaterial = new BABYLON.StandardMaterial("water", scene);
		waterMaterial.bumpTexture = new BABYLON.Texture("images/water.png", scene);
		waterMaterial.bumpTexture.uOffset = 10;
		waterMaterial.bumpTexture.vOffset = 10;
		waterMaterial.bumpTexture.uScale = 10;
		waterMaterial.bumpTexture.vScale = 10;
		waterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		waterMaterial.diffuseColor = new BABYLON.Color3(0.653, 0.780, 0.954);
		waterMaterial.alpha = 0.62;

		water.material = waterMaterial;
	},
	// Skybox
	skybox: function (scene) {
		skybox = BABYLON.Mesh.CreateBox("skyBox", 5000, scene);

		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/TropicalSunnyDay", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

		skybox.material = skyboxMaterial;
	},
	//Test Obj.
	test: function (scene) {
		var buffer = [];
		for (var i = 0; i < 1; i++) {
			buffer.push(new BABYLON.Mesh.CreateBox("box_" + i, 5, scene));
		}
	},
	//Ship
	ship: function (scene, controledByUser) {

		//TEMPORARY
		var ship = BABYLON.Mesh.CreateBox("ship", 2, scene);
		var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
		ship.specularColor = new BABYLON.Color4(0.6, 0.2, 0.2, 0.5);
		ship.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2);
		ship.material = shipMaterial;

		if (controledByUser) {
			//Ship under user's control

		} else {
			//View of ship

		}
	},
	//Targeting Curve(s)
	targetCurves: function (scene, collection) {
		var lines = scene.getMeshByName('lines');

		if (lines) lines.dispose();

		if (collection.length) {
			lines = new BABYLON.Mesh.CreateLines('lines', collection, scene);
		}
	}
};

function cameraController(bindedCamera, options) {
	//Consts
	var minDist = 5,
		maxDist = 40,
		normalAlpha = -Math.PI,
		normalBeta = 1.2,
		minBeta = 0.2,
		maxBeta = (Math.PI / 2) * 0.9,
		lerpFactor = 0.1;

	var camera = bindedCamera;

	//Params
	var target = options.target || {
		position: BABYLON.Vector3.Zero(),
		rotation: BABYLON.Vector3.Zero()
	};
	camera.radius = options.radius || maxDist / 4;
	camera.alpha = options.alpha || normalAlpha;
	camera.beta = options.beta || normalBeta;

	camera.target = target;

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
		lockCorrection: function () {
			if (!lockCamera) {
				camera.alpha = lerp(camera.alpha, normalAlpha, lerpFactor);
				camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
			}
		},
		targetingCorrection: function () {
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
			camera.alpha = observeTimer;
			camera.beta = Math.cos(observeTimer) * Math.PI / 7 + Math.PI / 3;
		}
	}

};

function shipController(ship, cannon) {
	var timer = 0;
	var focusTimer = 0;

	return {
		//move: function (ship, delay) {}
	}
}

//=====================================================
//=======   SCREEN, MOUSE and KEYBOARD EVENTS   =======
//=====================================================

var lockCamera = false,
	holdenE = false,
	holdenQ = false,
	holdenSpace = false;

var direction = targetingDirection.none;

$(document).on('mouseup', function (event) {
	lockCamera = false;
});

$('#renderCanvas').on('mousedown', function (event) {
	lockCamera = true;
});

KeyboardJS.on('q',
	function () {
		if (!holdenQ && checkFocus()) {
			holdenQ = true;
			if (holdenE && holdenQ) direction = targetingDirection.both;
			else direction = targetingDirection.left;
		}
	},
	function () {
		if (holdenQ) {
			holdenQ = false;
			if (!holdenE) direction = targetingDirection.none;
			else direction = targetingDirection.right;
		}
	});

KeyboardJS.on('e',
	function () {
		if (!holdenE && checkFocus()) {
			holdenE = true;
			if (holdenE && holdenQ) direction = targetingDirection.both;
			else direction = targetingDirection.right;
		}
	},
	function () {
		if (holdenE) {
			holdenE = false;
			if (!holdenQ) direction = targetingDirection.none;
			else direction = targetingDirection.left;
		}
	});
