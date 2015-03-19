var Materials = (function (scene) {
	var instance;

	var _scene = null;

	var skyboxMaterial = null;

	function createInstance(scene) {
		if (!scene) return;
		_scene = scene;

		return {
			sky: skyboxMaterial
		};
	}

	return function (scene) {
		if (!instance) {
			instance = createInstance(scene);
		}
		return instance;
	};
})();
