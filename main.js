var variable = {
	el   : null,
	go   : false,
	lang : null,
	text : null,
};

var course = {
	uri  : document.baseURI,
	id   : document.baseURI.split("/")[4],
	code : document.baseURI.split("/")[5],
	title: null,
	lang : null,
	voice: null,
}

var tts = {
	change: function(mod) {
		set.active = (mod.active === false) ? false : true;
		set.voice  = mod.voice  || set.voice;
		set.rate   = mod.rate   || set.rate;
		set.volume = mod.volume || set.volume;
		course.lang = mod.lang;
	},
	speak: function(text, lang) {
		if (!hasAudio() && !isMuted()) {
			var detLang = determineLanguage();
			text = text || variable.text;
			lang = lang || detLang || variable.lang || "zh-CN";
			lang = functions.convertLang(lang) || lang;
			if (lang == "Word" || lang == "Definition") {
				lang = "";
			}
			console.log("Saying: " + text + " in " + lang);
			chrome.runtime.sendMessage({type:"tts", text:text, lang:lang, set:set});
		}
	},
}

var functions = {
	// Speak on show new or missed word
	speakIfFresh: function() {
		if (functions.testNewWord()) {
			console.log("New/Failed Word");
			functions.setWords();
			functions.appendAudioBox();
			functions.convertLang();
			tts.speak();
		}
	},

	testNewWord: function() {
		if (word = getWord()) {
			variable.go = false;
			if (word && (!variable.el || word != variable.el) && functions.replace(word) !== "") {
				variable.go = true;
				variable.el = word;
				console.log("Word/Language Selection");
			}
		}
		else {
			var textEl = document.getElementsByClassName('row-value')[0];
			variable.go = false;
			if (textEl && (!variable.el || textEl.firstChild.nodeValue.trim() != variable.el) && functions.replace(textEl.innerText) !== "") {
				variable.go = true;
				variable.el = textEl.firstChild.nodeValue.trim();
				console.log(variable.el);
				console.log("Label Selection");
			}
		}
		return variable.go;
	},

	setWords: function() {
//		var text = variable.el.firstChild.nodeValue;
		variable.text = functions.replace(variable.el);
		variable.lang = document.getElementsByClassName('row-label')[0].innerText;
	},

	convertLang: function(lang) {
		lang = lang || variable.lang;
		variable.lang = languages[lang];
		return variable.lang;
	},

	replace: function(str) {
		return str.trim();
	},

	speakWord: function() {
		tts.speak();
	},

	appendAudioBox: function() {
		if (audio = document.getElementsByClassName("first-audio")[0]) {
			if (row = audio.getElementsByClassName("row-value")[0]) {
				if (row.children.length == 0) {
					console.log()
					var box = document.createElement('a');
					box.className = "audio-player-hover audio-player";
					box.onmouseenter = functions.speakWord;
					box.added = true;
					row.appendChild(box);
				}
			}
		}
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
		var query = document.querySelectorAll("[class='column-label']");
		var textEl = el.querySelector("[class='val bigger']");
		if (query && (query[0].innerText == course.lang || query[0].innerText == "Word")) {
			console.log("Selection Language Based Response");
			tts.speak(el.querySelector(".val").innerText, course.lang);
		}
		else if (query && (query[1].innerText == course.lang || query[1].innerText == "Word")) {
			if (header = document.querySelector(".qquestion")) {
				console.log("Selection Language Based Header");
				tts.speak(functions.replace(header.firstChild.nodeValue), course.lang);
			}
		}
		// Likely to be phased out completely
		else if (textEl) {
			var text = textEl.innerText;
			console.log("Selection Correct Option");
			tts.speak(text);
		}
		else if (header = document.querySelector(".qquestion")) {
			console.log("Selection Correct Header");
			tts.speak(header.firstChild.nodeValue);
		}
	}
}

// Speak correct answer on select multi-part
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

function determineLanguage() {
	var lang;
	if (col = document.querySelector("[class='column-label']")) {
		lang = col.innerText;
	}
	else if (row = document.querySelector("[class='row-label']")) {
		lang = row.innerText;
	}
	else {
		console.log("Lang not found");
		lang = "";
	}
	if (lang !== course.lang) {
		console.log(lang);
	}
	setDefaultLanguage(lang);
	return course.lang || lang;
}

function setDefaultLanguage(lang) {
	if (!course.lang && languages[lang]) {
		console.log("Default language set to: " + lang);
		course.lang = lang;
		saveCourse();
	}
}

function findWord() {
	var els = document.getElementsByClassName("row-label");
	var slot = null;
	for (var i=0; i < els.length; i++) {
		var context = els[i].innerText.trim().toLowerCase();
		if (slot === null && context == "word") {
			slot = i;
		}
		else if (context != "" && context === course.lang) {
			slot = i;
		}
	}
	return slot;
}

function getWord() {
	var slot = findWord();
	var word;
	if (slot !== null && els) {
		var els = document.getElementsByClassName("row-value");
		word = els[slot].innerText.trim();
	}
	return word || null;
}

function hasAudio() {
	var audio = document.querySelector(".audio-player");
	if (!audio) {
		return false;
	}
	else {
		return !audio.added;
	}
}

function isMuted() {
	return document.getElementsByClassName("audio-muted").length;
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
			timer.interval.title  = setInterval(courseDetails, 500);
		}
	},
	endIntervals: function() {
		if (timer.set) {
			timer.set = false;
			if (timer.interval.fresh)  clearInterval(timer.interval.fresh);
			if (timer.interval.type)   clearInterval(timer.interval.type);
			if (timer.interval.select) clearInterval(timer.interval.select);
			if (timer.interval.words)  clearInterval(timer.interval.words);
			if (timer.interval.title)  clearInterval(timer.interval.title);
		}
	},
};

function courseDetails() {
	if (course.title) {
		clearInterval(timer.interval.title);
	}
	else if (titleEl = document.getElementById("course-title")) {
		course.title = titleEl.innerText;
	}
}

chrome.runtime.onMessage.addListener(function (req, sender, res) {
	if (req.type == "details") {
		console.log(req);
		res(course);
	}
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

function loadCourseSettings(set) {
	if (course.id == "water") {
		for (var key in languages) {
			if (languages[key].toLowerCase() === course.code.toLowerCase()) {
				course.lang = languages[key];
				console.log(course.lang);
			}
		}
	}
	else if (set) {
		course.lang = set.lang;
	}
}

getValue(["active", "rate", "volume", course.code], function (val) {
	loadCourseSettings(val[course.code]);
	set.active = (val.active === false) ? false : true;
	set.rate   = val.rate   || set.rate;
	set.volume = val.volume || set.volume;
	init();
});
