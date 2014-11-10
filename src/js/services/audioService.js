caribbeanWarApp.service('audioControl', function () {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();
	var audioBuffer, source, destination;

	var audioApi = {}; 

	// функция для подгрузки файла в буфер
	audioApi.loadSoundFile = function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
				console.log(typeof buffer);
				audioBuffer = buffer;
			});
		};
		request.send();
	};

	// функция начала воспроизведения
	audioApi.play = function(){
		// создаем источник
		source = context.createBufferSource();
		// подключаем буфер к источнику
		source.buffer = audioBuffer;
		// дефолтный получатель звука
		destination = context.destination;
		// подключаем источник к получателю
		source.connect(destination);
		// воспроизводим
		source.start(0);
	};

	// функция остановки воспроизведения
	audioApi.stop = function(){
		source.stop(0);
	};

	return audioApi;
});