caribbeanWarApp.service('audioControl', function ($q) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();
	var gainNodes = {
		music: context.createGain(),
		effects: context.createGain()
	}
	var destination = context.destination;
	var sources = [];

	gainNodes.music.connect(destination);
	gainNodes.effects.connect(destination);

	var audioApi = {};

	audioApi.loadSoundFile = function (name, type) {
		var deffered = $q.defer();
		var request = new XMLHttpRequest();
		request.open('GET', 'sound/samples/' + name + '.mp3', true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function () {
			context.decodeAudioData(request.response, function (buffer) {
				var index = sources.push(context.createBufferSource())-1;
				sources[index] = context.createBufferSource();
				sources[index].buffer = buffer;
				sources[index].connect(gainNodes[type || 'effects']);
				sources[index].start(0);
				deffered.resolve();
			});
		};
		request.send();
		return deffered.promise;
	};

	audioApi.changeVolume = function (value, target) {
		if (target && gainNodes[target]) {
			gainNodes[target].gain.value = value;
		}
	};

	return audioApi;
});
