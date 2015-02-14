angular.module('render').factory('Components', function ($rootScope, KeyEvents, userStorage) {

	function CameraController(bindedCamera, options) {
		var camera = {};

		var locked = false;

		var minDist = 5,
			maxDist = 20,
			normalAlpha = -Math.PI,
			normalBeta = 1.2,
			minBeta = 0.2,
			maxBeta = (Math.PI / 2) * 0.9,
			lerpFactor = 0.1;

		var observeTimer = 0;

		if (bindedCamera && options) {
			camera = bindedCamera;
			camera.radius = options.radius || maxDist / 2;
			camera.alpha = options.alpha || normalAlpha;
			camera.beta = options.beta || normalBeta;
		}

		$('#renderCanvas').on('mousedown', function (event) {
			locked = true;
		});

		$(document).on('mouseup', function (event) {
			locked = false;
		});

		return {
			baseCorrection: function () {
				if (camera) {
					camera.alpha %= Math.PI * 2;

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
				if (direction !== TargetingDirections.none) {
					if (direction == TargetingDirections.both) {
						camera.alpha = lerp(camera.alpha, -(Math.PI + target.y), lerpFactor);
						camera.beta = lerp(camera.beta, minBeta, lerpFactor);
					} else {
						camera.alpha = lerp(camera.alpha, -(Math.PI + target.y) - direction * Math.PI, lerpFactor);
						camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
					}
				}
			},
			trackingCorrection: function (target) {
				if (!locked) {
					camera.alpha = lerp(camera.alpha, normalAlpha, lerpFactor);
					camera.beta = lerp(camera.beta, normalBeta, lerpFactor);
				}

				if (target) {
					camera.target.x = target.position.x;
					camera.target.z = target.position.z;
					camera.alpha = -target.rotation.y;
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
			}
		}
	};

	var BaseComponents = {
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
			var ship = null;

			BABYLON.SceneLoader.ImportMesh("ship", "js/graphic/models/", "ship01.babylon", scene, function (meshes) {
				var shipMesh = meshes[0];

				if (details.location) {
					shipMesh.position = new BABYLON.Vector3(details.location.x, 0, details.location.y);
				}

				var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);

				shipMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
				shipMaterial.diffuseColor = new BABYLON.Color4(1, 1, 1, 0.5);
				shipMesh.material = shipMaterial;

				ship = angular.extend(shipMesh, {
					speed: 0,
					maxSpeed: 10,
					weight: 1000
				});

				console.log(ship);
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
				target: function () {
					return shipMesh;
				},
				getId: function () {
					return shipId;
				},
				move: function (delay) {
					if (ship) {
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

			return {
				target: box,
				move: function (delay) {
					box.rotation.y += delay * 2;
					box.position.x += delay;
				}
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
			var ocean = BaseComponents.createOcean(scene);
			var controledShip = BaseComponents.createShip(scene, {
				location: {
					x: 0,
					y: 0
				}
			});
			var cameraControl = new CameraController(camera, {});

			return {
				onUpdate: function (delay) {
					//cameraControl.baseCorrection();
					//cameraControl.trackingCorrection();
					cameraControl.observeCorrection();
				},
				unsubscribe: function () {
					cameraControl.removeEvents();
					return null;
				}
			}
		},
		'harbor': function (scene, camera) {
			var cameraControl = new CameraController(camera, {});

			var ocean = BaseComponents.createOcean(scene);
			var controledShip = BaseComponents.createShip(scene, false);

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.observeCorrection();
				},
				unsubscribe: function () {
					cameraControl.removeEvents();
					return null;
				}
			}
		},
		'world': function (scene, camera) {
			var ocean = BaseComponents.createOcean(scene);
			var ships = [];

			var user = userStorage.get();
			ships.push(BaseComponents.createShip(scene, {
				id: user.id,
				location: user.location
			}));
			KeyEvents.bind(user.id);

			var cameraControl = new CameraController(camera, {
				alpha: -Math.PI,
				beta: Math.PI / 4,
				target: ships[0].target
			});

			var neighbors = userStorage.getNeighbors();
			for (n in neighbors) {
				ships.push(BaseComponents.createShip(scene, {
					id: neighbors[n].id
				}));
			}

			var onNeigboursCallback = $rootScope.$on('neigbours', function (event, details) {
				var users = details.users;
				if (users) {
					if (users.added) {
						for (var i in users.added) {
							ships.push(BaseComponents.createShip(scene, {
								id: users.added[i].id
							}));
						}
					}
					if (users.removed) {
						for (var j in users.removed) {
							for (var s in ships) {
								if (ships[s].getId() == users.removed[j].id) {
									ships.splice(s, 1);
								}
							}
						}
					}
				}
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
					cameraControl.trackingCorrection();
					cameraControl.targetingCorrection();

					for (var item in ships) {
						ships[item].move(delay);
					}
				},
				unsubscribe: function () {
					onNeigboursCallback();
					onMoveCallback();
					cameraControl.removeEvents();
				}
			}
		}
	}
});
