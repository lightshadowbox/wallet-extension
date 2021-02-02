navigator.webkitGetUserMedia(
	{ video: true },
	function (stream) {
		mediaStream = stream
	},
	function (error) {
		localStorage.setItem('isConnectCamera', JSON.stringify(false))
	},
)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => sendResponse('pong'))