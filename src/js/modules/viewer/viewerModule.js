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
				    var scene = new BABYLON.Scene(engine);

				    var deltaTime = +Date.now();

			        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);       
			        var ship = BABYLON.Mesh.CreateBox("ship", 5, scene);

	        		var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
					ship.specularColor = new BABYLON.Color3(1, 1, 1);
					ship.diffuseColor = new BABYLON.Color3(0.3, 0.6, 1);
					ship.material = shipMaterial;

	                var cameraTarget = {};
	                cameraTarget.position = BABYLON.Vector3.Zero();
	                cameraTarget.rotation = {y: 0};

	                console.log(scene);

					scene.activeCamera = camera;	
	                cameraSetup.initCamera(camera, cameraTarget, canvas);
					camera.attachControl(canvas);

					//Light
					var light = null;
					(function(){		
						light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1, -10, 0), scene);
						light.position = new BABYLON.Vector3(20, 40, 20);
						light.diffuse = new BABYLON.Color3(1, 1, 1);
						light.specular = new BABYLON.Color3(1, 1, 1);
						light.intensity = 1;
					})();

					// Skybox
					var skybox = null;
					(function(){
						skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);

						var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
						skyboxMaterial.backFaceCulling = false;
						skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/TropicalSunnyDay", scene);
						skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
						skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
						skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

						skybox.material = skyboxMaterial;
					})();

					//Water
					(function(){
						var water = BABYLON.Mesh.CreateGround("water", 5000, 5000, 2, scene);

						var waterMaterial = new BABYLON.StandardMaterial("water", scene);
						waterMaterial.bumpTexture = new BABYLON.Texture("images/water.png", scene);
						waterMaterial.bumpTexture.uOffset = 100;
						waterMaterial.bumpTexture.vOffset = 100;
						waterMaterial.bumpTexture.uScale = 100;
						waterMaterial.bumpTexture.vScale = 100;
						waterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
						waterMaterial.diffuseColor = new BABYLON.Color3(0.653, 0.780, 0.954);
						waterMaterial.alpha = 0.62;

						water.material = waterMaterial;
					})();

					var lines = null;
					shipControl.initShip(scene, ship);
					
	                var beforeRenderFunction = function () {
			            //MOTOR
			            delay = Math.abs(deltaTime - +Date.now())*0.001;

						
						shipControl.update(delay);

	                	cameraTarget.position.x = skybox.position.x = ship.position.x;
						cameraTarget.position.z = skybox.position.z = ship.position.z;

						cameraTarget.position.y = skybox.position.y = 0;
	                	cameraTarget.rotation.y = ship.rotation.y;


  		            	$document.on('mouseup', function(event) {
							cameraSetup.lockCamera(false);
						});

						element.on('mousedown', function(event) {
							cameraSetup.lockCamera(true);
						});

						cameraSetup.correctCamera(shipControl.targeting);

			            deltaTime = +Date.now();
			        };

					scene.registerBeforeRender(beforeRenderFunction);

	                engine.runRenderLoop(function() {
	                    scene.render();
	                });

					window.addEventListener("resize", function () {
						engine.resize();
					});
				}
            }    
        };
    }]);