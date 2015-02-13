angular.module('render').factory('Components', function ($rootScope, KeyEvents, userStorage) {

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
				camera.radius = maxDist / 4;
			}
		}
	};

	var baseComponents = {
		//Envirement
		createOcean: function (scene) {

			//Light
			var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1, -10, 0), scene);

			light.position = new BABYLON.Vector3(0, 40, 0);
			light.diffuse = new BABYLON.Color3(1, 1, 1);
			light.specular = new BABYLON.Color3(1, 1, 1);
			light.intensity = 1;

			//Water
			var water = BABYLON.Mesh.CreateGround("water", 2000, 2000, 200, scene);
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
		createShip: function (scene, details) {

			var shipMesh = BABYLON.Mesh.CreateBox('s_' + details.id, 2, scene);
			var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
			shipMesh.specularColor = new BABYLON.Color4(0.6, 0.2, 0.2, 0.5);
			shipMesh.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2);
			shipMesh.material = shipMaterial;

			var ship = angular.extend(shipMesh, {
				speed: 0,
				maxSpeed: 10,
				weight: 1000
			});

			var shipId = details.id;

			var sailsMode = 0;
			var wheelMode = 0;

			var obs = 0,
				timer = 0;

			return {
				changeState: function (type) {
					switch (type) {
					case 'upward':
						if (sailsMode <= 3) ++sailsMode;
						break;
					case 'backward':
						if (sailsMode > 0) --sailsMode;
						break;
					case 'right':
						wheelMode = 1;
						break;
					case 'left':
						wheelMode = -1;
						break;
					case 'none':
						wheelMode = 0;
						break;
					}
				},
				getId: function () {
					return shipId;
				},
				move: function (delay) {
					timer = timer + delay % (2 * Math.PI);
					obs = lerp(obs, randomRange(-0.3, 0.3), 0.03);

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
		},
		//Box
		test: function (scene) {
			var box = BABYLON.Mesh.CreateBox('box', 2, scene);
			var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
			box.specularColor = new BABYLON.Color4(0.6, 0.2, 0.2, 0.5);
			box.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2);
			box.material = boxMaterial;
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
			var cameraControl = new CameraController(camera, {});

			var ocean = baseComponents.createOcean(scene);
			var controledShip = baseComponents.createShip(scene, false);

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.observeCorrection();
				}
			}
		},
		'harbor': function (scene, camera) {
			var cameraControl = new CameraController(camera, {});

			var ocean = baseComponents.createOcean(scene);
			var controledShip = baseComponents.createShip(scene, false);

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.observeCorrection();
				}
			}
		},
		'world': function (scene, camera) {
			var ocean = baseComponents.createOcean(scene);

			var ships = [];

			var cameraControl = new CameraController(camera, {
				alpha: -Math.PI,
				beta: Math.PI / 4
			});

			baseComponents.test(scene);

			var user = userStorage.get();
			KeyEvents.bind(user.id);

			ships.push(new baseComponents.createShip(scene, {
				id: user.id
			}));

			$rootScope.$on('neigbours', function (event, details) {
				var users = details.users;
				for (var u in users) {
					for(var s in ships){
						if(ships[s].getId() == users[u].id){

						}
					}
				}
				console.log('Will be removed');
			});

			var onUserEnterCallback = $rootScope.$on('onUserEnter', function (event, details) {
				ships.push(new baseComponents.createShip(scene, {
					id: details.id
				}));
				console.log(details);
			});

			var onUserExitCallback = $rootScope.$on('onUserExit', function (event, details) {
				for (var item in ships) {
					if (ships[item].getId() == details.id) {
						ships.splice(item, 1);
						break;
					}
				}
				console.log(details);
			});

			var onMoveCallback = $rootScope.$on('move', function (event, details) {
				console.log(details);
				for (var i in ships) {
					if (ships[i].getId() == details.id) {
						ships[i].changeState(details.type);
						break;
					}
				}
			});

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.overviewCorrection();
					cameraControl.targetingCorrection();

					for (var item in ships) {
						ships[item].move(delay);
					}
				},
				removeEvents: function () {
					onUserEnterCallback();
					onUserExitCallback();
					onMoveCallback();
				}
			}
		}
	}
});
