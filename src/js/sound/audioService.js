caribbeanWarApp.service('audioControl', function () {
	// создаем аудио контекст
	var context = new window.AudioContext(); //
	// переменные для буфера, источника и получателя
	var buffer, source, destination; 

	// функция для подгрузки файла в буфер
	var loadSoundFile = function(url) {
		  // делаем XMLHttpRequest (AJAX) на сервер
		  var xhr = new XMLHttpRequest();
		  xhr.open('GET', url, true);
		  xhr.responseType = 'arraybuffer'; // важно
		  xhr.onload = function(e) {
			    // декодируем бинарный ответ
			    context.decodeAudioData(this.response,
			    function(decodedArrayBuffer) {
					// получаем декодированный буфер
					buffer = decodedArrayBuffer;
			    }, function(e) {
					console.log('Error decoding file', e);
			    });
		  };
		  xhr.send();
	};

	// функция начала воспроизведения
	var play = function(){
		// создаем источник
		source = context.createBufferSource();
		// подключаем буфер к источнику
		source.buffer = buffer;
		// дефолтный получатель звука
		destination = context.destination;
		// подключаем источник к получателю
		source.connect(destination);
		// воспроизводим
		source.start(0);
	};

	// функция остановки воспроизведения
	var stop = function(){
		source.stop(0);
	};

	loadSoundFile('example.mp3');
});