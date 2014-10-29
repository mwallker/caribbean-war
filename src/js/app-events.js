var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var calculateCurve = function(start, angle, direction, end){
	var curve = [];
	var distance = Math.sqrt((end.x - start.x)*(end.x - start.x) + (end.z - start.z)*(end.z - start.z));

	var mid1 = new BABYLON.Vector3(start.x + distance*(Math.cos(Math.PI + angle + direction*Math.PI/2))/4,
							1,
							start.z + distance*(Math.sin(Math.PI + angle + direction*Math.PI/2))/4);
	var mid2 = new BABYLON.Vector3(start.x + distance*(Math.cos(Math.PI + angle + direction*Math.PI/2))/2,
							1.4,
							start.z + distance*(Math.sin(Math.PI + angle + direction*Math.PI/2))/2);
	var mid3 = new BABYLON.Vector3(start.x + distance*(Math.cos(Math.PI + angle + direction*Math.PI/2))*3/4,
							1,
							start.z + distance*(Math.sin(Math.PI + angle + direction*Math.PI/2))*3/4);
	end = new BABYLON.Vector3(start.x + distance*(Math.cos(Math.PI + angle + direction*Math.PI/2))*3/4,
							0,
							start.z + distance*(Math.sin(Math.PI + angle + direction*Math.PI/2)));
	curve.push(start);
	curve.push(mid1);
	curve.push(mid2);
	curve.push(mid3);
	curve.push(end);
	return curve;
};

var doubleCurve = function(start, angle, end){
	var m1 = calculateCurve(start, angle, -1, end);
	var m2 = calculateCurve(start, angle, 1, end);
	return m1.concat(m2);
};