import React from "react";
import Canvas from "./Canvas";

function App() {

return  <div className ="Top-container">
                <h1>Hindi HandWritten Digit Recognition using CNN + LSTM</h1>
                <div>
                    <h2 className="rounded-3">Draw digit here</h2>
                </div>
                <Canvas />
            </div>;
}

export default App;