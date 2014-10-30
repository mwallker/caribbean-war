var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var calculateCurve = function(start, angle, direction, end, scatter){
	var curve = [];
	var distance = Math.sqrt((end.x - start.x)*(end.x - start.x) + (end.z - start.z)*(end.z - start.z));
	var rAngle = -(Math.PI + angle) + direction*Math.PI/2;

	function dx(s){
		return correctDistance(distance)*(Math.cos(rAngle+s));
	}

	function dz(s){
		return correctDistance(distance)*(Math.sin(rAngle+s));
	}

	function correctDistance(distance){
		if(distance > 50){ 
			return 50;
		}
		else {
			if(distance < 10) {
				return 10;
			}
			else{
				return distance;
			}
		}	
	}
	var startt = new BABYLON.Vector3(start.x - Math.sin(rAngle),
							0.8,
							start.z + Math.cos(rAngle));

	var mid1t = new BABYLON.Vector3(start.x + dx(scatter)/4 - Math.sin(rAngle),
							1,
							start.z + dz(scatter)/4 + Math.cos(rAngle));

	var mid2t = new BABYLON.Vector3(start.x + dx(scatter)*2/4 - Math.sin(rAngle),
							1.4,
							start.z + dz(scatter)*2/4 + Math.cos(rAngle));

	var mid3t = new BABYLON.Vector3(start.x + dx(scatter)*3/4 - Math.sin(rAngle),
							1,
							start.z + dz(scatter)*3/4 - Math.cos(rAngle));

	endt = new BABYLON.Vector3(start.x + dx(scatter) - Math.sin(rAngle),
							0,
							start.z + dz(scatter) - Math.cos(rAngle));

	endb = new BABYLON.Vector3(start.x + dx(-scatter) + Math.sin(rAngle),
							0,
							start.z + dz(-scatter) + Math.cos(rAngle));

	var mid3b = new BABYLON.Vector3(start.x + dx(-scatter)*3/4 + Math.sin(rAngle),
							1,
							start.z + dz(-scatter)*3/4 + Math.cos(rAngle));

	var mid2b = new BABYLON.Vector3(start.x + dx(-scatter)*2/4 + Math.sin(rAngle),
							1.4,
							start.z + dz(-scatter)*2/4 + Math.cos(rAngle));

	var mid1b = new BABYLON.Vector3(start.x + dx(-scatter)/4 + Math.sin(rAngle),
							1,
							start.z + dz(-scatter)/4 + Math.cos(rAngle));

	var startb = new BABYLON.Vector3(start.x + Math.sin(rAngle),
							0.8,
							start.z + Math.cos(rAngle));
	curve.push(startt);
	curve.push(mid1t);
	curve.push(mid2t);
	curve.push(mid3t);
	curve.push(endt);
	curve.push(endb);
	curve.push(mid3b);
	curve.push(mid2b);
	curve.push(mid1b);
	curve.push(startb);
	return curve;
};

var doubleCurve = function(start, angle, end, scatter){
	var m1 = calculateCurve(start, angle, -1, end, scatter);
	var m2 = calculateCurve(start, angle, 1, end, scatter);
	return m1.reverse().concat(m2);
};