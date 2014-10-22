caribbeanWarApp
	.directive('viewer', function () {
        return { 
            templateUrl: 'js/modules/viewer/viewer-template.html',
            restrict: 'E',
            scope:{},
            link:function(){
				if (BABYLON.Engine.isSupported()) {

				    var canvas = $('#renderCanvas')[0];
				    var engine = new BABYLON.Engine(canvas, true);

					BABYLON.SceneLoader.Load('js/modules/viewer/', "login.babylon", engine, function (newScene) {
			            // Wait for textures and shaders to be ready
			            newScene.executeWhenReady(function () {
			                // Attach camera to canvas inputs
			                newScene.activeCamera.attachControl(canvas);

			                var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 2, newScene);


			                console.log(newScene);
			                // Once the scene is loaded, just register a render loop to render it
			                engine.runRenderLoop(function() {
			                    newScene.render();
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
    });