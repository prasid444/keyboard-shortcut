/* eslint-disable no-console */
import React, { useEffect } from 'react';

import './App.css';

import { KeyboardWrapper, MainListener } from './utils/KeyboardShortcut';
import {
  calculateDeltaBaseObject,
  convertBasicToNested,
  convertNestedToBasic,
} from './utils/objDelta';

function App() {
  useEffect(() => {
    // Initialize the listener
    new MainListener().initialize();
  }, []);

  // eslint-disable-next-line no-console
  console.log(
    'convertBasicToNested',
    JSON.stringify(
      convertBasicToNested({
        'profile.name': 'Prasidha Karki',
        address: '2das',
        'items[0].id': 1,
        'items[0].product_id': 2,
        'items[2].id': 1,
        'items[2].product_id': 2,
        'profile.address.municipality': 'Ganja',
      })
    )
  );
  // eslint-disable-next-line no-console
  console.log(
    'convertNestedToBasic',
    convertNestedToBasic({
      profile: { name: 'Prasidha Karki', address: { municipality: 'Ganja' } },
      address: '2das',
      items: [
        { id: 1, product_id: 2 },
        { id: 1, product_id: 2 },
      ],
    })
  );

  const oldObject = convertNestedToBasic({
    profile: { name: 'Prasidha Karki', address: { municipality: 'Ganja' } },
    address: '2das',
    items: [{ id: 1, product_id: 2 }, null, { id: 1, product_id: 2 }],
  });
  const newObject = convertNestedToBasic({
    profile: { name: 'Prasidha Karki', address: { municipality: 'Ganja2', ward: 2 } },
    address: 'Name',
    items: [
      { id: 1, product_id: 2 },
      { id: 1, product_id: 2 },
    ],
  });
  console.log(
    'calculateDeltaBaseObject',
    convertBasicToNested(calculateDeltaBaseObject(oldObject, newObject))
  );
  return (
    <>
      <div className="button-list">
        <KeyboardWrapper
          onDown={() => {
            alert('TriggerOnDown s');
          }}
          label="s"
          combination={'Alt+s'}
        >
          <button>Click Me</button>
        </KeyboardWrapper>

        <KeyboardWrapper
          onDown={() => {
            alert('TriggerOnDown a');
          }}
          label="a"
          combination={'Alt+a'}
          customIndicator={(label: string) => {
            return (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  top: 0,
                  background: 'red',
                }}
              >
                Custom {label}
              </div>
            );
          }}
        >
          <button>Click Me</button>
        </KeyboardWrapper>
        <KeyboardWrapper
          onDown={() => {
            alert('TriggerOnDown d');
          }}
          label="d"
          combination={'Alt+d'}
        >
          <button>Click Me</button>
        </KeyboardWrapper>
      </div>
    </>
  );
}

export default App;
