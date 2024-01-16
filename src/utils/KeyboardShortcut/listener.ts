import { getActualKey } from "./helper";

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
  reset:()=>void
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

const keyPressedStack:KeyPressedStack=Object.seal({
  stack:[] as PressedKeyStack,
  push:function(pressedKey:string){
    this.stack.push(pressedKey);
  },
  remove:function(removeKey:string){
    //here filter is used instead of pop because for some keys, if holded, it will appear multiple times in the stack, so when key is lifted all items should be clear out
    this.stack=this.stack.filter(a=>a!=removeKey);
  },
  get:function(){
    return this.stack;
  },
  reset:function(){
    this.stack=[];
  }

})
let app: {
  keyboardDownListener?: SubPub;
  keyboardUpListener?: SubPub;
  keyPressedStack?:KeyPressedStack;
} = {};
app.keyboardDownListener = Object.create(keyboardDownPubSub);
app.keyboardUpListener = Object.create(keyboardUpPubSub);
app.keyPressedStack=Object.create(keyPressedStack);

function getApp() {
  return app;
}

class MainListener {
  constructor() {}

  initialize = () => {
    app = getApp();
    window.addEventListener("keydown", (e) => {
      const keyString = getActualKey(e.code);
      if(keyString){
        app.keyPressedStack?.push(keyString);
      }
      app.keyboardDownListener?.publish(e);
    });
    window.addEventListener("keyup", (e) => {
      const keyString = getActualKey(e.code);
      if(keyString){
        app.keyPressedStack?.remove(keyString);
      }
      app.keyboardUpListener?.publish(e);
    });
  };
}

export { MainListener, getApp };
