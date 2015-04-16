var bodyTemplate = $('body');
var kithenTemplate = '<div id="kithen"></div>';
var kithenVisiable = false;
var array = [];


bodyTemplate.append(kithenTemplate);

var base = $('#kithen');
base.get(0).hidden = !kithenVisiable;

base.on('click', 'input[type="checkbox"]', function (e) {
	console.log(array[+e.target.name]);
});

KeyboardJS.on('k',
	function (event) {
		displayKithen();
		console.info('Kithen ' + (kithenVisiable ? '' : 'in') + 'visiable');
	});

function displayKithen() {
	base.get(0).hidden = kithenVisiable;

	if (kithenVisiable) {
		array = $("div[id*='ui']");
		for (var i in array) {
			if (array.get(i).id) {
				base.append('<div data-element-id=' + i + '>' +
					'Id: ' + array.get(i).id +
					'Hidden: <input type="checkbox" name="' + i + '" checked="' + array.get(i).hidden + '">' +
					'</div>');
				console.log(array.get(i).id);
			}
		}
	}
	kithenVisiable = !kithenVisiable;
}
