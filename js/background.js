function buildIcon() {
	var optionData = localStorage.weiboOptionData ? JSON.parse(localStorage.weiboOptionData) : [];
	if(optionData[0].darkIcon){
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
	chrome.windows.create({
		url: 'popup.html',
		width: 800,
		height: 550,
		focused: true,
		type: 'popup'
	});
});

window.addEventListener('storage', onStorageChange, false);

function onStorageChange() {
	buildIcon();
}