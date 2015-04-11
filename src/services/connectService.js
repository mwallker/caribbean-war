caribbeanWarApp.service('connection', function ($q, $rootScope) {
	var result = {};

	var socket = null;
	var socketUrl = '';

	var deferred = null;

	result.status = function () {
		return socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING);
	};

	result.open = function () {
		deferred = $q.defer();
		if (localStorage.server) {
			socketUrl = localStorage.server;
		} else {
			deferred.reject();
			$rootScope.$emit('error', 'ERRORS_CONN');
			return deferred.promise;
		}

		if (!this.status()) {
			try {
				socket = new WebSocket(socketUrl);

				socket.onopen = function () {
					console.info('Connection opened: ' + socketUrl);
					deferred.resolve();
				};

				socket.onmessage = function (event) {
					var data = angular.fromJson(event.data);
					if (data && data.action) {
						if (data.action != 'position') console.log(data);
						$rootScope.$emit(data.action, data.details);
					}
				};

				socket.onerror = socket.onclose = function (e) {
					deferred.reject();
					$rootScope.$emit('close', e);
					if (!e.wasClean) $rootScope.$emit('error', 'ERRORS_CONN_CLOSE');
				};
			} catch (e) {
				$rootScope.$emit('error', 'ERRORS_CONN');
			}
		}
		return deferred.promise;
	};

	result.send = function (action, details) {
		if (this.status()) {
			console.log(envelopeMessage(action, details));
			socket.send(envelopeMessage(action, details));
		}
	};

	result.close = function () {
		if (this.status()) {
			socket.close();
		}
	};

	result.testConnection = function () {
		try {
			if (localStorage.server) {
				var conn = new WebSocket(localStorage.server);
				conn.onopen = function () {
					$rootScope.$emit('status', 1);
					conn.close();
				};
				conn.onerror = function () {
					$rootScope.$emit('status', 0);
				};
			}
		} catch (e) {
			$rootScope.$emit('status', 0);
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
