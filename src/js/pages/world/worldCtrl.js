caribbeanWarApp.controller('worldCtrl', ['$scope', '$state', '$rootScope', 'connection', 'userStorage',
	function ($scope, $state, $rootScope, connection, userStorage) {
		console.log("World CTRL");

		if (!userStorage.status()) {
			connection.close();
			userStorage.reset();
			$state.go('login');
		}

		$scope.user = userStorage.get();
		$scope.showMenu = true;
		$scope.showMap = false;

		$scope.options = [
			{
				name: "Resume",
				action: function () {
					$scope.showMenu = false;
				}
			},
			{
				name: "Settings",
				action: function () {

				}
			},
			{
				name: "Exit",
				action: function () {
					connection.send("exitWorld", {});
					$state.go('harbor');
				}
			}
		];

		$scope.toogleMap = function () {
			$scope.showMap = !$scope.showMap;
		};

		$scope.toogleMenu = function () {
			$scope.showMenu = !$scope.showMenu;
		};
	}
]);
