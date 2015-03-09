caribbeanWarApp.service('userStorage', function () {
	var ship = {},
		user = {
			authorize: false
		};

	var neighbors = [];

	return {
		status: function () {
			return user.authorize || false;
		},

		set: function (data) {
			user = data.userInfo;
			user.authorize = true;
		},

		get: function () {
			return user;
		},

		setShip: function (data) {
			ship = data.shipInfo;
		},

		getShip: function () {
			return ship;
		},

		setNeighbors: function (data) {
			neighbors = data.nearestUsers;
		},

		getNeighbors: function () {
			return neighbors;
		},

		clearNeighbors: function () {
			neighbors = [];
		},

		reset: function () {
			user = {
				authorize: false
			};
		}
	};
});
