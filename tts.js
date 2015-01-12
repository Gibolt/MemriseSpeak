chrome.runtime.onMessage.addListener(function (req) {
	switch(req.type) {
		case "tts":
			tts(req.text, req.lang, req.set.rate, req.set.volume);
		break;
	}
});

function tts(text, lang, rate, volume) {
	var specifics = {'rate':rate, 'volume':volume};
	if (lang) {
		specifics.lang = lang;
	}
	chrome.tts.speak(text, specifics);
}