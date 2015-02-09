caribbeanWarApp.service('shipControl', function () {

	var ship = {
		initiated: false,
		speed: 0,
		sailsMode: 0,
		wheelMode: 0,
		maxSpeed: 10,
		weight: 1000,
		cannon: {
			scatter: {
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

	var timer = 0;
	var obs = 0;

	var checkFocus = function () {
		return !$("input").is(':focus');
	};

	KeyboardJS.on('up, w', function () {
		if (checkFocus()) {
			if (ship.sailsMode <= 3) ship.sailsMode++;
		}
	});

	KeyboardJS.on('down, s', function () {
		if (checkFocus()) {
			if (ship.sailsMode > 0) ship.sailsMode--;
		}
	});

	KeyboardJS.on('left, d', function () {
		if (checkFocus()) {
			if (checkFocus()) ship.wheelMode = -1;
		}
	}, function () {
		if (checkFocus()) {
			if (checkFocus()) ship.wheelMode = 0;
		}
	});

	KeyboardJS.on('right, a', function () {
		if (checkFocus()) {
			if (checkFocus()) ship.wheelMode = 1;
		}
	}, function () {
		if (checkFocus()) {
			if (checkFocus()) ship.wheelMode = 0;
		}
	});

	//Shoting
	var holdenE = false,
		holdenQ = false,
		holdenSpace = false;
	var direction = targetingDirection.none;
	var focusTimer = 0;

	KeyboardJS.on('space',
		function () {
			if (checkFocus()) {
				if ((holdenE || holdenQ) && !holdenSpace) holdenSpace = true;
			}
		},
		function () {
			if (holdenSpace) {
				holdenSpace = false;
				focusTimer = 0;
			}
		});


	KeyboardJS.on('q',
		function () {
			if (!holdenQ && checkFocus()) {
				holdenQ = true;
				direction = targetingDirection.left;
				focusTimer = 0;
			}
		},
		function () {
			if (holdenQ) {
				holdenQ = false;
				focusTimer = 0;
				if (!holdenE) direction = targetingDirection.none;
			}
		});

	KeyboardJS.on('e',
		function () {
			if (!holdenE && checkFocus()) {
				holdenE = true;
				direction = targetingDirection.right;
				focusTimer = 0;
			}
		},
		function () {
			if (holdenE) {
				holdenE = false;
				focusTimer = 0;
				if (!holdenQ) direction = targetingDirection.none;
			}
		});

	var calculateDistance = function (target) {
		var distance = Math.hypot(target.x - ship.mesh.position.x, target.z - ship.mesh.position.z);
		if (distance > 100) distance = 100;
		else if (distance < 20) distance = 20;
	};



	function cannonsManager(options) {
		var scatter = 0;
		var focusTime = 0;

		return {

		}
	}

	var calculateScatter = function () {
		if (holdenSpace) {
			if (focusTimer < ship.cannon.scatter.time) {
				return ship.cannon.scatter.value - ship.cannon.scatter.value * (focusTimer / ship.cannon.scatter.time);
			}
			return 0;
		}
		return ship.cannon.scatter.value;
	};

	return {
		initShip: function (scene, init_ship) {
			if (!ship.initiated) {
				ship.mesh = init_ship;
				ship.environment = scene;
				ship.initiated = true;
			}
		},
		disposeShip: function () {
			if (ship.initiated) {
				ship.mesh.dispose();
				ship.environment = null;
				ship.initiated = false;
			}
		},
		update: function (delay) {
			if (ship.initiated) {
				timer = timer + delay % (2 * Math.PI);
				obs = lerp(obs, ranged(-0.3, 0.3), 0.03);

				ship.speed = lerp(ship.speed, ship.sailsMode * ship.maxSpeed * delay / 4, 0.01);

				//Movement
				ship.mesh.position.x = ship.mesh.position.x + Math.cos(ship.mesh.rotation.y) * ship.speed;
				ship.mesh.position.z = ship.mesh.position.z + Math.sin(ship.mesh.rotation.y) * ship.speed;
				ship.mesh.position.y = ship.mesh.position.y + Math.sin(timer * 1.2) / (ship.weight * 0.3);

				//Rotation
				ship.mesh.rotation.y = ship.mesh.rotation.y + (ship.wheelMode * ship.speed * 0.075) / (ship.sailsMode + 1);
				ship.mesh.rotation.x = lerp(ship.mesh.rotation.x, ship.wheelMode * ship.speed * 0.7 + obs, 0.02);
				ship.mesh.rotation.z = ship.speed * 0.4 + Math.sin(timer * 1.2) * 0.06;

				if (holdenQ || holdenE) {
					if (holdenQ && holdenE) {

					} else {

					}
				}
			}
		}
	};
});
