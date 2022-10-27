import React from "react";
import "./App.css";
import TableComponent from "./Components/TableComponent";

function App() {
  return (
    <div className="App">
      <header>
        <p>Option Chain Analysis</p>
      </header>
      <div>
        <TableComponent></TableComponent>
      </div>
    </div>
  );
}
export default App;
