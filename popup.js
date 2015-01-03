// Copyright 2014 Thomas Reese
var def = {
	active : true,
	voice  : 1,
	rate   : 1,
	volume : 1,
};

var el = {};

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

function init() {
	el.active = document.getElementById('active');
	el.voice  = document.getElementById('voice');
	el.rate   = document.getElementById('rate');
	el.volume = document.getElementById('volume');
	el.save   = document.getElementById('save');
	el.reset  = document.getElementById('reset');

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
		setBoxes(def);
		setValues(def);
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

function setObj() {
	var obj = {
		active : el.active.checked,
		rate   : parseFloat(el.rate.value),
		volume : parseFloat(el.volume.value),
	};
	return obj;
}

function setBoxes(val) {
	val = val || def;
	el.active.checked = val.active;
	el.voice.value    = parseFloat(val.voice);
	el.rate.value     = parseFloat(val.rate);
	el.volume.value   = parseFloat(val.volume);
}

function validateRate() {
	validateNumberElement(el.rate, .1, 3, def.rate);
}

function validateVolume() {
	validateNumberElement(el.volume, .1, 1, def.volume);
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
