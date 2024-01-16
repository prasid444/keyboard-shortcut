interface Subscriber {
  (args: KeyboardEvent): void;
}

interface SubPub {
  subscriberKey: number;
  subscribers: Record<number, Subscriber>;
  subscribe: (subscriber: Subscriber) => number;
  publish: (args: KeyboardEvent) => void;
  unsubscribe: (subscriberKey: number | undefined) => void;
}

const keyboardDownPubSub: SubPub = Object.seal({
  subscriberKey: 0,
  subscribers: {},
  subscribe: function (this: SubPub, subscriber: Subscriber) {
    this.subscribers[this.subscriberKey] = subscriber;
    return this.subscriberKey++;
  },
  publish: function (this: SubPub, args: KeyboardEvent) {
    for (const sub in this.subscribers) {
      try {
        this.subscribers[parseInt(sub)](args);
      } catch (ignore) {
        console.log("running subs error", ignore);
      }
    }
  },
  unsubscribe: function (this: SubPub, subscriberKey: number | undefined) {
    if (typeof subscriberKey === "number")
      delete this.subscribers[subscriberKey];
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
    for (const sub in this.subscribers) {
      try {
        this.subscribers[parseInt(sub)](args);
        // console.log("runned")
      } catch (ignore) {
        console.log("running subs error", ignore);
      }
    }
  },
  unsubscribe: function (this: SubPub, subscriberKey: number | undefined) {
    if (typeof subscriberKey === "number")
      delete this.subscribers[subscriberKey];
  },
});
let app: {
  keyboardDownListener?: SubPub;
  keyboardUpListener?: SubPub;
} = {};
app.keyboardDownListener = Object.create(keyboardDownPubSub);
app.keyboardUpListener = Object.create(keyboardUpPubSub);

function getApp() {
  return app;
}

class MainListener {
  constructor() {}

  initialize = () => {
    app = getApp();
    window.addEventListener("keydown", (e) => {
      app.keyboardDownListener?.publish(e);
    });
    window.addEventListener("keyup", (e) => {
      app.keyboardUpListener?.publish(e);
    });
  };
}

export { MainListener, getApp };
