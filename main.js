var variable = {
	el   : null,
	go   : false,
	lang : null,
	text : null,
	regex: new RegExp("\\s", "g"),
};

var tts = {
	change: function(mod) {
		set.active = (mod.active === false) ? false : true;
		set.voice  = mod.voice  || set.voice;
		set.rate   = mod.rate   || set.rate;
		set.volume = mod.volume || set.volume;
	},
	speak: function(text, lang) {
		text = text || variable.text;
		lang = lang || variable.lang || "zh-CN";
		console.log("Saying: " + text + " in " + lang);
		chrome.runtime.sendMessage({type:"tts", text:text, lang:lang, set:set});
	},
}

var functions = {
	speakIfFresh: function() {
		if (functions.testNewWord()) {
			console.log("New/Failed Word");
			functions.setWords();
			functions.convertLang();
			tts.speak();
		}
	},

	testNewWord: function() {
		var textEl = document.getElementsByClassName('row-value')[0];
		variable.go = false;
		if (textEl && (!variable.el || textEl.innerText != variable.el.innerText) && functions.replace(textEl.innerText) !== "") {
			variable.go = true;
			variable.el = textEl;
		}
		return variable.go;
	},

	setWords: function() {
		variable.text = variable.el.innerText;
		variable.lang = document.getElementsByClassName('row-label')[0].innerText;
	},

	convertLang: function(lang) {
		lang = lang || variable.lang;
		variable.lang = languages[lang];
		return variable.lang;
	},

	replace: function(str) {
		return str.replace(variable.regex, "");
	},
};

// Speak entered text on correct
function typingResponse() {
	if (el = document.getElementsByClassName("typing-wrapper")[0]) {
		el.onchange = function() {
			var textEl = document.querySelector("input");
			var text   = textEl.value;
			if (textEl.classList.contains("correct")) {
				console.log("Typing Correct");
				tts.speak(text);
			}
		};
	}
}

// Speak correct answer on select, header if definition selected
function selectionResponse() {
	var el = document.querySelector(".choice.correct");
	if (el && !el.set) {
		el.set = true;
		var textEl = el.querySelector("[class='val bigger']");
		if (textEl) {
			var text = textEl.innerText;
			console.log("Selection Correct Option");
			tts.speak(text);
		}
		else if (header = document.querySelector(".qquestion")) {
			console.log("Selection Correct Header");
			tts.speak(header.innerText);
		}
	}
}

function wordBoxResponse() {
	var el = document.querySelector(".word-box-response.correct");
	if (el && !el.set) {
		el.set = true;
		var textEl = el.querySelectorAll("[data-word]");
		var text = "";
		for (var i=0; i<textEl.length; i++) {
			text += textEl[i].getAttribute("data-word") + " ";
		}
		if (text) {
			console.log("Multiple Selection");
			tts.speak(text);
		}
	}
}

var timer = {
	interval : {
		set : false,
	},
	setIntervals: function() {
		if (!timer.set) {
			timer.set = true;
			timer.interval.fresh  = setInterval(functions.speakIfFresh, 500);
			timer.interval.type   = setInterval(typingResponse, 200);
			timer.interval.select = setInterval(selectionResponse, 50);
			timer.interval.words  = setInterval(wordBoxResponse, 50);
		}
	},
	endIntervals: function() {
		if (timer.set) {
			timer.set = false;
			if (timer.interval.fresh)  clearInterval(timer.interval.fresh);
			if (timer.interval.type)   clearInterval(timer.interval.type);
			if (timer.interval.select) clearInterval(timer.interval.select);
			if (timer.interval.words)  clearInterval(timer.interval.words);
		}
	},
};

chrome.runtime.onMessage.addListener(function (req) {
	if (req.type == "activate") {
		console.log(req);
		tts.change(req);
		init();
	}
});

function init() {
	if (set.active) {
		console.log("Begin Program");
		timer.setIntervals();
	}
	else {
		timer.endIntervals();
	}
}

getValue(["active", "rate", "volume"], function (val) {
	set.active = (val.active === false) ? false : true;
	set.rate   = val.rate   || set.rate;
	set.volume = val.volume || set.volume;
	init();
});
