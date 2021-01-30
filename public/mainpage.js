navigator.webkitGetUserMedia(
  { video: true },
  function (stream) {
    console.log('Done')
    mediaStream = stream
  },
  function (error) {
    console.log('not done')
    console.error(`Error trying to get the stream:: ${error.message}`)
  },
)
