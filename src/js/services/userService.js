caribbeanWarApp.service('userStorage', function () {
	var user = null;

	return {
		status: function () {
			return !!user;
		},
		set: function (data) {
			user = data;
		},
		get: function () {
			return user;
		},
		reset: function () {
			user = null;
		}
	};
});