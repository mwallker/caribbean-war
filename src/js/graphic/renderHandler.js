angular.module('render').factory('renderHandler', ['Components', function (Components) {

	//Find canvas
	var canvas = $('#renderCanvas')[0];
	var engine = null;
	var scene = null;
	var camera = null;

	var content = null;

	//Timer setup
	var deltaTime = 0;
	var delay = 0;

	//Render events
	window.addEventListener('resize', function () {
		if (engine) {
			engine.resize();
		}
	});

	//RENDER API's METHODS
	function createScene(label) {
		engine = new BABYLON.Engine(canvas, true);
		scene = new BABYLON.Scene(engine);
		camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

		content = Components[label](scene, camera);

		scene.activeCamera = camera;
		camera.attachControl(canvas);

		deltaTime = Date.now();

		var update = function () {
			delay = Math.abs(deltaTime - Date.now()) * 0.001;

			content.onUpdate(delay);

			deltaTime = Date.now();
		};

		scene.registerBeforeRender(update);

		engine.runRenderLoop(function () {
			scene.render();
		});
	}

	function disposeScene() {
		if (engine) {
			engine.stopRenderLoop();
			engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true);
			engine.dispose();
			return true;
		} else {
			return false;
		}
	}

	return {
		load: createScene,
		dispose: disposeScene
	};
}]);
