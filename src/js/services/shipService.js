caribbeanWarApp.service('shipControl', function () {

	var ship = {
		initiated: false,
		speed: 0,
		sailsMode: 0,
		wheelMode: 0,
		maxSpeed: 10,
		weight: 1000,
		cannon:{
			scatter:{
				time: 5,
				value: 0.3
			},
			speed: 100,
			damage: 10,
			coldDown: 4
		},
		mesh: null,
		environment: null
	};
	console.log(ship);
	var timer = 0;
	var obs = 0;

	var checkFocus = function(){
		return !$("input").is(':focus');
	};

	KeyboardJS.on('up, w', function(){
		if(checkFocus() && ship.sailsMode <= 3){
			ship.sailsMode++;
		}
	});

	KeyboardJS.on('down, s', function(){
		if(checkFocus() && ship.sailsMode > 0){
			ship.sailsMode--;
		}
	});

	KeyboardJS.on('left, d',
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

	KeyboardJS.on('right, a', 
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

	//Shoting
	var holdenSpace = false;
	var focusTimer = 0;
	var onColdDown = false;
	KeyboardJS.on('space', 
		function(){
			if(checkFocus() && ((holdenE || holdenQ) && !holdenSpace)){
				if(!onColdDown){
					holdenSpace = true;
				}
			}
		},
		function(){
			if(holdenSpace){
				holdenSpace = false;
				focusTimer = 0;
				if(holdenE || holdenQ){
					console.log("Caramba! Piy piy piy!");
					onColdDown = true;
					console.log(onColdDown);
					setTimeout(function(){
						onColdDown = false;
						console.log(onColdDown);
					}, ship.cannon.coldDown*1000);
				}
			}
		});

	//Targeting
	var holdenE = false;
	var holdenQ = false;
	var direction = 0;
	KeyboardJS.on('q', 
		function(){
			if(!holdenQ && checkFocus()){
				holdenQ = true;
				direction = -1;
				focusTimer = 0;
			} 
		},
		function(){
			if(holdenQ && checkFocus()){
				holdenQ = false;
				focusTimer = 0;
				if(!holdenE) direction = 0;
			}
		});

	KeyboardJS.on('e', 
		function(){
			if(!holdenE && checkFocus()) {
				holdenE = true;
				direction = 1;
				focusTimer = 0;
			}
		},
		function(){
			if(holdenE && checkFocus()) {
				holdenE = false;
				focusTimer = 0;
				if(!holdenQ) direction = 0;
			}	
		});

	var calculateDistance = function(target){
		var distance = Math.hypot(target.x - ship.mesh.position.x, target.z - ship.mesh.position.z);
		if(distance > 100) distance = 100;
		else if(distance < 20) distance = 20;
	};

	var calculateScatter = function(){
		if(holdenSpace){
			if(focusTimer < ship.cannon.scatter.time){
				return ship.cannon.scatter.value - ship.cannon.scatter.value*(focusTimer/ship.cannon.scatter.time);
			}
			return 0;
		}
		return ship.cannon.scatter.value;
	};

	var calculatePath = function(dir){
		var path = [];
		var distance = calculateDistance(target);
		var scatter = calculateScatter(delay);
		var angle = -(Math.PI + ship.mesh.rotation.y) + dir*Math.PI/2;
		focusTimer+=delay;

		var dxU = distance*Math.cos(angle + scatter);
		var dxD = distance*Math.cos(angle - scatter);
		var dzU = distance*Math.sin(angle + scatter);
		var dzD = distance*Math.sin(angle - scatter);

		var n = 9;
		var cosA = Math.cos(angle);
		var sinA = Math.sin(angle);

		for(var i = 0; i <= n; i++){
			path.push(new BABYLON.Vector3(ship.mesh.position.x + dxU*i/n - sinA*2, 
					Math.sin(Math.PI*i/n)*distance*0.03, 
					ship.mesh.position.z + dzU*i/n + cosA));
		}
		for(var k = n; k >= 0; k--){
			path.push(new BABYLON.Vector3(ship.mesh.position.x + dxD*k/n + sinA*2, 
					Math.sin(Math.PI*k/n)*distance*0.03, 
					ship.mesh.position.z + dzD*k/n - cosA));
		}
		return path;
	};

	return {
		initShip: function(scene, ship){
			if(!ship.initiated){
				ship.mesh = ship;
				ship.environment = scene;
				ship.initiated = true;
			}
		},
		disposeShip: function(){
			if(ship.initiated){
				ship.mesh.dispose();
				ship.environment = null;
				ship.initiated = false;
			}
		},
		update: function(delay){
			if(ship.initiated){
				timer = timer + delay%(2*Math.PI);
				obs = lerp(obs, rand(- 0.3, 0.3), 0.03);
				console.log(timer);
				ship.speed = lerp(ship.speed, ship.sailsMode*ship.maxSpeed*delay/4, 0.01);

				//Movement
				ship.mesh.position.x = ship.mesh.position.x + Math.cos(ship.mesh.rotation.y)*ship.speed;
				ship.mesh.position.z = ship.mesh.position.z + Math.sin(ship.mesh.rotation.y)*ship.speed;
				ship.mesh.position.y = ship.mesh.position.y + Math.sin(timer*1.2)/(ship.weight*0.3);

				//Rotation
				ship.mesh.rotation.y = ship.mesh.rotation.y + (ship.wheelMode*ship.speed*0.075)/(ship.sailsMode+1);
				ship.mesh.rotation.x = lerp(ship.mesh.rotation.x, ship.wheelMode*ship.speed*0.7 + obs, 0.02);
				ship.mesh.rotation.z = ship.speed*0.4 + Math.sin(timer*1.2)*0.06;

				if(holdenQ || holdenE){
					if(holdenQ && holdenE){

					}
					else{

					}
				}
			}
		}
	};
});