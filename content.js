console.log("UnseeIt V1.0 Ready");

var defaultWords = ['ass','asses','asshole','assshit','ass-hat',
					'assbag','assbite','asscock','assfuck','asshead',
					'asslick','asslicker','assmonkey','assmunch','asssucker',
					'bastard','bitch','blowjob',
					'cunt','creampie','cum',
					'damn','dick','douchebag','deepthroat',
					'fuck','fvck',
					'handjob',
					'motherfucker',
					'orgy',
					'piss','pissed','pissing',
					'slut','shit','son of a bitch',
					'tits',
					'whore'];

var innerBody = document.getElementsByTagName("*");
var profanityCount = 0;

var word = defaultWords[0];


for (var k = 0; k < defaultWords.length; k++) {
	var words = defaultWords[k];
	for (var i = 0; i < innerBody.length; i++) {
		var element = innerBody[i];
		
		for (var j = 0; j < element.childNodes.length; j++) {
			var node = element.childNodes[j];
				
			if (node.nodeType === 3) {
				var text = node.nodeValue;
				// console.log(text.search(defaultWords[k]))
				// if(defaultWords[k] === text.search(defaultWords[k])){
				var replacedText = text.toLowerCase().replace(defaultWords[k], '****');
				// if (replacedText != text) {

				element.replaceChild(document.createTextNode(replacedText), node);
				profanityCount++;
			// }
				
			
			}
		}
	}	
}
console.log(profanityCount);
