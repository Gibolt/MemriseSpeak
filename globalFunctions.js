var set = {
	active : true,
	voice  : 1,
	rate   : 1,
	volume : 1,
};

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

var languages = {
	Afrikaans: "af",
	Akan: "ak",
	Albanian: "sq",
	Amharic: "am",
	Arabic: "ar",
	Armenian: "hy",
	Azerbaijani: "az",
	Basque: "eu",
	Belarusian: "be",
	Bemba: "bem",
	Bengali: "bn",
	Bihari: "bh",
	"Bork, bork, bork!": "xx-bork",
	Bosnian: "bs",
	Breton: "br",
	Bulgarian: "bg",
	Cambodian: "km",
	Catalan: "ca",
	Cherokee: "chr",
	Chichewa: "ny",
	Chinese: "zh-CN",
//	Chinese: "zh-TW",
	"Chinese (Simplified)": "zh-CN",
	"Chinese (Traditional)": "zh-TW",
	Corsican: "co",
	Croatian: "hr",
	Czech: "cs",
	Danish: "da",
	Dutch: "nl",
	"Elmer Fudd": "xx-elmer",
	English: "en",
	Esperanto: "eo",
	Estonian: "et",
	Ewe: "ee",
	Faroese: "fo",
	Filipino: "tl",
	Finnish: "fi",
	French: "fr",
	Frisian: "fy",
	Ga: "gaa",
	Galician: "gl",
	Georgian: "ka",
	German: "de",
	Greek: "el",
	Guarani: "gn",
	Gujarati: "gu",
	Hacker: "xx-hacker",
	"Haitian Creole": "ht",
	Hausa: "ha",
	Hawaiian: "haw",
	Hebrew: "iw",
	Hindi: "hi",
	Hungarian: "hu",
	Icelandic: "is",
	Igbo: "ig",
	Indonesian: "id",
	Interlingua: "ia",
	Irish: "ga",
	Italian: "it",
	Japanese: "ja",
	Javanese: "jw",
	Kannada: "kn",
	Kazakh: "kk",
	Kinyarwanda: "rw",
	Kirundi: "rn",
	Klingon: "xx-klingon",
	Kongo: "kg",
	Korean: "ko",
	"Krio (Sierra Leone)": "kri",
	Kurdish: "ku",
	"Kurdish (Soranî)": "ckb",
	Kyrgyz: "ky",
	Laothian: "lo",
	Latin: "la",
	Latvian: "lv",
	Lingala: "ln",
	Lithuanian: "lt",
	Lozi: "loz",
	Luganda: "lg",
	Luo: "ach",
	Macedonian: "mk",
	Malagasy: "mg",
	Malay: "ms",
	Malayalam: "ml",
	Maltese: "mt",
	Maori: "mi",
	Marathi: "mr",
	"Mauritian Creole": "mfe",
	Moldavian: "mo",
	Mongolian: "mn",
	Montenegrin: "sr-ME",
	Nepali: "ne",
	"Nigerian Pidgin": "pcm",
	"Northern Sotho": "nso",
	Norwegian: "no",
	Nynorsk: "nn",
	"Norwegian (Nynorsk)": "nn",
	Occitan: "oc",
	Oriya: "or",
	Oromo: "om",
	Pashto: "ps",
	Persian: "fa",
	Pirate: "xx-pirate",
	Polish: "pl",
	Portuguese: "pt-PT",
	"Portuguese (Brazil)": "pt-BR",
	"Portuguese (Portugal)": "pt-PT",
	Punjabi: "pa",
	Quechua: "qu",
	Romanian: "ro",
	Romansh: "rm",
	Runyakitara: "nyn",
	Russian: "ru",
	"Scots Gaelic": "gd",
	Serbian: "sr",
	Serbo-Croatian: "sh",
	Sesotho: "st",
	Setswana: "tn",
	"Seychellois Creole": "crs",
	Shona: "sn",
	Sindhi: "sd",
	Sinhalese: "si",
	Slovak: "sk",
	Slovenian: "sl",
	Somali: "so",
	Spanish: "es",
	"Spanish (Latin American)": "es-419",
	Sundanese: "su",
	Swahili: "sw",
	Swedish: "sv",
	Tajik: "tg",
	Tamil: "ta",
	Tatar: "tt",
	Telugu: "te",
	Thai: "th",
	Tigrinya: "ti",
	Tonga: "to",
	Tshiluba: "lua",
	Tumbuka: "tum",
	Turkish: "tr",
	Turkmen: "tk",
	Twi: "tw",
	Uighur: "ug",
	Ukrainian: "uk",
	Urdu: "ur",
	Uzbek: "uz",
	Vietnamese: "vi",
	Welsh: "cy",
	Wolof: "wo",
	Xhosa: "xh",
	Yiddish: "yi",
	Yoruba: "yo",
	Zulu: "zu",
}