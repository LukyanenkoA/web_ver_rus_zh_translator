window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
	let pendingRequests = {};
	$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
		let key = options.url;
		console.log(key);
		if (!pendingRequests[key]) {
			pendingRequests[key] = jqXHR;
		} else {
			//jqXHR.abort(); //
			pendingRequests[key].abort(); // 
		}

		let complete = options.complete;
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
		let a = c;
		let b = c.offsetLeft;
		while (a = a.offsetParent) {
			b += a.offsetLeft
		}
		return b
	}

	function getY(c) {
		let a = c;
		let b = c.offsetTop;
		while (a = a.offsetParent) {
			b += a.offsetTop
		}
		return b
	}

	function DisplayCoord(b) {
		let d, c, a;
		a = document.getElementById("demo");
		d = getY(a);
		c = getX(a);
		document.getElementById("mp_x").innerHTML = (b.clientX - c + document.body.scrollLeft) - 2 + "px";
		document.getElementById("mp_y").innerHTML = (b.clientY - d + document.body.scrollTop) - 2 + "px"
	}
	let canvas = document.getElementById("drawkanji-canvas");


	canvas.addEventListener("touchstart", onTouchStart, true);
	canvas.addEventListener("touchmove", onTouchMove, true);
	canvas.addEventListener("touchend", onTouchEnd, true)

	canvas.addEventListener("mousedown", onMouseDown, false);
	canvas.addEventListener("mousemove", onMouseMove, false);
	canvas.addEventListener("mouseup", onMouseUp, false)



	let lastX;
	let lastY;
	let context = canvas.getContext("2d");
	let lg = "zh-cn";
	let bihua = "";
	let info = document.getElementById("kanji_info");
	let imagedataa = new Array();
	let lga = new Array();
	let bihuaa = new Array();
	context.lineWidth = 6;
	context.strokeStyle = "#000000";
	let drawing = false;

	function onMouseUp(a) {
		drawing = false;
		bihua = bihua + "s";
		senddata()
	}

	function onMouseDown(b) {
		let e = context.getImageData(0, 0, canvas.width, canvas.height);
		imagedataa.push(e);
		bihuaa.push(bihua);
		lga.push(lg);
		drawing = true;
		lastX = b.clientX;
		lastY = b.clientY;
		let d, c, a;
		a = document.getElementById("drawkanji-canvas");
		d = getY(a);
		c = getX(a);
		lastX = lastX - c + document.body.scrollLeft;
		lastY = lastY - d + document.body.scrollTop;
		drawRound(lastX, lastY)
	}

	function onMouseMove(c) {
		if (drawing) {
			try {
				let e, d, a;
				a = document.getElementById("drawkanji-canvas");
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
		let e = context.getImageData(0, 0, canvas.width, canvas.height);
		imagedataa.push(e);
		bihuaa.push(bihua);
		lga.push(lg);
		b.preventDefault();
		lastX = b.touches[0].clientX;
		lastY = b.touches[0].clientY;
		let d, c, a;
		a = document.getElementById("drawkanji-canvas");
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
			let e, d, a;
			a = document.getElementById("drawkanji-canvas");
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
		context.fillStyle = "#000000";
		context.beginPath();
		context.arc(a, b, 3, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		bihua = bihua + Math.round(a) + "a" + Math.round(b) + "a"
	}

	function drawLine(b, a, d, c) {
		context.beginPath();
		context.lineCap = "round";
		context.moveTo(b, a);
		context.lineTo(d, c);
		context.stroke();
		bihua = bihua + Math.round(d) + "a" + Math.round(c) + "a"
	}

	function TEGAKI_DeleteTheSameChar(c) {
		let a = "";
		for (let b = 0; b < 24; b++) {
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
		document.getElementById("kanji_info").value = document.getElementById("normal-txt").value + a;
		rewrite()
	}

	function rewrite() {
		bihuaa = [];
		lga = [];
		imagedataa = [];
		context.clearRect(0, 0, 300, 300);
		bihua = "";
		document.getElementById("kanji_info").innerHTML = ""
	}

	function revoke() {
		if (bihua.length > 0 && lg.length > 0) {
			bihua = bihuaa.pop();
			lg = lga.pop()
		}
		let a = imagedataa.pop();
		if (a) {
			context.putImageData(a, 0, 0);
			senddata()
		}
	};
});