$(function(){
	console.log("READY TO GO!");

	//REPLACE IT LATER
	KeyboardJS.on('up, w, num8, numUp', function(){
		console.log('speed up ' + $scope.ship.speed);
		$scope.ship.speed++;
	});

	KeyboardJS.on('down, s, num2, numDown', function(){
		console.log('slow down ' + $scope.ship.speed);
		$scope.ship.speed--;
	});

	KeyboardJS.on('left, d, num4, numLeft', function(){
		console.log('turn left');
	});

	KeyboardJS.on('right, a, num6, numRight', function(){
		console.log('turn right');
	});
});