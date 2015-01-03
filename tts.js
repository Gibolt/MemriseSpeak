chrome.runtime.onMessage.addListener(function (req) {
	switch(req.type) {
		case "tts":
			tts(req.text, req.lang, req.set.rate, req.set.volume);
		break;
	}
});

function tts(text, lang, rate, volume) {
	chrome.tts.speak(text, {'lang':lang, 'rate':rate, 'volume':volume});
}