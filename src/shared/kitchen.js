function loadConsole() {
	var array = $("div[id*='ui']")[0];
	for(var o in array){
		console.log(o);
		console.log(array[o]);
	}
	array.hidden = true;
};
