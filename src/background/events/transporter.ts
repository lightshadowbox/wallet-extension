export type SendPayload<T = any> = {
  eventName: string
  payload: T
  responseEventName?: string
  isError?: boolean
  isReply?: boolean
}

export const send = (payload: SendPayload) => {
  console.log(`sending ... ${payload.eventName}`)
  window.postMessage(JSON.stringify({...payload, isReply: false, isError: false}), '*')
}

export const reply = (payload: SendPayload) => {
  console.log(`sending ... ${payload.eventName}`)
  window.postMessage(JSON.stringify({...payload, isReply: true, isError: false}), '*')
}

export const onError = (payload: SendPayload) => {
  console.log(`sending ... ${payload.eventName}`)
  window.postMessage(JSON.stringify({...payload, isReply: true, isError: true}), '*')
}


export const transporter = {
  send,
  reply,
  onError
}
