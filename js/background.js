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