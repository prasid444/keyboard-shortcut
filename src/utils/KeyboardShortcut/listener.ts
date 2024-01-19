import { getActualKey } from './helper';

interface Subscriber {
  (args: KeyboardEvent): void;
}
type PressedKeyStack = string[];

interface SubPub {
  subscriberKey: number;
  subscribers: Record<number, Subscriber>;
  subscribe: (subscriber: Subscriber) => number;
  publish: (args: KeyboardEvent) => void;
  unsubscribe: (subscriberKey: number | undefined) => void;
}

interface KeyPressedStack {
  push: (pressedKey: string) => void;
  stack: PressedKeyStack;
  remove: (removeKey: string) => void;
  get: () => PressedKeyStack;
  reset: () => void;
}

type KeyboardWrapperApp = {
  keyboardDownListener?: SubPub;
  keyboardUpListener?: SubPub;
  keyPressedStack?: KeyPressedStack;
};

const keyboardDownPubSub: SubPub = Object.seal({
  subscriberKey: 0,
  subscribers: {},
  subscribe: function (this: SubPub, subscriber: Subscriber) {
    this.subscribers[this.subscriberKey] = subscriber;
    return this.subscriberKey++;
  },
  publish: function (this: SubPub, args: KeyboardEvent) {
    Object.keys(this.subscribers).forEach((sub) => {
      try {
        this.subscribers[parseInt(sub)](args);
      } catch (ignore) {
        // Failed to call subscriber
      }
    });
  },
  unsubscribe: function (this: SubPub, subscriberKey: number | undefined) {
    if (typeof subscriberKey === 'number') delete this.subscribers[subscriberKey];
  },
});

const keyboardUpPubSub: SubPub = Object.seal({
  subscriberKey: 0,
  subscribers: {},
  subscribe: function (this: SubPub, subscriber: Subscriber) {
    this.subscribers[this.subscriberKey] = subscriber;
    return this.subscriberKey++;
  },
  publish: function (this: SubPub, args: KeyboardEvent) {
    Object.keys(this.subscribers).forEach((sub) => {
      try {
        this.subscribers[parseInt(sub)](args);
      } catch (ignore) {
        // Failed to call subscriber
      }
    });
  },
  unsubscribe: function (this: SubPub, subscriberKey: number | undefined) {
    if (typeof subscriberKey === 'number') delete this.subscribers[subscriberKey];
  },
});

const keyPressedStack: KeyPressedStack = Object.seal({
  stack: [] as PressedKeyStack,
  push: function (pressedKey: string) {
    this.stack.push(pressedKey);
  },
  remove: function (removeKey: string) {
    // here filter is used instead of pop because for some keys, if holded, it will appear multiple times in the stack, so when key is lifted all items should be clear out
    this.stack = this.stack.filter((a) => a != removeKey);
  },
  get: function () {
    return this.stack;
  },
  reset: function () {
    this.stack = [];
  },
});

/**
 *
 * Represents a singleton MainListener class with keyboard event listeners for Keyboard Shortcut.
 *
 * @class MainListener
 */
class MainListener {
  private static instance: MainListener;
  private app: KeyboardWrapperApp = {
    keyboardDownListener: Object.create(keyboardDownPubSub),
    keyboardUpListener: Object.create(keyboardUpPubSub),
    keyPressedStack: Object.create(keyPressedStack),
  };

  /**
   * Private constructor to enforce singleton pattern.
   * @private
   * @memberof MainListener
   */
  private constructor() {
    // Initialize the instance, if needed
    this.initialize();
  }

  /**
   * Gets the singleton instance of MainListener.
   * @returns {MainListener} The singleton instance of MainListener.
   * @memberof MainListener
   */
  public static getInstance(): MainListener {
    if (!MainListener.instance) {
      MainListener.instance = new MainListener();
    }
    return MainListener.instance;
  }
  /**
   * Initializes the MainListener by setting up keyboard event listeners.
   * @private
   * @memberof MainListener
   */
  private initialize = () => {
    window.addEventListener('keydown', (e) => {
      const keyString = getActualKey(e.code);
      if (keyString) {
        this.app.keyPressedStack?.push(keyString);
      }
      this.app.keyboardDownListener?.publish(e);
    });

    window.addEventListener('keyup', (e) => {
      const keyString = getActualKey(e.code);
      if (keyString) {
        this.app.keyPressedStack?.remove(keyString);
      }
      this.app.keyboardUpListener?.publish(e);
    });
  };

  /**
   * Gets the 'app' instance.
   * @returns {KeyboardWrapperApp}
   * @memberof MainListener
   * @function
   * @public
   */
  getApp = (): KeyboardWrapperApp => {
    return this.app;
  };
}

export { MainListener };
