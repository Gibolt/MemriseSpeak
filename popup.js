// Copyright 2014 Thomas Reese
var el = {};
var course = {};

function init() {
	el.title    = document.getElementById('title');
	el.active   = document.getElementById('active');
	el.langOut  = document.getElementById('langOuter');
	el.lang     = document.getElementById('lang');
	el.voiceOut = document.getElementById('voiceOuter');
	el.voice    = document.getElementById('voice');
	el.rate     = document.getElementById('rate');
	el.volume   = document.getElementById('volume');
	el.save     = document.getElementById('save');
	el.reset    = document.getElementById('reset');

	getCourseDetails();
	el.save.addEventListener('click', clickSave, false);
	el.reset.addEventListener('click', clickReset, false);
}

function clickSave() {
	validateRate();
	validateVolume();
	validateLang();
	var obj = setObj();
	saveCourse();
	setValues(obj);
	activateSettings();
}

function clickReset() {
	if (confirm('Reset settings to default?')) {
		setBoxes(set);
		setValues(set);
		activateSettings();
    }
}

function activateSettings() {
	var obj = setObj();
	obj.type = "activate";
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, obj);
		}
	});
}

function getCourseDetails() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type:"details"}, function(res) {
			if (res) {
				course = res;
				console.log(course);
				courseOptions();
			}
		});
	});
}

function courseOptions() {
	setTitle(course.title);
	addLanguageOptions(el.lang);
	el.langOut.hidden = false;
//	addVoiceOptions();
	selectCurrentLang(el.lang);
}

function setTitle(title) {
	if (title) {
		el.title.innerText = title;
	}
}

function createOptions(text, value) {
	var opt = document.createElement('option');
	opt.innerText = text;
	opt.value = value;
	return opt;
}

function addLanguageOptions(el) {
	el = el || el.lang;
	for (var key in languages) {
		el.appendChild(createOptions(key,key));
	}
}

function addVoiceOptions() {
	if (course.lang) {
		chrome.tts.getVoices(function (voices) {
			for (var i = 0; i < voices.length; i++) {
				if (voices[i].lang && voices[i].lang.indexOf(languages[course.lang]) === 0) {
					console.log(voices[i].lang.indexOf(languages[course.lang]));
					console.log(voices[i].lang);
					var title = voices[i].voiceName.indexOf(voices[i].gender) > 0 ? voices[i].voiceName : voices[i].voiceName + " (" + voices[i].gender + ")";
					el.voice.appendChild(createOptions(title,i));
				}
			}
			if (el.voice.length > 1) {
				el.voiceOut.hidden = false;
			}
		});
	}
}

function selectCurrentLang(el) {
	if (languages[course.lang]) {
		el = el || el.lang;
		var select = "[value=" + course.lang + "]";
		if (opt = el.querySelector(select)) {
			opt.selected = true;
		}
	}
}

function setObj() {
	var obj = {
		active : el.active.checked,
		lang   : course.lang,
		rate   : parseFloat(el.rate.value),
		volume : parseFloat(el.volume.value),
	};
	return obj;
}

function setBoxes(val) {
	val = val || set;
	el.active.checked = val.active;
	el.voice.value    = parseFloat(val.voice);
	el.rate.value     = parseFloat(val.rate);
	el.volume.value   = parseFloat(val.volume);
}

function validateRate() {
	validateNumberElement(el.rate, .1, 3, set.rate);
}

function validateVolume() {
	validateNumberElement(el.volume, .1, 1, set.volume);
}

function validateLang() {
	if (languages[el.lang.value] || el.lang.value === "") {
		course.lang = el.lang.value;
	}
}

function validateNumberElement(el, min, max, def) {
	min = min || 1;
	max = max || 1;
	def = def || 1;
	var val = parseFloat(el.value);
	if (val < min) {
		el.value = min;
	}
	else if (val > max) {
		el.value = max;
	}
	else if (!(val >= min && val <= max)) {
		el.value = def;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	init();
	getValue(["rate", "volume", "active"], function (val) {
		console.log(val);
		setBoxes(val);
	});
});
