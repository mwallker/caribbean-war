caribbeanWarApp
	.directive('viewer', ['shipControl', 'cameraSetup', '$document', function (shipControl, cameraSetup, $document) {
        return { 
            templateUrl: 'js/modules/viewer/viewer-template.html',
            restrict: 'E',
            scope:{},
            link:function(scope, element, attr){
				if (BABYLON.Engine.isSupported()) {

				    var canvas = $('#renderCanvas')[0];
				    var engine = new BABYLON.Engine(canvas, true);
				    var delay = 0;

					BABYLON.SceneLoader.Load('js/modules/viewer/', "login.babylon", engine, function (scene) {

			            scene.executeWhenReady(function () {
			            	var deltaTime = +Date.now();

			                var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);       
			                var ship = scene.meshes[0];

			                var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
			                ship.ambienrColor = new BABYLON.Color3(0, 0, 0);
							ship.specularColor = new BABYLON.Color3(1, 1, 1);
							ship.diffuseColor = new BABYLON.Color3(1, 1, 1);
							ship.material = shipMaterial;

			                var cameraTarget = {};
			                cameraTarget.position = BABYLON.Vector3.Zero();
			                cameraTarget.rotation = {y: 0};

			                console.log(camera);

							scene.activeCamera = camera;	
			                cameraSetup.initCamera(camera, cameraTarget, canvas);
							camera.attachControl(canvas);

							(function(){
								//Light
								var light = new BABYLON.DirectionalLight("Dir", new BABYLON.Vector3(0, -100, 0), scene);
								light.diffuse = new BABYLON.Color3(1, 1, 1);
								light.specular = new BABYLON.Color3(1, 1, 1);
								light.intensity = 1;
							})();

							(function(){
								var ground = BABYLON.Mesh.CreateGround("ground", 10000, 10001, 2, scene);
								var water = new BABYLON.StandardMaterial("water", scene);
								water.specularColor = new BABYLON.Color3(0.653, 0.780, 0.954);
								water.diffuseColor = new BABYLON.Color3(0.653, 0.780, 0.954);
								water.alpha = 0.62;
								ground.material = water;
							})();

							(function(){
								// Skybox
								var skybox = BABYLON.Mesh.CreateBox("skyBox", -1000, scene);
								var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

								//skyboxMaterial.backFaceCulling = false;
								//skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
								//skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
								skyboxMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.8, 1);
								skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
								skyboxMaterial.specularPower = 21;
								skybox.material = skyboxMaterial;
							})();

			                var beforeRenderFunction = function () {
					            //MOTOR
					            delay = Math.abs(deltaTime - +Date.now())*0.001;

								var t = shipControl.moveShip(delay);

			                	ship.position.x = cameraTarget.position.x = t.x;
								ship.position.z = cameraTarget.position.z = t.y;
								ship.position.y = t.z;

			                	ship.rotation.y = cameraTarget.rotation.y = - t.angle;
			                	ship.rotation.x = - t.vSlope;
			  		            ship.rotation.z = t.hSlope;

		  		            	$document.on('mouseup', function(event) {
									cameraSetup.lockCamera(false);
								});

								element.on('mousedown', function(event) {
									cameraSetup.lockCamera(true);
								});
								cameraSetup.correctCamera(cameraTarget);
			                    // CAMERA

					            deltaTime = +Date.now();
					        };

        					scene.registerBeforeRender(beforeRenderFunction);

			                engine.runRenderLoop(function() {
			                    scene.render();
			                });
			            });
			        }, function (progress) {
			            // To do: give progress feedback to user
			        });

					window.addEventListener("resize", function () {
						engine.resize();
					});
				}
            }    
        };
    }]);