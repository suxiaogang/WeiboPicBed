function buildIcon() {
	var optionData = localStorage.weiboOptionData ? JSON.parse(localStorage.weiboOptionData) : [];
	if(optionData[0] != undefined && optionData[0].darkIcon){
		chrome.browserAction.setIcon({
			'path': {
				'19': 'icon_19_gray.png',
				'38': 'icon_38_gray.png'
			}
		});
	} else {
		chrome.browserAction.setIcon({
			'path': {
				'19': 'icon_19.png',
				'38': 'icon_38.png'
			}
		});
	}
}

buildIcon();

chrome.browserAction.onClicked.addListener(function(tab) {
	//chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {});
	//chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(tab) {});

	var w = 800;
    	var h = 550;
    	var left = (screen.width/2)-(w/2);
    	var top = (screen.height/2)-(h/2);

	chrome.windows.create({
		url: 'popup.html',
		width: w,
		height: h,
		focused: true,
		'left': left,
		'top': top,
		type: 'popup'
	});
});

window.addEventListener('storage', onStorageChange, false);

function onStorageChange() {
	buildIcon();
}

var eventFilter = {url: [{urlPrefix: "https://www.zybuluo.com/mdeditor"}]};
///added by Yumeng Li
///@ 2016-04-16
chrome.webNavigation.onCommitted.addListener(function(tab){
  //console.log(tab);
  chrome.tabs.executeScript(null,{file:"js/jquery.min.js"});
  chrome.tabs.executeScript(null,{file:"js/zybuluo.js"});
}, eventFilter);

/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	console.log(tab);
  
});
*/