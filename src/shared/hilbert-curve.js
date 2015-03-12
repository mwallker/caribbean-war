//convert (x,y) to d
/*
int xy2d (int n, int x, int y) {
    int rx, ry, s, d=0;
    for (s=n/2; s>0; s/=2) {
        rx = (x & s) > 0;
        ry = (y & s) > 0;
        d += s * s * ((3 * rx) ^ ry);
        rot(s, &x, &y, rx, ry);
    }
    return d;
}
//convert d to (x,y)
void d2xy(int n, int d, int * x, int * y) {
	int rx, ry, s, t = d; * x = * y = 0;
	for (s = 1; s < n; s *= 2) {
		rx = 1 & (t / 2);
		ry = 1 & (t ^ rx);
		rot(s, x, y, rx, ry); * x += s * rx; * y += s * ry;
		t /= 4;
	}
}

//rotate/flip a quadrant appropriately
void rot(int n, int * x, int * y, int rx, int ry) {
	if (ry == 0) {
		if (rx == 1) { * x = n - 1 - * x; * y = n - 1 - * y;
		}

		//Swap x and y
		int t = * x; * x = * y; * y = t;
	}
}
*/

function d2(value) {
	return +(value / 2 - 0.0001).toFixed();
}

function xy2d(n, x, y) {
	var rx, ry, d = 0;
	for (var s = d2(s); s > 0; s = d2(s)) {
		rx = (x & s) > 0 ? 1 : 0;
		ry = (y & s) > 0 ? 1 : 0;
		d += s * s * ((3 * rx) ^ ry);
		var k = rot(s, x, y, rx, ry);
		x = k.x;
		y = k.y;
	}
	return d;
};


function rot(n, x, y, rx, ry) {
	if (ry == 0) {
		if (rx == 1) {
			x = n - 1 - x;
			y = n - 1 - y;
		}
		return {
			x: y,
			y: x
		}
	}
	return {
		x: x,
		y: y
	}
}
