import React, { useEffect, useState } from 'react';

import './wrapper.scss';

import { areArraysSame, getActualKey } from './helper';
import { getApp } from './listener';

const KEY_TO_LISTEN = 'Alt';
const HOLD_DURATION = 300; // in ms

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
  const app = getApp();

  let lastKeyUpAt = new Date();

  let keyUpListenerKey: number | undefined;
  let keyDownListenerKey: number | undefined;

  //   let keyPressedStack: string[] = [];
  const keyCombinationStack: string[] = combination.toLocaleUpperCase().split('+');

  const onKeyDown = () => {
    // reset hold status and lastKeyUpAt to begin listening, and empty the stack
    setHolded(false);
    lastKeyUpAt = new Date();
    app.keyPressedStack?.reset();
    // keyPressedStack = [];
    // call onDown function
    onDown();
  };

  const handleKeyUp = () => {
    lastKeyUpAt = new Date();
    setHolded(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const keyDownAt = new Date();
    const keyString = getActualKey(e.code);
    if (keyString) {
      // captured alphabets or digit here
      if (areArraysSame(app.keyPressedStack?.get() ?? [], keyCombinationStack)) {
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
    // Things to do when this component is mounted
    // get the listener Object and subscibe for keyup and key down listener, assign the subscription ids to keyUpListenerKey and keyDownListenerKey

    // keyPressedStack=[];
    keyDownListenerKey = app.keyboardDownListener?.subscribe(handleKeyDown);
    keyUpListenerKey = app.keyboardUpListener?.subscribe(handleKeyUp);
    return () => {
      // Things to do when this component is removed (Cleanup function)
      // ubsubscribe keyup and key down listener for keys:keyDownListenerKey and keyUpListenerKey
      app.keyboardDownListener?.unsubscribe(keyDownListenerKey);
      app.keyboardUpListener?.unsubscribe(keyUpListenerKey);
    };
  }, []);

  return (
    <div className="keyboard-shortcut-wrapper">
      {children}
      {holded && customIndicator(label)}
    </div>
  );
};

export default KeyboardWrapper;
