caribbeanWarApp.service('renderService', function ($q) {

	//Find canvas
	var canvas = $('#renderCanvas')[0];
	var engine = null;
	var scene = null;
	var camera = null;

	var content = null;
	var lockCamera = false;

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

	window.addEventListener('resize', function () {
		if (engine) {
			engine.resize();
		}
	});

	$(document).on('mouseup', function (event) {
		lockCamera = false;
	});

	$('#renderCanvas').on('mousedown', function (event) {
		lockCamera = true;
	});

	return {
		load: createScene,
		dispose: disposeScene
	};
});

var sceneTemplates = {
	'login': function (scene, camera) {
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
			},
			lines = new BABYLON.Mesh.CreateLines("lines", calculateCurve(start, options), scene);

		var cameraControl = new cameraController(camera, {});

		basicComponents.water(scene);
		basicComponents.sun(scene);
		basicComponents.skybox(scene);
		basicComponents.test(scene);

		return {
			onUpdate: function (delay) {
				options.distance = correctDistance(Math.hypot(end.x - start.x, end.z - start.z), 20, 100);
				options.angle = (options.angle + delay) % (Math.PI * 2);
				options.scatter = (options.scatter + 0.01) % (Math.PI / 6);

				cameraControl.axisCorrection()

				lines.dispose();
				lines = new BABYLON.Mesh.CreateLines("lines", calculateCurve(start, options), scene);
			}
		}
	},
	'harbor': function (scene) {

		return {
			onUpdate: function (delay) {

			}
		}
	},
	'world': function (scene) {

		return {
			onUpdate: function (delay) {

			}
		}
	},
	'default': function (scene) {

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
		var water = BABYLON.Mesh.CreateGround("water", 10000, 10000, 100, scene);

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
		for (var i = 0; i < 10; i++) {
			buffer.push(new BABYLON.Mesh.CreateBox("ship_" + i, 5, scene));
		}
	},
	//Ship
	ship: function (scene, shipControl) {
		if (shipControl) {
			//Ship under user's control
		} else {
			//View of ship
		}
	}
};

function cameraController(bindedCamera, options) {
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

	return {
		axisCorrection: function () {
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
		}
	}

};

/*
    var ship = BABYLON.Mesh.CreateBox("ship", 5, scene);

    shipControl.initShip(scene, ship);

    var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
    ship.specularColor = new BABYLON.Color3(1, 1, 1);
    ship.diffuseColor = new BABYLON.Color3(0.3, 0.6, 1);
    ship.material = shipMaterial;
	var beforeRenderFunction = function () {
        cameraTarget.position.x = skybox.position.x = ship.position.x;
        cameraTarget.position.z = skybox.position.z = ship.position.z;
        cameraTarget.position.y = skybox.position.y = 0;
        cameraTarget.rotation.y = ship.rotation.y;
        cameraSetup.correctCamera(-2);
    };
*/
