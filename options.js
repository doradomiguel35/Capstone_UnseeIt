var settings = {
	"censorCharacter": "****",
	"filterMethod": 0,
	"filterToggle": true,
	"matchMethod": 0
};

var eventCensorChar,eventMatchMethod,eventFilterMethod,htmlSite,htmlCount,htmldomain,htmlWord,htmlSubstitute;

function retrieveSettings(){
	chrome.storage.sync.get(settings, function(settings){
		var filterSelectCmb = document.getElementById('filterMethodSelect');
		var filterMethodStorage = settings.filterMethod;
		switch(filterMethodStorage){
			case "0":
				filterSelectCmb.value = filterMethodStorage;
			case "1":
				filterSelectCmb.value = filterMethodStorage;
			case "2":
				filterSelectCmb.value = filterMethodStorage;
		}
		var matchMethodCmb = document.getElementById('matchMethodSelect');
		var matchMethodStorage = settings.matchMethod;
		switch(matchMethodStorage){
			case "0":
				matchMethodCmb.value = matchMethodStorage;
			case "1":
				matchMethodCmb.value = matchMethodStorage;
		}
		var censorCharacterSelectCmb = document.getElementById('censorCharacterSelect');
		var censorCharacterSelectStorage = settings.censorCharacter;
		switch(censorCharacterSelectStorage){
			case "****":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "&&&&":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "$$$$":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "####":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "@@@@":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "^^^^":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "----":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "____":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
			case "mixed":
				censorCharacterSelectCmb.value = censorCharacterSelectStorage;
		}
	});
	
	
}

function sortSites(){
	chrome.storage.sync.get(['websites'],function(result){
		chrome.storage.sync.get(['substituteWords'],function(sub){
			chrome.storage.sync.get(['defaultWords'],function(words){
				var sort_by = function(field, reverse, primer){
				var key = primer ? 
			       function(x) {return primer(x[field])} : 
			       function(x) {return x[field]};
					reverse = !reverse ? 1 : -1;
					return function (a, b) {
				       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
				     } 
				}

				// Sort website rank
				var unsorted = result.websites;
				for(var i = 0; i < result.websites.length; i++){
					if(result.websites[i].count === "0"){
						delete result.websites[i];
						unsorted = result.websites;
						unsorted = unsorted.filter(function(x){
	  					return (x !== (undefined || null || ''));
	  					});
	  					console.log("Site deleted");
					}
				}
				var websites = unsorted.sort(sort_by('count', true, parseInt));
				
				chrome.storage.sync.set({websites},function(){
					console.log("Sites sorted");
				});	

				//Sort word rank
				var unsorted_words = words.defaultWords;
				var defaultWords = unsorted_words.sort(sort_by('count',true, parseInt));

				chrome.storage.sync.set({defaultWords},function(){
					console.log("Words sorted");
				});

				//Word List A-Z
				var substituteWords = sub.substituteWords;
				substituteWords = substituteWords.sort(function(a, b){
					if(a.word > b.word) return 1;
					if(a.word < b.word) return -1;
					return 0;
				});

				chrome.storage.sync.set({substituteWords},function(){
					console.log("Words sorted");
				});
			});
		});
	});
	populateWebsiteTable();
	populateWordRankTable();
	populateWordTable();
	populateWarningDomains();
}

function populateWordRankTable(){
	chrome.storage.sync.get(['defaultWords'],function(result){
		var table = document.getElementById('wordCounts');

		for(var i = 0 ; i < result.defaultWords.length ; i++){
			var defaultWords = result.defaultWords[i];
			var row = document.createElement('tr');
			var properties = ['word','count'];

			for(var k = 0; k < properties.length ; k++){
				var cell = document.createElement('td');
				cell.innerHTML = defaultWords[properties[k]];
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
	});
}

function populateWordTable(){
	chrome.storage.sync.get(['substituteWords'],function(sub){
		var table = document.getElementById('wordAndSubstitute');

		for(var i = 0; i < sub.substituteWords.length ; i++){
			var substitute = sub.substituteWords[i];
			var row = document.createElement('tr');
			var properties = ['word','substitute'];

			for(var k = 0; k < properties.length ; k++){
				var cell = document.createElement('td');
				cell.innerHTML = substitute[properties[k]];
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
	});
	
}

function populateWebsiteTable(){
	chrome.storage.sync.get(['websites'],function(result){
		var table = document.getElementById('siteAndCount');
		
		for(var i = 0; i < result.websites.length ; i++){
			var websites = result.websites[i];
			var row = document.createElement('tr');
			var properties = ['site','count'];

			for(var k = 0; k < properties.length; k++){
				var cell = document.createElement('td');
				cell.innerHTML = websites[properties[k]];
				row.appendChild(cell);
			}
			table.appendChild(row);
		}	
	}); 
}

function populateWarningDomains(){
	var select = document.getElementById('domainSelect');
	var option = document.createElement('option');
	var options = [];
	chrome.storage.sync.get(['warningDomains'],function(domain){
		for(var i = 0 ; i < domain.warningDomains.length ; i++){
			console.log(domain.warningDomains[i]);
			option.text = option.value = domain.warningDomains[i];
			options.push(option.outerHTML);
		}
		select.insertAdjacentHTML('beforeEnd', options.join('\n'));
	});

}

function filterMethodSelect(event){
   eventFilterMethod = event.target.value;
}

function filterMethod(){
  chrome.storage.sync.get(['filterMethod'], function(word){
      console.log(word.filterMethod);
  });
}

function censorCharacterSelect(event){
	eventCensorChar = event.target.value;
}

function matchMethodSelect(event){
	eventMatchMethod = event.target.value
}

function saveSettings(){
	
	var saveSettings = {
		"censorCharacter": eventCensorChar,
		"filterMethod": eventFilterMethod,
		"matchMethod": eventMatchMethod,
	}

	chrome.storage.sync.set(saveSettings,function(){
		var htmlSave = "Settings saved";
		document.getElementById('saveNotif').innerHTML = htmlSave;
	});
	
}

function addDomain(event){
	var domain = document.getElementById('domainText').value;
	var regexpDomain = new RegExp(domain,'gi'); 
	var warningDomains;
	var stringifyDomains;
	var htmlNotif;
	chrome.storage.sync.get(['warningDomains'],function(domains){
		warningDomains = domains.warningDomains;
		stringifyDomains = JSON.stringify(warningDomains);
		if(regexpDomain.test(stringifyDomains) === true){
			htmlNotif ='Site already a warning domain';
			console.log(htmlNotif);   
			document.getElementById('addNotif').innerHTML = htmlNotif;
		}

		else{
			warningDomains.push(domain);
			chrome.storage.sync.set({warningDomains},function(result){
				htmlNotif ='Warning domain added';
				document.getElementById('addNotif').innerHTML = htmlNotif;
				chrome.tabs.reload();
			});
		}
	});
}
     
function removeDomain(event){
	var selectDomain = document.getElementById('domainSelect').value;
	var warningDomains;
	var htmlNotif;
	chrome.storage.sync.get(['warningDomains'],function(domain){
		for(var i = 0;i < domain.warningDomains.length;i++){
			if(selectDomain === domain.warningDomains[i]){
				delete domain.warningDomains[i];
				warningDomains = domain.warningDomains;
				warningDomains = warningDomains.filter(function(x){
  					return (x !== (undefined || null || ''));
  				});
				console.log(JSON.stringify(warningDomains));
				chrome.storage.sync.set({warningDomains},function(){
					htmlNotif = "Warning domain removed";
					document.getElementById('notifRemove').innerHTML = htmlNotif;
					chrome.tabs.reload();
				}); 
			}

			else{
				htmlNotif = "Warning domain non existent";
				document.getElementById('notifRemove').innerHTML = htmlNotif;
			}
		}
	});
}

function addWord(event){
	var word = document.getElementById('addWords').value;
	var substitute = document.getElementById('substitute').value;
	var regExpWord = new RegExp("\\b"+word+"\\b",'i');
	var stringifyWord;
	var defaultWords;
	var substituteWords;
	var htmlNotif;
	chrome.storage.sync.get(['defaultWords'],function(result){
		chrome.storage.sync.get(['substituteWords'],function(sub){
			defaultWords = result.defaultWords;
			substituteWords = sub.substituteWords;

			stringifyWord = JSON.stringify(defaultWords);
			// console.log(stringifyWord);

			if(regExpWord.test(stringifyWord) === true){
				htmlNotif = "Word already added";
				console.log("Word already added");
				document.getElementById('addNotif').innerHTML = htmlNotif;
			}

			else{
				defaultWords.push({"count": 0, "word": word});
				substituteWords.push({"substitute": "["+substitute+"]","word": word});
				console.log(substituteWords);
				chrome.storage.sync.set({defaultWords},function(){
					chrome.storage.sync.set({substituteWords},function(){
						htmlNotif = "Word added";
						document.getElementById('addNotif').innerHTML = htmlNotif;
					});
				});
				chrome.tabs.reload();

			}
		});
		
	});
}

function removeWord(event){
	var selectWord = document.getElementById('removeWord').value;
	var defaultWords;
	var substituteWords;
	var htmlNotif;
	chrome.storage.sync.get(['defaultWords'],function(result){
		chrome.storage.sync.get(['substituteWords'],function(sub){
			for(var i = 0; i < result.defaultWords.length; i++){
				if(selectWord === result.defaultWords[i].word){
					delete result.defaultWords[i];
					defaultWords = result.defaultWords;
					defaultWords = defaultWords.filter(function(x){
  					return (x !== (undefined || null || ''));
  					});
  					
  					for(var j = 0; j < sub.substituteWords.length; j++){
  						if(selectWord === sub.substituteWords[j].word){
  							delete sub.substituteWords[j];
  							substituteWords = sub.substituteWords;
  							substituteWords = substituteWords.filter(function(x){
							return (x !== (undefined || null || ''));
							});

							chrome.storage.sync.set({defaultWords},function(){
								chrome.storage.sync.set({substituteWords},function(){
									htmlNotif = "Word removed";
									document.getElementById('removeNotif').innerHTML = htmlNotif;
									chrome.tabs.reload();
								});
							});
  						}
  					}
				}

				else{
					htmlNotif = "Word does not exist";
					document.getElementById('removeNotif').innerHTML = htmlNotif;
				}
  			}	
  		});
	});
}

function openTab(event) {
  if ( event.currentTarget.className.indexOf('active') >= 0) {
    return false;
  }

  var oldTab = document.getElementsByClassName("tablinks active")[0];
  deactivate(oldTab);
  activate(event.currentTarget);

  oldTabContent = document.getElementsByClassName("tabcontent visible")[0];
  hide(oldTabContent);
  newTabName = event.currentTarget.innerText;
  show(document.getElementById(newTabName));
}

function show(element) {
  element.classList.remove('hidden');
  element.classList.add('visible');
}

function hide(element){
	element.classList.remove('visible');
	element.classList.add('hidden');
}

function activate(element){
	element.classList.add('active');
}

function deactivate(element){
	element.classList.remove('active');
}

var tabs = document.getElementsByClassName('tablinks');
for (var i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener('click', function(e) { openTab(e); });
}
sortSites();
retrieveSettings();
//Listeners   
document.getElementById('btnRemove').addEventListener('click',removeWord);
document.getElementById('btnAdd').addEventListener('click',addWord);
document.getElementById('domainRemove').addEventListener('click',removeDomain);
document.getElementById('domainAdd').addEventListener('click',addDomain);
document.getElementById('btnSave').addEventListener('click',saveSettings);
document.getElementById('matchMethodSelect').addEventListener('change',matchMethodSelect);
document.getElementById('censorCharacterSelect').addEventListener('change',censorCharacterSelect);
document.getElementById('filterMethodSelect').addEventListener('change', filterMethodSelect);