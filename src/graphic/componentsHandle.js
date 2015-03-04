angular.module('render').factory('Components', function ($rootScope, KeyEvents, userStorage) {
	function CameraController(bindedCamera, options) {
		var camera = {};

		var direction = TargetingDirections.none;

		var locked = false;

		var minDist = 5,
			maxDist = 20,
			normalAlpha = -Math.PI,
			normalBeta = 1.2,
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

		$('#renderCanvas').on('cameraAction', function (event, data) {
			console.log(data);
			if (data) direction = data;
			else direction = TargetingDirections.none;
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
						camera.alpha = lerp(camera.alpha, -(Math.PI + targetAlpha), lerpFactor);
						camera.beta = lerp(camera.beta, minBeta, lerpFactor);
					} else {
						camera.alpha = lerp(camera.alpha, -(Math.PI + targetAlpha) - direction * Math.PI, lerpFactor);
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
					camera.alpha = lerp(camera.alpha, -targetAlpha + normalAlpha, lerpFactor);
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
				$('#renderCanvas').off('cameraAction');
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
			var shipMesh = null;

			BABYLON.SceneLoader.ImportMesh("ship", "graphic/models/", "ship01.babylon", scene, function (meshes) {
				shipMesh = meshes[0];

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
			});

			var shipId = details.id;

			var sailsMode = 0;
			var wheelMode = 0;

			//Consts
			var _angleSpeed = 0.075;
			var _velocity = 0.01;

			var obs = 0,
				timer = 0;

			return {
				changeState: function (type) {
					switch (type) {
					case 'upward':
						sailsMode = Math.min(sailsMode + 1, 3);
						break;
					case 'backward':
						sailsMode = Math.max(sailsMode - 1, 0);
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
					default:
						wheelMode = 0;
						break;
					}
				},
				getId: function () {
					return shipId;
				},
				getPosition: function () {
					return {
						x: ship ? ship.position.x : 0,
						z: ship ? ship.position.z : 0,
						alpha: ship ? ship.rotation.y : 0
					}
				},
				move: function (delay) {
					if (ship) {
						timer = timer + delay % (2 * Math.PI);
						obs = lerp(obs, randomRange(-0.3, 0.3), 0.03);

						ship.speed = lerp(ship.speed, sailsMode * ship.maxSpeed * delay / 4, _velocity);

						//Movement
						ship.position.x += Math.cos(ship.rotation.y) * ship.speed;
						ship.position.z += Math.sin(-ship.rotation.y) * ship.speed;
						ship.position.y += Math.sin(timer * 1.2) / (ship.weight * 0.3);

						$('#coordX').text(ship.position.x.toFixed(1));
						$('#coordY').text(ship.position.z.toFixed(1));



						//Rotation
						ship.rotation.y = (ship.rotation.y + (wheelMode * ship.speed * _angleSpeed) / (sailsMode + 1)) % (2 * Math.PI);
						ship.rotation.x = lerp(ship.rotation.x, wheelMode * ship.speed * 0.7 + obs, 0.02);
						ship.rotation.z = ship.speed * 0.4 + Math.sin(timer * 1.2) * 0.06;
					}
				},
				remove: function () {
					shipMesh.dispose();
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
					box.rotation.y += delay;
					//box.position.x += delay;
					box.position.z -= delay;
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
			var ship = BaseComponents.createShip(scene, {});
			var cameraControl = new CameraController(camera, {});

			return {
				onUpdate: function (delay) {
					cameraControl.observeCorrection();
				},
				unsubscribe: function () {
					cameraControl.removeEvents();
					return null;
				}
			}
		},
		'harbor': function (scene, camera) {
			var ocean = BaseComponents.createOcean(scene);
			var ship = BaseComponents.createShip(scene, {});
			var cameraControl = new CameraController(camera, {});

			return {
				onUpdate: function (delay) {
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
			var ship = BaseComponents.createShip(scene, {
				id: user.id,
				location: user.location
			})
			ships.push(ship);
			KeyEvents.bind(user.id);

			var cameraControl = new CameraController(camera, {
				target: ship.getPosition()
			});

			var neighbors = userStorage.getNeighbors();
			for (var n in neighbors) {
				console.log(neighbors[n]);
				ships.push(BaseComponents.createShip(scene, {
					id: neighbors[n].id,
					location: neighbors[n].location
				}));
			}

			var onNeigboursCallback = $rootScope.$on('neighbours', function (event, details) {
				var users = details;
				if (users) {
					if (users.added) {
						for (var i in users.added) {
							if (users.added[i].id != user.id) {
								ships.push(BaseComponents.createShip(scene, {
									id: users.added[i].id,
									location: neighbors[n].location
								}));
							}
						}
					}
					if (users.removed) {
						for (var j in users.removed) {
							for (var s in ships) {
								if (ships[s].getId() == users.removed[j].id) {
									ships[s].remove();
									ships.splice(s, 1);
								}
							}
						}
					}
				}
			});

			var onMoveCallback = $rootScope.$on('move', function (event, details) {
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
					cameraControl.trackingCorrection(ship.getPosition());
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
