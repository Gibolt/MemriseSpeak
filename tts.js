chrome.runtime.onMessage.addListener(function (req) {
	switch(req.type) {
		case "tts":
			tts(req.text, req.lang);
		break;
	}
});

function tts(text, lang) {
	chrome.tts.speak(text, {'lang':lang});
}