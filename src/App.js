import React from 'react';
import logo from './logo.svg';
import './App.css';
import results from "./results"

function App() {
  const table = results.splice(0, 20)
  return (
    <div className="App">
      <header className="App-header">
        Results
{table.map(r => <div>{r[0]}</div>)}
      </header>

    </div>
  );
}

export default App;
