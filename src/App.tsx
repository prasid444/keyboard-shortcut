
import { useEffect } from 'react'
import './App.css'
import { KeyboardWrapper, MainListener } from './utils/KeyboardShortcut'

function App() {

  useEffect(()=>{
    //Initialize the listener
    console.log("call initialize")
    new MainListener().initialize()
  },[])
 
  return (
    <>
      <div>
        <KeyboardWrapper 
        onDown={()=>{
          console.log("TriggerOnDown s")
        }}
        label="s"
        combination={'Alt+s'}
        >
          <button>Click Me</button>
        </KeyboardWrapper>

        <KeyboardWrapper 
        onDown={()=>{
          console.log("TriggerOnDown a")
        }}
        label="a"
        combination={'Alt+a'}
        >
          <button>Click Me</button>
        </KeyboardWrapper>
        <KeyboardWrapper 
        onDown={()=>{
          console.log("TriggerOnDown d")
        }}
        label="d"
        combination={'Alt+d'}
        >
          <button>Click Me</button>
        </KeyboardWrapper>
      </div>
    </>
  )
}

export default App
