var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var createCamera = function(scene){
	BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
};



