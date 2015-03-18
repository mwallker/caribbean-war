function d2(value) {
	return (+value == 1) ? 0 : value / 2;
}

var Point = function (x, y) {
	var _x = x,
		_y = y;

	return {
		x: _x,
		y: _y,
		swap: function () {
			var t = _y;
			_y = _x;
			_x = t;
		}
	};
};

function point2d(p, n) {
	var rx, ry, t, d = 0;
	for (var s = n; s > 0; s = d2(s)) {
		rx = +((p.x & s) > 0);
		ry = +((p.y & s) > 0);
		d += s * s * ((3 * rx) ^ ry);
		p = rot(n, p, rx, ry);
	}
	return d;
}


function rot(n, p, rx, ry) {
	if (ry === 0) {
		if (rx == 1) {
			p.x = n - 1 - p.x;
			p.y = n - 1 - p.y;
		}
		p.swap();
	}
	return p;
}


function d2point(d, n) {
	var rx, ry, s, t = d,
		p = new Point(0, 0);
	for (s = 1; s < n; s *= 2) {
		rx = 1 & (t / 2);
		ry = 1 & (t ^ rx);
		rot(s, p, rx, ry);
		p.x += s * rx;
		p.y += s * ry;
		t /= 4;
	}
	return p;
}

var dim = Math.pow(2, 16);
var points = [];
var deltas = [];
var out_points = [];
var count = 100000;

function test() {
	var b = 4,
		v_min_x = [],
		v_min_y = [],
		v_max_x = [],
		v_max_y = [];

	function insert(point) {
		if (v_min_x.length && point.x < v_min_x[v_min_x.length - 1].x) {
			var t = 0;
			for (var p in v_min_x) {
				if (point.x < v_min_x[p].x) {

				}
			}

		} else {
			v_min_x.push(point);
		}
	}
}

console.log('Adding ' + count + ' points:');
for (var i = 0; i < count; i++) {
	points[i] = new Point(Math.random() * (dim - 1), Math.random() * (dim - 1));
}

console.log('Calculating there Hilbert value:');

console.time('h1');
for (var i = 0; i < count; i++) {
	deltas[i] = point2d(points[i], dim);
}
console.timeEnd('h1');

console.log('Calculating points from Hilbert value:');

console.time('h2');
for (var i = 0; i < count; i++) {
	out_points[i] = d2point(deltas[i], dim);
}
console.timeEnd('h2');

console.log('Dimension: ' + dim + 'x' + dim);
