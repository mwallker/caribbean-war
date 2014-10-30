var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var calculateCurve = function(start, angle, direction, end, scatter){
	var curve = [];
	var distance = Math.sqrt((end.x - start.x)*(end.x - start.x) + (end.z - start.z)*(end.z - start.z));
	var rAngle = -(Math.PI + angle) + direction*Math.PI/2;

	if(distance > 50){ 
			distance = 50;
	}
	else {
		if(distance < 10) {
			distance = 10;
		}
		else{
			distance = distance;
		}
	}

	scatter = scatter || 0;

	var dxU = distance*Math.cos(rAngle + scatter);
	var dxD = distance*Math.cos(rAngle - scatter);
	var dzU = distance*Math.sin(rAngle + scatter);
	var dzD = distance*Math.sin(rAngle - scatter);

	var n = 3;
	var m = 10;
	var cosA = Math.cos(rAngle);
	var sinA = Math.sin(rAngle);

	for(var i = 0; i <= n; i++){
		curve.push(new BABYLON.Vector3(start.x + dxU*i/n - sinA, 
									Math.sin(Math.PI*i/n)*distance*0.03, 
									start.z + dzU*i/n + cosA));
	}
	for(var k = n; k >= 0; k--){
		curve.push(new BABYLON.Vector3(start.x + dxD*k/n + sinA, 
									Math.sin(Math.PI*k/n)*distance*0.03, 
									start.z + dzD*k/n - cosA));
	}
	return curve;
};

var doubleCurve = function(start, angle, end, scatter){
	var rightCurve = calculateCurve(start, angle, -1, end, scatter);
	var leftCurve = calculateCurve(start, angle, 1, end, scatter);
	return rightCurve.concat(leftCurve);
};