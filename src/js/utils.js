//FPS Monitoring (only for development)
// ====== start ======
var count = 0, buffer = [];
setInterval(function(){ $('#fps').text(count.toFixed()); }, 75);

function fps(value) {
    buffer.push(1/value);
    if(buffer.length >= 30) buffer.shift();
    count = buffer.reduce(function(a, b) { return a + b; })/(buffer.length);
}
// ====== end =======


//Smoothing value's changes
var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

//Get random value from range
var randomRange = function(min, max){
	return Math.random()*(max - min) + min;
};

//Common objects
var states = {stoped:'S', preparing: 'P', running: 'R'};
var targetingDirection = {none: 0, left: -1, right: 1, both: 2};

var correctDictance = function (dist, max, min) {
    if(dist > max) {
        return max;
    }
	else {
        if(dist < min) {
            return min;
        }
		else {
            return dist;
        }
    }
}

var resolveAngles = function (angle, direction) {
    var normalAngle = -(Math.PI + angle);
    if(direction = targetingDirection.both){
        return [normalAngle - Math.PI/2, normalAngle + Math.PI/2];
    }
    else{
        return [normalAngle + direction*Math.PI/2];
    }
}

//http://plnkr.co/edit/vBxFqfwt7TyAaV3xtpFj?p=preview
var calculateCurve = function (start, end, options) {
    if(options.direction == targetingDirection.none){
        return [];
    }
    else {
        var curve = [];

        var angles = resolveAngles(options.angle, options.direction);
        var distance = correctDictance(Math.hypot(end.x - start.x, end.z - start.z), 20, 100);
        var scatter = options.scatter || 0;

        //Cashing values
        var cosS = distance*Math.cos(scatter), sinS = distance*Math.sin(scatter), cosA = 0, sinA = 0;

        //Coordinates of the corners
        var dxU = 0, dxD = 0, dzU =0, dzD = 0;

        //Count of lines steps
        var n = 3;

        for(var i = 0; i < angles.length; i++){
            cosA = Math.cos(angles[i]);
            sinA = Math.sin(angles[i]);

            dxU = cosA*cosS - sinA*sinS;
            dxD = cosA*cosS + sinA*sinS;
            dzU = sinA*cosS + cosA*sinS;
            dzD = sinA*cosS - cosA*sinS;

            for(var j = 0; j <= n; j++){
                /*curve.push({x: start.x + dxU*j/n - sinA,
                            y: Math.sin(Math.PI*j/n)*distance*0.03,
                            z: start.z + dzU*j/n + cosA});*/

                curve.push(new BABYLON.Vector3(start.x + dxU*j/n - sinA,
                                            Math.sin(Math.PI*j/n)*distance*0.03,
                                            start.z + dzU*j/n + cosA));
            }
            for(var k = n; k >= 0; k--){
                /*curve.push({x: start.x + dxD*k/n + sinA,
                            y: Math.sin(Math.PI*k/n)*distance*0.03,
                            z: start.z + dzD*k/n - cosA});*/

                curve.push(new BABYLON.Vector3(start.x + dxD*k/n + sinA,
                                            Math.sin(Math.PI*k/n)*distance*0.03,
                                            start.z + dzD*k/n - cosA));
            }
        }
        return curve;
    }
};
