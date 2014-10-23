caribbeanWarApp.service('shipControl', function () {

	var ship = {
		initiated: true,
		speed: 0,
		sailsMode: 0,
		wheelMode: 0,
		maxSpeed: 15,
		weight: 1000,
		position:{
			x: 0,
			y: 0,
			angle: 0,
			slope: 0
		}
	};
	
	var checkFocus = function(){
		return !$("input").is(':focus');
	};

	KeyboardJS.on('up, w, num8, numUp', function(){
		if(checkFocus() && ship.sailsMode <= 3){
			ship.sailsMode++;
		}
	});

	KeyboardJS.on('down, s, num2, numDown', function(){
		if(checkFocus() && ship.sailsMode > 0){
			ship.sailsMode--;
		}
	});

	KeyboardJS.on('left, d, num4, numLeft',
		function(){
			if(checkFocus()){
				ship.wheelMode = -1;
			}
		},
		function(){
			if(checkFocus()){
				ship.wheelMode = 0;
			}
		});

	KeyboardJS.on('right, a, num6, numRight', 
		function(){
			if(checkFocus()){
				ship.wheelMode = 1;
			}
		},
		function(){
			if(checkFocus()){
				ship.wheelMode = 0;
			}
		});

	var linearExtrapolation = function(start, end, delta){
		return (start + (delta || 0.01)*(end - start));
	};

	return {
		initShip: function(ship){

		},
		moveShip: function(delay){
			if(ship.initiated){
				ship.speed = linearExtrapolation(ship.speed, ship.sailsMode*ship.maxSpeed*delay/3, 0.01);

				ship.position.x = ship.position.x + Math.cos(ship.position.angle)*ship.speed;
				ship.position.y = ship.position.y + Math.sin(ship.position.angle)*ship.speed;
			}
			return {
				x: ship.position.x,
				y: ship.position.y
			};
		},
		rotateShip: function(delay){
			if(ship.initiated){
				ship.position.angle = ship.position.angle + (ship.wheelMode*ship.speed*0.25)/(ship.sailsMode+1);
				ship.position.slope = linearExtrapolation(ship.position.slope, ship.wheelMode*ship.speed*0.7, 0.05);
			}
			return {
				angle: ship.position.angle,
				slope: ship.position.slope
			};
		},
		lerp: linearExtrapolation
	};
});