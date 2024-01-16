import { useEffect } from "react";
import "./App.css";
import { KeyboardWrapper, MainListener } from "./utils/KeyboardShortcut";

function App() {
  useEffect(() => {
    //Initialize the listener
    console.log("call initialize");
    new MainListener().initialize();
  }, []);

  return (
    <>
      <div className="button-list">
        <KeyboardWrapper
          onDown={() => {
            alert("TriggerOnDown s");
          }}
          label="s"
          combination={"Alt+s"}
        >
          <button>Click Me</button>
        </KeyboardWrapper>

        <KeyboardWrapper
          onDown={() => {
            alert("TriggerOnDown a");
          }}
          label="a"
          combination={"Alt+a"}
          customIndicator={(label: string) => {
            return (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  top: 0,
                  background: "red",
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
            alert("TriggerOnDown d");
          }}
          label="d"
          combination={"Alt+d"}
        >
          <button>Click Me</button>
        </KeyboardWrapper>
      </div>
    </>
  );
}

export default App;
