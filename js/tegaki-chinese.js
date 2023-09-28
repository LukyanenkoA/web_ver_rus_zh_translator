var pendingRequests = {};
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	var key = options.url;
	console.log(key);
	if (!pendingRequests[key]) {
		pendingRequests[key] = jqXHR;
	} else {
		//jqXHR.abort(); //
		pendingRequests[key].abort(); // 
	}

	var complete = options.complete;
	options.complete = function(jqXHR, textStatus) {
		pendingRequests[key] = null;
		if ($.isFunction(complete)) {
			complete.apply(this, arguments);
		}
	};
});


function senddata() {

	$.ajax({
		type: 'POST',

		url: '/hwr/',  
		
		data: {
			bh: lg + bihua
			//bh:"abcdefghijl"
		},
		timeout: 9000,
		success: function(a) {
			document.getElementById("kanji_info").innerHTML = TEGAKI_DeleteTheSameChar(a)
		}
	})

}

if (typeof(Worker) !== "undefined") {} else {
	document.getElementById("kanji_info").innerHTML = "Sorry, it looks like your browser doesn't support HTML 5"
}

function getX(c) {
	var a = c;
	var b = c.offsetLeft;
	while (a = a.offsetParent) {
		b += a.offsetLeft
	}
	return b
}

function getY(c) {
	var a = c;
	var b = c.offsetTop;
	while (a = a.offsetParent) {
		b += a.offsetTop
	}
	return b
}

function DisplayCoord(b) {
	var d, c, a;
	a = document.getElementById("demo");
	d = getY(a);
	c = getX(a);
	document.getElementById("mp_x").innerHTML = (b.clientX - c + document.body.scrollLeft) - 2 + "px";
	document.getElementById("mp_y").innerHTML = (b.clientY - d + document.body.scrollTop) - 2 + "px"
}
var mycanvas = document.getElementById("tegaki-canvas");


	mycanvas.addEventListener("touchstart", onTouchStart, true);
	mycanvas.addEventListener("touchmove", onTouchMove, true);
	mycanvas.addEventListener("touchend", onTouchEnd, true)

	mycanvas.addEventListener("mousedown", onMouseDown, false);
	mycanvas.addEventListener("mousemove", onMouseMove, false);
	mycanvas.addEventListener("mouseup", onMouseUp, false)



var lastX;
var lastY;
var ctx = mycanvas.getContext("2d");
var lg = "zh-cn";
var bihua = "";
var info = document.getElementById("kanji_info");
var imagedataa = new Array();
var lga = new Array();
var bihuaa = new Array();
ctx.lineWidth = 6;
ctx.strokeStyle = "#000000";
var drawing = false;

function onMouseUp(a) {
	drawing = false;
	bihua = bihua + "s";
	senddata()
}

function onMouseDown(b) {
	var e = ctx.getImageData(0, 0, mycanvas.width, mycanvas.height);
	imagedataa.push(e);
	bihuaa.push(bihua);
	lga.push(lg);
	drawing = true;
	lastX = b.clientX;
	lastY = b.clientY;
	var d, c, a;
	a = document.getElementById("tegaki-canvas");
	d = getY(a);
	c = getX(a);
	lastX = lastX - c + document.body.scrollLeft;
	lastY = lastY - d + document.body.scrollTop;
	drawRound(lastX, lastY)
}

function onMouseMove(c) {
	if (drawing) {
		try {
			var e, d, a;
			a = document.getElementById("tegaki-canvas");
			e = getY(a);
			d = getX(a);
			drawLine(lastX, lastY, c.clientX - d + document.body.scrollLeft, c.clientY - e + document.body.scrollTop);
			lastX = c.clientX;
			lastY = c.clientY;
			lastX = lastX - d + document.body.scrollLeft;
			lastY = lastY - e + document.body.scrollTop
		} catch (b) {
			alert(b.description)
		}
	}
}

function onTouchStart(b) {
	var e = ctx.getImageData(0, 0, mycanvas.width, mycanvas.height);
	imagedataa.push(e);
	bihuaa.push(bihua);
	lga.push(lg);
	b.preventDefault();
	lastX = b.touches[0].clientX;
	lastY = b.touches[0].clientY;
	var d, c, a;
	a = document.getElementById("tegaki-canvas");
	d = getY(a);
	c = getX(a);
	lastX = lastX - c + document.body.scrollLeft;
	lastY = lastY - d + document.body.scrollTop;
	drawRound(lastX, lastY)
}

function onTouchEnd(a) {
	bihua = bihua + "s";
	senddata()
}

function onTouchMove(c) {
	try {
		var e, d, a;
		a = document.getElementById("tegaki-canvas");
		e = getY(a);
		d = getX(a);
		c.preventDefault();
		drawLine(lastX, lastY, c.touches[0].clientX - d + document.body.scrollLeft, c.touches[0].clientY - e + document.body.scrollTop);
		lastX = c.touches[0].clientX;
		lastY = c.touches[0].clientY;
		lastX = lastX - d + document.body.scrollLeft;
		lastY = lastY - e + document.body.scrollTop
	} catch (b) {
		alert(b.description)
	}
}

function drawRound(a, b) {
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.arc(a, b, 3, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	bihua = bihua + Math.round(a) + "a" + Math.round(b) + "a"
}

function drawLine(b, a, d, c) {
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.moveTo(b, a);
	ctx.lineTo(d, c);
	ctx.stroke();
	bihua = bihua + Math.round(d) + "a" + Math.round(c) + "a"
}

function TEGAKI_DeleteTheSameChar(c) {
	var a = "";
	for (var b = 0; b < 24; b++) {
		if (a.indexOf(c.charAt(b)) == -1) {
			pName = c.charAt(b).replace(/(')/g, "&#39");
			a += "<input class='kanjioutput' type='button' value='"+pName+"' onclick='javascript:showmsg(this.value);'/>"

				
		}
	}
	return a
}

function TEGAKI_setlang(a) {
	lg = a;
	senddata()
}

function showmsg(a) {
	document.getElementById("normal-txt").value = document.getElementById("normal-txt").value + a;
	rewrite()
}

function rewrite() {
	bihuaa = [];
	lga = [];
	imagedataa = [];
	ctx.clearRect(0, 0, 300, 300);
	bihua = "";
	document.getElementById("kanji_info").innerHTML = ""
}

function revoke() {
	if (bihua.length > 0 && lg.length > 0) {
		bihua = bihuaa.pop();
		lg = lga.pop()
	}
	var a = imagedataa.pop();
	if (a) {
		ctx.putImageData(a, 0, 0);
		senddata()
	}
};
