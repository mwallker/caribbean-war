function d2(value) {
	return +(value / 2 - 0.0001).toFixed();
}

var Point = function (x, y) {
	var _x = x,
		_y = y;

	return {
		x: _x,
		y: _y,
		swap: function () {
			var t = _y;
			_x = _y;
			_y = _x;
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

console.log(point2d(new Point(0, 2), 32));
console.log(d2point(4, 32));
console.log(Math.sqrt(Math.pow(2, 32)));
