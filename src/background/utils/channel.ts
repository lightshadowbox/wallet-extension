import { EventEmitter } from 'background/events'

export type EventCreator<TPayload = any, TResult = any> = (payload: TPayload) => Promise<TResult>

export type ListEventCreators<T extends EventCreator = EventCreator> = {
  [key: string]: T
}

export type ChannelConfig<T extends ListEventCreators = ListEventCreators> = {
  name: string
  events: T
}

export type CreateChannelOutput<T extends ListEventCreators = ListEventCreators> = {
  listen: (eventEmiter: EventEmitter) => void
  rpc: T
}

export const createRPCFromEvent = <T extends ListEventCreators = ListEventCreators>(events: T): T => {
  const eventNames = Object.keys(events)
  const wrapped = eventNames.reduce((out: T, currentEventName) => {
    const action: EventCreator = async (payload) => {
      console.log('dispatch', payload)
      const result = await events[currentEventName].apply(events, payload)
      return result
    }
    return {
      ...out,
      [currentEventName]: action,
    }
  }, events)
  return wrapped
}

export const createRPCChannel = <T extends ListEventCreators = ListEventCreators>(
  channelConfig: ChannelConfig<T>,
): CreateChannelOutput<T> => {
  return {
    listen: (eventEmitter) => {
      const eventNames = Object.keys(channelConfig.events)
      eventNames.forEach((eventName) => {
        console.log(`Start listen for event: ${eventName}`)
        eventEmitter.handleForEvent(eventName, channelConfig.events[eventName].bind(channelConfig))
      })
    },
    rpc: createRPCFromEvent(channelConfig.events),
  }
}
