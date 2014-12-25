var variable = {
	el   : null,
	go   : false,
	lang : null,
	text : null,
	regex: new RegExp("\\s", "g"),
};

var functions = {
	speakIfFresh: function() {
		functions.testNewWord();
		if (variable.go) {
			console.log("New/Failed Word");
			functions.setWords();
			functions.convertLang();
			functions.speak();
		}
	},

	testNewWord: function() {
		var textEl = document.getElementsByClassName('row-value')[0];
		variable.go = false;
		if (textEl && (!variable.el || textEl.innerText != variable.el.innerText) && functions.replace(textEl.innerText) !== "") {
			variable.go = true;
			variable.el = textEl;
		}
	},

	setWords: function() {
		variable.text = variable.el.innerText;
		variable.lang = document.getElementsByClassName('row-label')[0].innerText;
	},

	convertLang: function() {
		var conversion = {
			English: "en",
			Chinese: "zh-CN",
		}
		variable.lang = conversion[variable.lang];
	},

	speak: function(text, lang) {
		text = text || variable.text;
		lang = lang || variable.lang || "zh-CN";
		console.log("Saying: " + text + " in " + lang);
		chrome.runtime.sendMessage({type:"tts", text:text, lang:lang});
	},
	
	replace: function(str) {
		return str.replace(variable.regex, "");
	},
};

// Speak entered text on correct
function a() {
	if (el = document.getElementsByClassName("typing-wrapper")[0]) {
		el.onchange = function() {
			var textEl = document.querySelector("input");
			var text   = textEl.value;
			if (textEl.classList.contains("correct")) {
				console.log("Typing Correct");
				functions.speak(text);
			}
		};
	}
}

function d() {
	var el = document.querySelector(".choice.correct");
	if (el && !el.set) {
		el.set = true;
		var textEl = el.querySelector("[class='val bigger']");
		if (textEl) {
			var text = textEl.innerText;
			console.log("Selection Correct Option");
			functions.speak(text);
		}
		else if (el = document.querySelector(".qquestion")) {
			console.log("Selection Correct Header");
			functions.speak(el.innerText);
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
			functions.speak(text);
		}
	}
}

var timer = {
	setInterval: function() {
		setInterval(functions.speakIfFresh, 500);
		setInterval(a, 200);
		setInterval(d, 50);
		setInterval(wordBoxResponse, 50);
	},
};

console.log("Begin Program");
timer.setInterval();
