var active = true;
var variable = {
	el   : null,
	go   : false,
	lang : null,
	text : null,
	regex: new RegExp("\\s", "g"),
};

function getValue(key, fn) {
	chrome.storage.sync.get(key, function(value) {
		fn(value);
	});
}

function setValue(key, value) {
	var obj = {}; obj[key] = value;
	setValues(obj);
}

function setValues(obj) {
	chrome.storage.sync.set(obj);
}

var tts = {
	set : {
		voice  : 1,
		rate   : 1,
		volume : 1,
	},
	change: function(set) {
		active = set.on || active;
		this.set.voice  = set.voice  || this.set.voice;
		this.set.rate   = set.rate   || this.set.rate;
		this.set.volume = set.volume || this.set.volume;
	},
	speak: function(text, lang) {
		text = text || variable.text;
		lang = lang || variable.lang || "zh-CN";
		console.log("Saying: " + text + " in " + lang);
		console.log(this.set);
		chrome.runtime.sendMessage({type:"tts", text:text, lang:lang, set:this.set});
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
		var conversion = {
			English: "en",
			Chinese: "zh-CN",
		}
		variable.lang = conversion[lang];
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
	setIntervals: function() {
		setInterval(functions.speakIfFresh, 500);
		setInterval(typingResponse, 200);
		setInterval(selectionResponse, 50);
		setInterval(wordBoxResponse, 50);
	},
};

chrome.runtime.onMessage.addListener(function (req) {
	if (req.type == "activate") {
		console.log(req);
		tts.change(req);
	}
});

function init() {
	if (active) {
		console.log("Begin Program");
		timer.setIntervals();
	}
}

getValue(["active", "rate", "volume"], function (val) {
	active = (val.active === false) ? false : true;
	tts.set.rate   = val.rate   || tts.set.rate;
	tts.set.volume = val.volume || tts.set.volume;
	console.log(active);
	init();
});
