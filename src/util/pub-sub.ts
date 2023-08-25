import { v4 as getNewId } from 'uuid';

export type PubSubEvents = Record<string, unknown>;

type EventSubscriptions<E extends PubSubEvents, K extends keyof E = keyof E> = Record<string, (payload: E[K]) => void>;

/**
 * Synchronous and generic bus of pub/sub events.
 * Follows the Observer pattern.
 */
export class EventBus<E extends PubSubEvents> {
  /** The name for the event bus */
  readonly name: string | undefined;

  /** The current subscriptions */
  private subscriptions: Partial<Record<keyof E, EventSubscriptions<E, keyof E>>> = {};

  constructor(name?: string) {
    this.name = name;
  }

  /**
   * Subscribe to a specific event name of this bus instance
   * @param eventName The name of the supported event
   * @param callback The function called every time the event is emitted
   * @returns A subscription object
   */
  subscribe<K extends keyof E>(eventName: K, callback: (payload: E[typeof eventName]) => void) {
    const id = getNewId();

    if (!this.subscriptions[eventName]) {
      this.subscriptions[eventName] = {};
    }

    (this.subscriptions[eventName] as EventSubscriptions<E, typeof eventName>)[id] = callback;

    return {
      /**
       * Unsubscribe from the event bus
       */
      unsubscribe: () => {
        delete (this.subscriptions[eventName] as EventSubscriptions<E, typeof eventName>)[id];
        if (Object.keys(this.subscriptions[eventName] as EventSubscriptions<E, typeof eventName>).length === 0) {
          delete this.subscriptions[eventName];
        }
      },
    };
  }

  /**
   * Publish event. Calls all registered callback functions sequentially.
   * @param eventName The name of the supported event
   * @param eventPayload The argument expected by the event listener (callback function)
   */
  publish<K extends keyof E>(eventName: K, eventPayload: E[typeof eventName]) {
    if (!this.subscriptions[eventName]) return;

    Object.values(this.subscriptions[eventName] as EventSubscriptions<E, typeof eventName>).forEach((fn) => fn(eventPayload));
  }

  getSubscriptionCount(): number {
    let count = 0;
    Object.values(this.subscriptions).forEach((s) => (count += !s ? 0 : Object.keys(s).length));
    return count;
  }
}
