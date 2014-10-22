caribbeanWarApp
	.directive('viewer', ['shipControl', function (shipControl) {
        return { 
            templateUrl: 'js/modules/viewer/viewer-template.html',
            restrict: 'E',
            scope:{},
            link:function(){
				if (BABYLON.Engine.isSupported()) {

				    var canvas = $('#renderCanvas')[0];
				    var engine = new BABYLON.Engine(canvas, true);
				    var delay = 0;

					BABYLON.SceneLoader.Load('js/modules/viewer/', "login.babylon", engine, function (newScene) {

			            newScene.executeWhenReady(function () {
			            	var deltaTime = +Date.now();

			                newScene.activeCamera.attachControl(canvas);

			                var ground = BABYLON.Mesh.CreateGround("ground", 10000, 10001, 2, newScene);
			                var ship = newScene.meshes[0];

			                console.log(newScene.activeCamera);

			                engine.runRenderLoop(function() {
			                	delay = Math.abs(deltaTime - +Date.now())*0.001;

			                	//console.log(delay);
			                	
			                	var r = shipControl.rotateShip(delay);
								var t = shipControl.moveShip(delay);

			                	ship.position.x = t.x;
								ship.position.z = t.y;

			                	ship.rotation.y = -r.angle;

			                    newScene.render();
			                    deltaTime = +Date.now();
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