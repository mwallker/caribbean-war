angular.module('render').factory('renderHandler', ['Components', function (Components) {

	//Find canvas
	BABYLON.Engine.ShadersRepository = '';
	var canvas = $('#renderCanvas')[0];
	var engine = null;
	var scene = null;
	var camera = null;
	var materials = null;

	var content = null;

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
		camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 0, BABYLON.Vector3.Zero(), scene);

		content = Components[label](scene, camera);

		scene.activeCamera = camera;
		camera.attachControl(canvas);

		var update = function () {
			content.onUpdate(engine.getDeltaTime() * 0.001);
		};
		scene.registerBeforeRender(update);

		engine.runRenderLoop(function () {
			scene.render();
		});
	}

	function disposeScene() {
		if (engine) {
			if (content) content.unsubscribe();
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
