caribbeanWarApp.service('shipControl', function () {

	var ship = {
		speed:0,
		maxSpeed:0,
		weight:0,
		rotation:0,
		position:{
			x:0,
			y:0
		}
	};
	
	//REPLACE IT LATER
	KeyboardJS.on('up, w, num8, numUp', function(){
		console.log('speed up ' + ship.speed);
		//$scope.ship.speed++;
	});

	KeyboardJS.on('down, s, num2, numDown', function(){
		console.log('slow down ' + ship.speed);
		//$scope.ship.speed--;
	});

	KeyboardJS.on('left, d, num4, numLeft', function(){
		console.log('turn left');
	});

	KeyboardJS.on('right, a, num6, numRight', function(){
		console.log('turn right');
	});
});