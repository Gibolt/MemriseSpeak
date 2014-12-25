
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
//			textEl.onclick = function() {functions.speak();console.log("Why not?");};
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

// Attempt to "check" textbox for key press
/*var textEntry = {
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
			console.log("Enter");
			console.log("Speak: " + textEntry.box.value);
			functions.speak(textEntry.box.value);
		}
	}
}*/

// Attempt to "check" options for key press
/*var options = {
	setCheck : function() {
		document.onkeypress = options.act;
	},

	act: function(e) {
		console.log("Options Check");
		console.log(e.keyCode);
		var key = options.key(e.keyCode-48);
		if (el = document.querySelector(key)) {
			if (el = el.querySelector("[class='val bigger']")) {
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
}*/

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

// Attempt to "watch" options for correct
/*function b() {
	var els = document.querySelectorAll(".choice");
	if (els && !els[0].set) {
		for (var i=0; i<els.length; i++) {
			els[0].set = true;
			els[i].watch("class", function() {
				console.log(this);
				var textEl = this.querySelector("[class='val bigger']");
				var text   = textEl.value;
				console.log(text);
				console.log(textEl.classList);
				if (textEl.classList.contains("correct")) {
					functions.speak(text);
				}
			});
		}
	}
}*/

/*function c() {
	var els = document.querySelectorAll(".correct");
	if (els.length && !els[0].set) {
		console.log(els);
		els[0].set = true;
		console.log(els[0]);
		var textEl = els[0].querySelector("[class='val bigger']");
		var text   = textEl.value;
		console.log(text);
		console.log(textEl.classList);
		functions.speak(text);
	}
}*/

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
//		setInterval(textEntry.setEnter, 500);
		setInterval(a, 200);
		setInterval(d, 50);
		setInterval(wordBoxResponse, 50);
	},
};

console.log("Begin Program");
timer.setInterval();
//options.setCheck();

//var e=document.querySelectorAll("input, button, textarea, form");
//for (var i=0; i<e.length; i++) {
//	e.onkeypress = function (e){console.log(e.keyCode)};
//}