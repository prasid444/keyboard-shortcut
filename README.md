# Keyboard Shortcut

This example explains how I had built keyboard shortcut feature without using any external library.

![](./example/assets/playback.gif)

## Running Locally

1. First clone the repo
2. Run yarn command to download node_modules with `yarn`
3. Run `yarn dev` to run in dev mode

## Setup

### 1. You need to initialize `MainListener` in your root file.

Make sure this is only executed ones. I will update later for singleton effect.

#### Code Example

```javascript
import { MainListener } from './utils/KeyboardShortcut'
function App() {
...
  useEffect(()=>{
    //Initialize the listener
    new MainListener().initialize()
  },[])
  ...
  return <>
  ...your project here
  </>
}
```

### 2. Import `KeyboardWrapper` and use it in the component where you want your shortcut to execute with required props

#### Code Example

```javascript
import { KeyboardWrapper } from './utils/KeyboardShortcut'
...

return <div>
  ...
  <KeyboardWrapper
        onDown={()=>{
          console.log("TriggerOnDown a")
        }}
        label="a"
        combination={'Alt+a'}
    >
  ...
  </div>
```

# Note

Make sure you are not running this in strict mode, else the listener might be initialized twice.

Change From

```javascript
<React.StrictMode>
    <App />
</React.StrictMode>,
```

To

```javascript
<App />
```
