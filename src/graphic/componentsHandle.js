angular.module('render').factory('Components', function ($rootScope, KeyEvents, userStorage) {

	var BaseComponents = {
		//Envirement
		createOcean: function (scene) {

			//Light
			var light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-1, -10, 0), scene);

			light.position = new BABYLON.Vector3(0, 40, 0);
			light.diffuse = new BABYLON.Color3(1, 1, 1);
			light.specular = new BABYLON.Color3(1, 1, 1);
			light.intensity = 1;

			// Skybox
			var skybox = BABYLON.Mesh.CreateBox('skyBox', 800, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);

			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('images/TropicalSunnyDay', scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

			skybox.material = skyboxMaterial;

			//Water
			var extraGround = BABYLON.Mesh.CreateGround('extraGround', 1024, 1024, 2, scene, false);
			var extraGroundMaterial = new BABYLON.StandardMaterial('extraGround', scene);

			extraGroundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.3, 0.5);
			extraGroundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
			extraGround.material = extraGroundMaterial;
			extraGround.position.y = -10;

			var waterMaterial = new WORLDMONGER.WaterMaterial('water', scene, light);
			waterMaterial.refractionTexture.renderList.push(extraGround);
			waterMaterial.reflectionTexture.renderList.push(skybox);

			var planeSize = 50;
			var initiated = false;
			var waterPlanes = [];
			for (var i = 0; i < 4; i++) {
				waterPlanes[i] = BABYLON.Mesh.CreateGround('water_plane_' + i, planeSize, planeSize, 1, scene, false);
				waterPlanes[i].isPickable = false;
				waterPlanes[i].material = waterMaterial;
				waterPlanes[i].position.x = i * planeSize;
			}


			return {
				alive: function (origin) {
					if (!origin || !initiated) return;
					console.log(origin);
					skybox.position.x = lerp(skybox.position.x, origin.x, 0.2);
					skybox.position.z = lerp(skybox.position.z, origin.z, 0.2);

					extraGround.position.x = lerp(extraGround.position.x, origin.x, 0.2);
					extraGround.position.z = lerp(extraGround.position.z, origin.z, 0.2);

					var center = coordinateOrigin(origin, planeSize);
					for (var i in waterPlanes) {
						var deltaX = origin.x - waterPlanes[i].position.x;
						var deltaZ = origin.z - waterPlanes[i].position.z;

						var verticalAlign = (Math.abs(deltaX) > planeSize * 0.9) ? planeSize * Math.sign(deltaX) : 0;
						var horizontalAlign = (Math.abs(deltaZ) > planeSize * 0.9) ? planeSize * Math.sign(deltaZ) : 0;
						waterPlanes[i].position = center.add(new BABYLON.Vector3(verticalAlign, 0, horizontalAlign));
						//console.log(waterPlanes[i].position.x + ' ' + waterPlanes[i].position.z);
					}
				},
				setOrigin: function (origin) {
					var center = coordinateOrigin(origin, planeSize);

					var verticalAlign = Math.sign(origin.x - center.x) || 1;
					var horizontalAlign = Math.sign(origin.z - center.z) || 1;

					waterPlanes[0].position = center;
					waterPlanes[1].position = center.add(new BABYLON.Vector3(planeSize * verticalAlign, 0, 0));
					waterPlanes[2].position = center.add(new BABYLON.Vector3(planeSize * verticalAlign, 0, planeSize * horizontalAlign));
					waterPlanes[3].position = center.add(new BABYLON.Vector3(0, 0, planeSize * horizontalAlign));
					for (i in waterPlanes) {
						console.log(waterPlanes[i].position);
					}
					initiated = true;
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
					shipMesh.position = details.location;
				}
				shipMesh.rotation.y = details.alpha || 0;

				var shipMaterial = new BABYLON.StandardMaterial('shipMaterial', scene);

				shipMaterial.specularColor = new BABYLON.Color3(0, 0, 1);
				shipMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
				shipMaterial.alpha = 0.5;

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
					$('#coordXL').text(ship.position.x.toFixed(2));
					$('#coordYL').text(ship.position.z.toFixed(2));
					$('#coordAlphaL').text(ship.rotation.y.toFixed(2));

					if (correctionTimer > 0.05) {
						ship.position.x = lerp(ship.position.x, next.x, 0.2);
						ship.position.z = lerp(ship.position.z, next.z, 0.2);
						ship.rotation.y = lerp(ship.rotation.y, next.alpha, 0.2);
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
						timer += delay % (2 * Math.PI);
						obs = lerp(obs, randomRange(-0.7, 0.7), 0.001);

						ship.speed = lerp(ship.speed, sailsMode * ship.maxSpeed * delay / 4, _velocity);

						//Movement
						ship.position.x += Math.cos(ship.rotation.y) * ship.speed;
						ship.position.z += Math.sin(-ship.rotation.y) * ship.speed;
						ship.position.y += Math.sin(timer * 1.2) * 0.0007;

						//Rotation
						ship.rotation.y = (ship.rotation.y + (wheelMode * ship.speed * _angleSpeed) / (sailsMode + 1)) % (2 * Math.PI);
						ship.rotation.x = lerp(ship.rotation.x, wheelMode * ship.speed + obs, 0.02);
						ship.rotation.z = ship.speed * 0.4 + Math.sin(timer * 1.2) * 0.02;
					}
				},
				remove: function () {
					shipMesh.dispose();
				}
			};
		},
		//Cannon Ball
		cannonBall: function (scene, details) {
			var ball = new BABYLON.Mesh.CreateSphere('cannon_ball_' + details.id + Math.random().toFixed(2) * 100, 8.0, 0.4, scene);
			ball.position = new BABYLON.Vector3(details.location.x, details.location.y, details.location.z);

			var ballMaterialA = new BABYLON.StandardMaterial('shipMaterial', scene);
			ballMaterialA.diffuseColor = new BABYLON.Color3(1, 1, 1);
			ballMaterialA.specularColor = new BABYLON.Color3(1, 1, 1);

			var ballMaterialB = new BABYLON.StandardMaterial('shipMaterial', scene);
			ballMaterialB.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
			ballMaterialB.specularColor = new BABYLON.Color3(0, 0, 1);

			ball.material = details.id ? ballMaterialA : ballMaterialB;

			var t = 0;
			var intervalId = setInterval(function () {
				t += (scene.getEngine().getDeltaTime() * 0.001);
				if (ball.position.y < 0) {
					ball.dispose();
					clearInterval(intervalId);
				} else {
					ball.position.x = details.location.x + 100 * t * Math.cos(details.angle) * Math.cos(details.alpha);
					ball.position.z = details.location.z + 100 * t * Math.cos(details.angle) * Math.sin(details.alpha);
					ball.position.y = details.location.y + 100 * t * Math.sin(details.angle) - (9.8 * t * t) / 2;
				}
			}, 20);

			return ball;
		},
		//Box
		axis: function (scene) {
			var _axis = [];
			var count = 30,
				ratio = 0.2,
				velocity = 20;
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
					var obj = BABYLON.Mesh.CreateBox('ax_' + d + '_' + i, 5, scene);
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
			var ratio = 0;
			var collection = [];

			return {
				update: function (point, direction) {
					if (lines) lines.dispose();
					if (direction !== TargetingDirections.none) {
						ratio = 3 - (reffer.pointerY / window.innerHeight) * 6;
						collection = calculateCurve(point, {
							alpha: point.alpha,
							angle: ratio * Math.PI / 24,
							scatter: Math.PI / 18,
							direction: direction
						});
						if (collection.length) {
							lines = new BABYLON.Mesh.CreateLines('lines', collection, reffer);
						}
					} else {
						collection = [];
					}
				},
				angle: function () {
					return correctAngle(ratio * Math.PI / 24);
				}
			};
		}
	};

	return {
		'login': function (scene, camera) {
			var ship = BaseComponents.createShip(scene, {});
			var ocean = BaseComponents.createOcean(scene);
			var cameraControl = new CameraController(camera, {});

			return {
				onUpdate: function (delay) {
					//cameraControl.observeCorrection();
					cameraControl.baseCorrection();
					ship.move(delay);
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

			var user = userStorage.get();
			var ships = [];
			var shipPosition = new BABYLON.Vector3(user.location.x, 0, user.location.y);
			var ship = BaseComponents.createShip(scene, {
				id: user.id,
				location: shipPosition,
				alpha: user.alpha
			});

			ships.push(ship);
			ocean.setOrigin(shipPosition);

			var curves = BaseComponents.getCurves(scene);

			var targetDirection = TargetingDirections.none;

			var axis = BaseComponents.axis(scene);

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

			$('#renderCanvas').on('directionKey', function (event, data) {
				targetDirection = !!data ? data : TargetingDirections.none;
			});

			$('#renderCanvas').on('shootKey', function (event) {
				var shootAlpha = -ship.getPosition().alpha - targetDirection * Math.PI / 2;
				var optionsLocal = {
					id: 0,
					location: {
						x: ship.getPosition().x,
						y: 0.001,
						z: ship.getPosition().z
					},
					angle: curves.angle(),
					alpha: shootAlpha
				};
				var optionsServer = {
					location: {
						x: ship.getPosition().x,
						y: 0.001,
						z: ship.getPosition().z
					},
					angle: curves.angle(),
					direction: targetDirection
				};

				if (targetDirection == TargetingDirections.both) {
					optionsLocal.alpha = -ship.getPosition().alpha + Math.PI / 2;
					optionsServer.direction = TargetingDirections.left;
					$rootScope.$emit('send', {
						action: 'shoot',
						details: optionsServer
					});
					BaseComponents.cannonBall(scene, optionsLocal);

					optionsLocal.alpha = -ship.getPosition().alpha - Math.PI / 2;
					optionsServer.direction = TargetingDirections.right;
					$rootScope.$emit('send', {
						action: 'shoot',
						details: optionsServer
					});
					BaseComponents.cannonBall(scene, optionsLocal);
				} else {
					BaseComponents.cannonBall(scene, optionsLocal);
					$rootScope.$emit('send', {
						action: 'shoot',
						details: optionsServer
					});
				}
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
								});
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

			var onPositionCallback = $rootScope.$on('position', function (event, details) {
				ship.correctPosition({
					x: details.x,
					z: details.y,
					alpha: details.alpha
				});

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

			var onShootCallback = $rootScope.$on('shoot', function (event, details) {
				for (var i in ships) {
					if (ships[i].getId() == details.id) {
						BaseComponents.cannonBall(scene, details);
						return;
					}
				}
			});

			var onHitCallback = $rootScope.$on('hit', function (event, details) {
				console.log('Boooooooooom!');
			});

			var onMissCallback = $rootScope.$on('miss', function (event, details) {
				console.warn('Someone miss, MYAXAXAXAXAXA!');
			});

			return {
				onUpdate: function (delay) {
					cameraControl.baseCorrection();
					cameraControl.trackingCorrection(ship.getPosition());
					cameraControl.targetingCorrection();

					curves.update(ship.getPosition(), targetDirection);

					axis.move();

					ocean.alive(ship.getPosition());

					for (var item in ships) {
						ships[item].move(delay);
					}
				},
				unsubscribe: function () {
					onNeigboursCallback();
					onMoveCallback();
					onShootCallback();
					cameraControl.removeEvents();
				}
			};
		}
	};
});
