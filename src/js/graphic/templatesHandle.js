angular.module('render').factory('Templates', function ($rootScope, CameraHandle) {

	var locked = false;

	//EVENTS
	$('#renderCanvas').on('mousedown', function (event) {
		locked = true;
	});

	$(document).on('mouseup', function (event) {
		locked = false;
	});

	function CameraController(bindedCamera, options) {
		var camera = {};

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

		if (!!bindedCamera && !!options) {
			camera = bindedCamera;
			camera.radius = options.radius || maxDist / 4;
			camera.alpha = options.alpha || normalAlpha;
			camera.beta = options.beta || normalBeta;
			camera.target = options.target || target;
		}

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
			targetingCorrection: function () {
				if (direction !== TargetingDirections.none) {
					if (direction == TargetingDirections.both) {
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

	var Components = {
		//Envirement
		createOcean: function (scene) {

			//Light
			var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1, -10, 0), scene);

			light.position = new BABYLON.Vector3(0, 40, 0);
			light.diffuse = new BABYLON.Color3(1, 1, 1);
			light.specular = new BABYLON.Color3(1, 1, 1);
			light.intensity = 1;

			//Water
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

			// Skybox
			var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/TropicalSunnyDay", scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

			skybox.material = skyboxMaterial;

			return {
				alive: function (delay) {

				}
			}
		},
		//Ship
		createShip: function (scene, controledByUser) {

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
		getCurves: function (scene, collection) {
			var lines = scene.getMeshByName('lines');

			if (lines) lines.dispose();

			if (collection.length) {
				lines = new BABYLON.Mesh.CreateLines('lines', collection, scene);
			}
		}
	};

	return {
		'login': function (scene, camera) {
			var cameraControl = new CameraController(camera, {
				alpha: -Math.PI,
				beta: Math.PI / 4
			});

			var ocaen = Components.createOcean(scene);
			var controledShip = Components.createShip(scene, true);
			var uncontroledShips = [];

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.overviewCorrection();
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
	}
});
