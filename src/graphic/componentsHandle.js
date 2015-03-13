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

	var BaseComponents = {
		//Envirement
		createOcean: function (_scene) {

			var scene = _scene;

			//Light
			var light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-1, -10, 0), scene);

			light.position = new BABYLON.Vector3(0, 40, 0);
			light.diffuse = new BABYLON.Color3(1, 1, 1);
			light.specular = new BABYLON.Color3(1, 1, 1);
			light.intensity = 1;

			//Water
			/*
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
*/
			var extraGround = BABYLON.Mesh.CreateGround('extraGround', 1000, 1000, 1, scene, false);
			var extraGroundMaterial = new BABYLON.StandardMaterial('extraGround', scene);
			extraGroundMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			extraGroundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
			//extraGroundMaterial.uScale = 60;
			//extraGroundMaterial.vScale = 60;
			extraGround.position.y = -10;
			extraGround.material = extraGroundMaterial;


			// Skybox
			var skybox = BABYLON.Mesh.CreateBox('skyBox', 1000, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);

			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('images/TropicalSunnyDay', scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

			skybox.material = skyboxMaterial;


			var water = BABYLON.Mesh.CreateGround('water', 1000, 1000, 1, scene, false);
			var waterMaterial = new WORLDMONGER.WaterMaterial('water', scene, light);
			//waterMaterial.refractionTexture.renderList.push(skybox);
			waterMaterial.refractionTexture.renderList.push(extraGround);

			//waterMaterial.reflectionTexture.renderList.push(ground);
			waterMaterial.reflectionTexture.renderList.push(skybox);

			water.isPickable = false;
			water.material = waterMaterial;

			return {
				alive: function (delay) {

				},
				addObject: function (obj) {
					//waterMaterial.reflectionTexture.renderList.push(obj);
					//console.log(waterMaterial.reflectionTexture.renderList.push(obj));
					//water.material = waterMaterial;
				}
			};
		},
		//Ship
		createShip: function (scene, details) {
			var ship = null;
			var shipMesh = null;

			BABYLON.SceneLoader.ImportMesh('ship', 'graphic/models/', 'ship01.babylon', scene, function (meshes) {
				shipMesh = meshes[0];

				if (details.location) {
					shipMesh.position = new BABYLON.Vector3(details.location.x, 0, details.location.y);
				}
				shipMesh.rotation.y = details.alpha || 0;

				var shipMaterial = new BABYLON.StandardMaterial('shipMaterial', scene);

				shipMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
				shipMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
				shipMesh.material = shipMaterial;

				ship = angular.extend(shipMesh, {
					speed: 0,
					maxSpeed: 12,
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
				timer = 0,
				correctionTimer = 0;

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
				correctPosition: function (next) {
					if (!ship) return;
					$('#coordXL').text(ship.position.x.toFixed(5));
					$('#coordYL').text(ship.position.z.toFixed(5));
					$('#coordAlphaL').text(ship.rotation.y.toFixed(5));

					$('#coordXS').text(next.x.toFixed(5));
					$('#coordYS').text(next.z.toFixed(5));
					$('#coordAlphaS').text(next.alpha.toFixed(5));
					if (correctionTimer > 3) {
						ship.position.x = lerp(ship.position.x, next.x, 0.5);
						ship.position.z = lerp(ship.position.z, next.z, 0.5);
						ship.rotation.y = lerp(ship.rotation.y, next.alpha, 0.5);
						correctionTimer = 0;
					} else {
						correctionTimer += (1 / 60);
					}
				},
				getPosition: function () {
					return {
						x: ship ? ship.position.x : 0,
						z: ship ? ship.position.z : 0,
						alpha: ship ? ship.rotation.y : 0
					};
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
		axis: function (scene) {
			var _axis = [];
			var count = 20,
				ratio = 0.2,
				velocity = 10;
			var materials = [
				new BABYLON.StandardMaterial('xMaterial', scene),
				new BABYLON.StandardMaterial('yMaterial', scene),
				new BABYLON.StandardMaterial('zMaterial', scene)
			];
			materials[0].diffuseColor = new BABYLON.Color3(1, 0, 0);
			materials[1].diffuseColor = new BABYLON.Color3(0, 1, 0);
			materials[2].diffuseColor = new BABYLON.Color3(0, 0, 1);

			for (var d = 0; d < 3; d++) {
				var temp = [];
				for (var i = 0; i < count; i++) {
					var obj = BABYLON.Mesh.CreateBox('ax_' + d + '_' + i, 2, scene);
					obj.material = materials[d];
					if (d === 0) obj.position.x = velocity * i;
					if (d === 1) obj.position.y = velocity * i;
					if (d === 2) obj.position.z = velocity * i;
					temp.push(obj);
				}
				_axis.push(temp);
			}

			return {
				target: {
					position: new BABYLON.Vector3(0, 0, 0),
					rotation: new BABYLON.Vector3(0, 0, 0)
				},
				move: function () {
					for (var d = 0; d < 3; d++) {
						for (var i = 0; i < count; i++) {
							if (d === 0) _axis[d][i].position.x = (_axis[d][i].position.x < count * velocity) ? _axis[d][i].position.x + ratio : 0;
							if (d === 1) _axis[d][i].position.y = (_axis[d][i].position.y < count * velocity) ? _axis[d][i].position.y + ratio : 0;
							if (d === 2) _axis[d][i].position.z = (_axis[d][i].position.z < count * velocity) ? _axis[d][i].position.z + ratio : 0;
						}
					}
				}
			};
		},
		//Targeting Curve(s)
		getCurves: function (scene) {
			var reffer = scene;
			var lines = scene.getMeshByName('lines') || new BABYLON.Mesh.CreateLines('lines', [], scene);
			//var hit = reffer.pick(0, 0);
			var collection = [];

			return {
				update: function (point, direction) {
					if (lines) lines.dispose();

					if (direction !== TargetingDirections.none) {
						//hit = reffer.pick(reffer.pointerX, reffer.pointerY);
						collection = calculateCurve(point, {
							alpha: point.alpha,
							angle: (1 - reffer.pointerX / window.height) * (Math.PI / 36),
							scatter: Math.PI / 9,
							direction: direction
						});
						if (collection.length) {
							lines = new BABYLON.Mesh.CreateLines('lines', collection, reffer);
						}
					} else {
						collection = [];
					}
				}
			};
		}
	};

	return {
		'login': function (scene, camera) {
			var ocean = BaseComponents.createOcean(scene);
			var ship = BaseComponents.createShip(scene, {});
			var cameraControl = new CameraController(camera, {});

			//var axis = BaseComponents.axis(scene);

			ocean.addObject(ship);
			return {
				onUpdate: function (delay) {
					cameraControl.observeCorrection();
					//axis.move();
				},
				unsubscribe: function () {
					cameraControl.removeEvents();
					return null;
				}
			};
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
			};
		},
		'world': function (scene, camera) {
			var ocean = BaseComponents.createOcean(scene);
			var ships = [];

			var user = userStorage.get();
			var ship = BaseComponents.createShip(scene, {
				id: user.id,
				location: user.location,
				alpha: user.alpha
			});
			ocean.addObject(newShip);
			ships.push(ship);

			var curves = BaseComponents.getCurves(scene);

			var targetDirection = TargetingDirections.none;

			//var axis = BaseComponents.axis(scene);

			var cameraControl = new CameraController(camera, {
				target: ship.getPosition()
			});

			var neighbors = userStorage.getNeighbors();
			for (var n in neighbors) {
				console.log(neighbors[n]);
				ships.push(BaseComponents.createShip(scene, {
					id: neighbors[n].id,
					location: neighbors[n].location,
					alpha: neighbors[n].alpha
				}));
			}

			var onPositionCallback = $rootScope.$on('position', function (event, details) {
				ship.correctPosition({
					x: details.x,
					z: details.y,
					alpha: details.alpha
				});

			});

			$('#renderCanvas').on('directionKey', function (event, data) {
				targetDirection = !!data ? data : TargetingDirections.none;
			});

			$('#renderCanvas').on('shootKey', function (event) {
				console.log('Shoot!');
			});

			var onNeigboursCallback = $rootScope.$on('neighbours', function (event, details) {
				var users = details;
				if (users) {
					if (users.added) {
						for (var i in users.added) {
							if (users.added[i].id != user.id) {
								var newShip = BaseComponents.createShip(scene, {
									id: users.added[i].id,
									location: users.added[i].location,
									alpha: users.added[i].alpha
								})
								ocean.addObject(newShip);
								ships.push(newShip);
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
						//ships[i].correctPosition(details.location);
						break;
					}
				}
			});

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.trackingCorrection(ship.getPosition());
					cameraControl.targetingCorrection();

					curves.update(ship.getPosition(), targetDirection);

					//axis.move();

					for (var item in ships) {
						ships[item].move(delay);
					}
				},
				unsubscribe: function () {
					onNeigboursCallback();
					onMoveCallback();
					cameraControl.removeEvents();
				}
			};
		}
	};
});
