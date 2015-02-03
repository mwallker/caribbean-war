//FPS Monitoring
var count = 0;
setInterval(function(){
    $('#fps').text(count);
}, 100);

function fps(value) {
    count = (1/value).toFixed();
}

var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var ranged = function(min, max){
	return Math.random()*(max - min) + min;
};

var calculateCurve = function(start, angle, direction, end, scatter){
	var curve = [];
	var distance = Math.hypot(end.x - start.x, end.z - start.z);
	var rAngle = -(Math.PI + angle) + direction*Math.PI/2;

	if(distance > 100){
		distance = 100;
	}
	else {
		if(distance < 20) {
			distance = 20;
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

	var n = 9;
	var cosA = Math.cos(rAngle);
	var sinA = Math.sin(rAngle);

	for(var i = 0; i <= n; i++){
		curve.push(new BABYLON.Vector3(start.x + dxU*i/n - sinA*2,
									Math.sin(Math.PI*i/n)*distance*0.03,
									start.z + dzU*i/n + cosA));
	}
	for(var k = n; k >= 0; k--){
		curve.push(new BABYLON.Vector3(start.x + dxD*k/n + sinA*2,
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
