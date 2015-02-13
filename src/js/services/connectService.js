caribbeanWarApp.service('connection', function ($q, $rootScope) {
	var socketUrl = "ws://warm-crag-3328.herokuapp.com/ws";
	var local = "ws://localhost:5000";

	var result = {};

	var socket = null;

	var deferred = null;

	result.status = function () {
		return socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING);
	};

	result.open = function (credits) {

		if (!this.status()) {

			deferred = $q.defer();

			try {
				socket = new WebSocket(socketUrl);

				socket.onopen = function () {
					console.log("Connection opened");
					deferred.resolve();
				};

				socket.onmessage = function (event) {
					console.log('Receive');
					console.log(event.data);
					var data = angular.fromJson(event.data);
					$rootScope.$emit(data.action, data.details);
				};

				socket.onerror = socket.onclose = function (e) {
					console.log(e);
					deferred.reject();
					$rootScope.$emit("close", e);
				};
			} catch (e) {
				console.log(e);
			}
		}
		return deferred.promise;
	};

	result.send = function (action, details) {
		if (this.status()) {
			try {
				console.log('Send');
				console.log(envelopeMessage(action, details));
				socket.send(envelopeMessage(action, details));
			} catch (e) {
				console.log(e);
			}
		}
	};

	result.close = function () {
		if (this.status()) {
			socket.close();
		}
	};

	function envelopeMessage(header, body) {
		return angular.toJson({
			action: header,
			details: body
		});
	}

	return result;
});
