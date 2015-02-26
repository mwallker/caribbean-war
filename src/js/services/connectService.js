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
			console.log(socketUrl);
		} else {
			deferred.reject();
			$rootScope.$emit('error', 'ERRORS_CONN');
			return deferred.promise;
		}

		if (!this.status()) {
			try {
				socket = new WebSocket(socketUrl);

				socket.onopen = function () {
					console.log('Connection opened: ' + socketUrl);
					deferred.resolve();
				};

				socket.onmessage = function (event) {
					var data = angular.fromJson(event.data);
					if (data && data.action) {
						console.log(data);
						$rootScope.$emit(data.action, data.details);
					}
				};

				socket.onerror = socket.onclose = function (e) {
					console.log(e);
					deferred.reject();
					$rootScope.$emit('close', e);
				};
			} catch (e) {
				console.log('Catch ' + e);
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

	function envelopeMessage(header, body) {
		return angular.toJson({
			action: header,
			details: body
		});
	}

	return result;
});
