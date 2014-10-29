var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var calculateCurve = function(start, end){
	var curve = [];
	var mid1 = new BABYLON.Vector3(start.x + (end.x - start.x)/4,
							1,
							start.z + (end.z - start.z)/4);
	var mid2 = new BABYLON.Vector3(start.x + (end.x - start.x)/2,
							1.4,
							start.z + (end.z - start.z)/2);
	var mid3 = new BABYLON.Vector3(start.x + (end.x - start.x)*3/4,
							1,
							start.z + (end.z - start.z)*3/4);
	curve.push(start);
	curve.push(mid1);
	curve.push(mid2);
	curve.push(mid3);
	curve.push(end);
	return curve;
};