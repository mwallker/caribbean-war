var lerp = function(start, end, delta){
	return (start + (delta || 0.01)*(end - start));
};

var rand = function(min, max){
	return Math.random()*(max - min) + min;
};