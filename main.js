
function convertLang(language) {
	var conversion = {
		English: "en",
		Chinese: "zh-CN",
	}
	return conversion[language];
}

var variable = {
	el   : null,
	go   : false,
	lang : null,
	text : null,
	regex: new RegExp("\\s", "g"),
};

// document.getElementsByClassName('row-value')[0]
var functions = {
	speakIfFresh: function() {
//		console.log(variable);
		functions.testNewWord();
		if (variable.go) {
			console.log("Now one!");
			console.log(variable);
			functions.setWords();
			functions.convertLang();
			functions.speak();
		}
	},

	testNewWord: function() {
		var textEl = document.getElementsByClassName('row-value')[0];
		variable.go = false;
		if (textEl && (!variable.el || textEl.innerText != variable.el.innerText) && functions.replace(textEl.innerText) !== "") {
			console.log(textEl);
			variable.go = true;
			variable.el = textEl;
			textEl.onclick = function() {functions.speak();console.log("Why not?");};
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

var textEntry = {
	box : null,
	setEnter : function() {
		var box = document.getElementsByClassName('shiny-box');
		if (box) {
			this.box = box;
			box.onkeypress = textEntry.onEnter;
		}
	},

	onEnter : function (e) {
		var e = e || window.event;
		var c = e.which || e.keyCode;
		if (c == 13) {
			console.log("Speak: " + textEntry.box.value);
			functions.speak(textEntry.box.value);
		}
	}
}

var options = {
	setCheck : function() {
		console.log("Hello");
		document.onkeypress = options.act;
	},

	act: function(e) {
		console.log(e.keyCode);
		var key = options.key(e.keyCode-48);
		if (el = document.querySelector(key)) {
			if (el = el.querySelector("[class='val bigger'")) {
				functions.speak(el.innerText);
			}
			else if (el = el.querySelector(".qquestion")) {
				functions.speak(el.innerText);
			}
		}
	},

	key: function(n) {
		n = n-1;
		return "[data-choice-id='" + n + "']";
	}
}

function a() {
	if (el = document.getElementsByClassName("typing-wrapper")[0]) {
		el.onchange = function() {
			console.log(el);
			var textEl = document.querySelector("input");
			var text   = textEl.value;
			console.log(text);
			console.log(textEl.classList);
			if (textEl.classList.contains("correct")) {
				functions.speak(text);
			}
		};
	}
}

var timer = {
	setInterval: function() {
		setInterval(functions.speakIfFresh, 500);
		setInterval(textEntry.setEnter, 500);
		setInterval(a, 100);
	},
};

console.log("Hello");
timer.setInterval();
options.setCheck();

//var e=document.querySelectorAll("input, button, textarea, form");
//for (var i=0; i<e.length; i++) {
//	e.onkeypress = function (e){console.log(e.keyCode)};
//}