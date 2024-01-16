import { useEffect, useState } from "react";
import { getApp } from "./listener";
import { areArraysSame, getActualKey } from "./helper";
import "./wrapper.scss";

const KEY_TO_LISTEN = "Alt";
const HOLD_DURATION = 2000; //in ms

const _customChildNode = (l: string) => {
  return (
    <>
      <div className="keyboard-shortcut-indicator " style={{}}></div>
      <div className="hint-label">{l}</div>
    </>
  );
};

type KeyboardWrapperProps = {
  children: React.ReactNode;
  onDown: () => void;
  label: string;
  combination: string;
  customIndicator?: (l: string) => React.ReactNode;
};

const KeyboardWrapper = ({
  children,
  label,
  combination,
  onDown,
  customIndicator = _customChildNode,
}: KeyboardWrapperProps) => {
  const [holded, setHolded] = useState(false);

  let lastKeyUpAt = new Date();

  let keyUpListenerKey: number | undefined,
    keyDownListenerKey: number | undefined;

  let keyPressedStack: string[] = [];
  const keyCombinationStack: string[] = combination
    .toLocaleUpperCase()
    .split("+");

  const onKeyDown = () => {
    //reset hold status and lastKeyUpAt to begin listening, and empty the stack
    setHolded(false);
    lastKeyUpAt = new Date();
    keyPressedStack = [];
    //call onDown function
    onDown();
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const keyString = getActualKey(e.code);
    if (keyString) {
      //clear our stack for that keyString value
      //here filter is used instead of pop because for some keys, if holded, it will appear multiple times in the stack, so when key is lifted all items should be clear out
      keyPressedStack = keyPressedStack.filter((a) => a != keyString);
    }
    lastKeyUpAt = new Date();
    setHolded(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const keyDownAt = new Date();
    const keyString = getActualKey(e.code);
    if (keyString) {
      //captured alphabets or digit here
      keyPressedStack.push(keyString);
      if (areArraysSame(keyPressedStack, keyCombinationStack)) {
        onKeyDown();
      }
    }
    setTimeout(function () {
      // Compare key down time with key up time
      if (+keyDownAt > +lastKeyUpAt && e.key == KEY_TO_LISTEN) {
        // Key has been held down for x seconds
        setHolded(true);
      } else {
        // Key has not been held down for x seconds
        setHolded(false);
      }
    }, HOLD_DURATION);
  };

  useEffect(() => {
    //Things to do when this component is mounted
    //get the listener Object and subscibe for keyup and key down listener, assign the subscription ids to keyUpListenerKey and keyDownListenerKey
    const app = getApp();
    // keyPressedStack=[];
    keyDownListenerKey = app.keyboardDownListener?.subscribe(handleKeyDown);
    keyUpListenerKey = app.keyboardUpListener?.subscribe(handleKeyUp);
    return () => {
      //Things to do when this component is removed (Cleanup function)
      //ubsubscribe keyup and key down listener for keys:keyDownListenerKey and keyUpListenerKey
      app.keyboardDownListener?.unsubscribe(keyDownListenerKey);
      app.keyboardUpListener?.unsubscribe(keyUpListenerKey);
    };
  }, []);

  console.log("keyPressedStack", keyPressedStack);
  return (
    <div className="keyboard-shortcut-wrapper">
      {children}
      {holded && customIndicator(label)}
    </div>
  );
};

export default KeyboardWrapper;
