caribbeanWarApp.service('shipControl', function () {

	var ship = {
		initiated: true,
		speed: 0,
		sailsMode: 0,
		wheelMode: 0,
		maxSpeed: 10,
		weight: 1000,
		position:{
			x: 0,
			y: 0,
			angle: 0
		}
	};
	
	var checkFocus = function(){
		return !$("input").is(':focus');
	};

	KeyboardJS.on('up, w, num8, numUp', function(){
		if(checkFocus() && ship.sailsMode <= 3){
			ship.sailsMode++;
			console.log(ship.speed);
		}
	});

	KeyboardJS.on('down, s, num2, numDown', function(){
		if(checkFocus() && ship.sailsMode > 0){
			ship.sailsMode--;
			console.log(ship.speed);
		}
	});

	KeyboardJS.on('left, d, num4, numLeft',
		function(){
			if(checkFocus()){
				ship.wheelMode = -1;
				console.log(ship.wheelMode);
			}
		},
		function(){
			if(checkFocus()){
				ship.wheelMode = 0;
				console.log(ship.wheelMode);
			}
		});

	KeyboardJS.on('right, a, num6, numRight', 
		function(){
			if(checkFocus()){
				ship.wheelMode = 1;
				console.log(ship.wheelMode);
			}
		},
		function(){
			if(checkFocus()){
				ship.wheelMode = 0;
				console.log(ship.wheelMode);
			}
		});

	return {
		initShip: function(ship){

		},
		moveShip: function(delay){
			if(ship.initiated){
				var velocity = 
				ship.speed = ship.sailsMode*ship.maxSpeed/3;

				ship.position.x = ship.position.x + Math.cos(ship.position.angle)*ship.speed*delay;
				ship.position.y = ship.position.y + Math.sin(ship.position.angle)*ship.speed*delay;
			}
			return {
				x: ship.position.x,
				y: ship.position.y
			};
		},
		rotateShip: function(delay){
			if(ship.initiated){
				ship.position.angle = ship.position.angle + (ship.wheelMode*ship.speed*delay)/(ship.sailsMode+1);
			}
			return {
				angle: ship.position.angle
			};
		}
	};
});