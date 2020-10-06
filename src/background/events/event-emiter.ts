import { transporter } from './transporter';
import * as nanoid from 'nanoid'
import EventCore from 'eventemitter3'
import { fromEvent, Observable } from 'rxjs';

export const RPC_TIMEOUT = 15 * 1000

export type EventPayload<T = any> = {
  eventName: string
  payload: T
  responseEventName?: string
}

export class EventEmitter {
  eventBus: EventCore
  $postMessageEvent: Observable<MessageEvent>
  constructor() {
    this.eventBus = new EventCore()
    this.$postMessageEvent = fromEvent<MessageEvent>(window, 'message')

    this.$postMessageEvent.subscribe((v) => {
      console.log(v)
    })
  }

  onPostMessageHandler(message: string) {
    const eventPayload: EventPayload = JSON.parse(message)
    this.eventBus.emit(eventPayload.eventName, eventPayload)
  }

  startWatchPostMessage() {
    window.removeEventListener('message', this.onPostMessageHandler.bind(this))
    window.onmessage(this.onPostMessageHandler.bind(this))
  }

  createOnceListenResponseWithTimeout<T>(eventName: string) {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error(`RPC Timeout: ${eventName}`)), RPC_TIMEOUT)
      this.eventBus.once(eventName, (payload) => {
        clearTimeout(timeoutId)
        resolve(payload)
      })
    })
  }

  public sendToBackground<T>(payload: EventPayload<T>): void {
    console.log(`postMessage eventName: ${payload.eventName}`)
    const encodedMessage = JSON.stringify(payload)
    window.postMessage(encodedMessage, '*')
  }

  public async sendToBackgroundAndWait<TPayload, TResult = void>(event: EventPayload<TPayload>): Promise<TResult> {
    const responseEventName = `${event.eventName}__RESPONSE_${nanoid.nanoid()}`
    try {
      const [result] = await Promise.all([
        this.createOnceListenResponseWithTimeout<TResult>(responseEventName),
        transporter.send({
          eventName: event.eventName,
          payload: event.payload,
          responseEventName,
        })
        ])
      return result
    } catch (err) {
      console.error(err)
      transporter.onError({
        eventName: responseEventName,
        payload: err
      })
    }
  }


  public handleForEvent(eventName: string, handler: any) {
    this.eventBus.removeAllListeners(eventName)
    const onEvent = async (event: EventPayload) => {
      try {
        const result = await handler()
        transporter.reply({eventName: event.responseEventName, payload: result})
      } catch (err) {
        console.error(err)
        transporter.onError({eventName: event.responseEventName, payload: err})
      }
    }
    this.eventBus.on(eventName, onEvent)
  }
}

export const eventEmitter = new EventEmitter()
