// Copyright 2014 Thomas Reese
var el = {};
var course = {};

function init() {
	el.title  = document.getElementById('title');
	el.active = document.getElementById('active');
	el.langOut= document.getElementById('langOuter');
	el.lang   = document.getElementById('lang');
	el.voice  = document.getElementById('voice');
	el.rate   = document.getElementById('rate');
	el.volume = document.getElementById('volume');
	el.save   = document.getElementById('save');
	el.reset  = document.getElementById('reset');

	getCourseDetails();
	el.save.addEventListener('click', clickSave, false);
	el.reset.addEventListener('click', clickReset, false);
}

function clickSave() {
	validateRate();
	validateVolume();
	var obj = setObj();
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

function selectCurrentLang(el) {
	if (languages[course.lang]) {
		el = el || el.lang;
		var select = "[value='" + course.lang + "']";
		if (opt = el.querySelector(select)) {
			opt.checked = true;
		}
	}
}

function setObj() {
	var obj = {
		active : el.active.checked,
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
