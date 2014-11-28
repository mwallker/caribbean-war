caribbeanWarApp.service('audioControl', function ($q) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();
    var gainNode = context.createGain();
	var audioBuffer, source, destination;
	var audioApi = {};

	// функция для подгрузки файла в буфер
	audioApi.loadSoundFile = function(url) {
        var deffered = $q.defer();
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
				audioBuffer = buffer;
				source = context.createBufferSource();
				source.buffer = audioBuffer;
				destination = context.destination;
                source.connect(gainNode);
                gainNode.connect(context.destination);
				source.start(0);
                deffered.resolve();
			});
		};
		request.send();
        return deffered.promise;
	};

    audioApi.changeVolume = function(value){
        if(gainNode) gainNode.gain.value = value;
        console.log(value);
    };

	return audioApi;
});
