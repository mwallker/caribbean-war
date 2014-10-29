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
						var water = BABYLON.Mesh.CreateGround("water", 1000, 1000, 2, scene);

						var waterMaterial = new BABYLON.StandardMaterial("water", scene);
						waterMaterial.bumpTexture = new BABYLON.Texture("images/water.png", scene);
						waterMaterial.bumpTexture.uOffset = 100;
						waterMaterial.bumpTexture.vOffset = 100;
						waterMaterial.bumpTexture.uScale = 100;
						waterMaterial.bumpTexture.vScale = 100;
						waterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
						waterMaterial.diffuseColor = new BABYLON.Color3(0.653, 0.780, 0.954);
						//waterMaterial.alpha = 0.62;

						water.material = waterMaterial;
					})();

					var lines = null;

	                var beforeRenderFunction = function () {
			            //MOTOR
			            delay = Math.abs(deltaTime - +Date.now())*0.001;

						var t = shipControl.moveShip(delay);

	                	ship.position.x = cameraTarget.position.x = skybox.position.x = t.x;
						ship.position.z = cameraTarget.position.z = skybox.position.z = t.y;
						ship.position.y = t.z;
						cameraTarget.position.y = skybox.position.y = 0;

	                	ship.rotation.y = cameraTarget.rotation.y = - t.angle;
	                	ship.rotation.x = - t.vSlope;
	  		            ship.rotation.z = t.hSlope;

						//Targeting
						if(shipControl.targeting() !== 0){
							var pickResult = scene.pick(scene.pointerX, scene.pointerY);
							if(lines){
								lines.dispose();
							}
							//cameraSetup.lockCamera(true);
							lines = BABYLON.Mesh.CreateLines("lines", calculateCurve(ship.position, pickResult.pickedPoint), scene);
						    console.log();
						}else{
							if(lines){
								lines.dispose();
								lines = null;
								console.log(0);
								cameraSetup.lockCamera(false);
							}
						}

  		            	$document.on('mouseup', function(event) {
							cameraSetup.lockCamera(false);
						});

						element.on('mousedown', function(event) {
							cameraSetup.lockCamera(true);
						});

						cameraSetup.correctCamera(shipControl.targeting());

			            deltaTime = +Date.now();
			        };

					scene.registerBeforeRender(beforeRenderFunction);

	                engine.runRenderLoop(function() {
	                    scene.render();
	                });

					window.addEventListener("resize", function () {
						engine.resize();
					});


					window.addEventListener("click", function (evt) {
						var pickResult = scene.pick(evt.clientX, evt.clientY);
					   	var box = new BABYLON.Mesh.CreateBox("s", 1, scene);

						box.position = new BABYLON.Vector3(
							Math.round(pickResult.pickedPoint.x),
							Math.round(pickResult.pickedPoint.y) + 0.5,
							Math.round(pickResult.pickedPoint.z)
						);
						setTimeout(function(){
							box.dispose();
						}, 5000);
					   	console.log(scene);	
					});
				}
            }    
        };
    }]);