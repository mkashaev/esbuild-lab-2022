import React from "react";
// @ts-ignore
import Logo from "./circle-logo.webp";
import "./app.css";

const App = () => {
  const [counter, setCounter] = React.useState(0);

  return (
    <div>
      <img src={Logo} alt="logo" height="100px" />
      <h1>Hello</h1>
      <span>Counter:</span>
      <br />
      <span>{counter}</span>
      <br />
      <button onClick={() => setCounter(counter + 1)}>inc</button>
    </div>
  );
};

export default App;
