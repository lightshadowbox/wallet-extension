navigator.webkitGetUserMedia(
	{ video: true },
	function (stream) {
		mediaStream = stream
	},
	function (error) {
		localStorage.setItem('isConnectCamera', JSON.stringify(false))
	},
)