caribbeanWarApp.service('userStorage', function () {
	var user = {
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
