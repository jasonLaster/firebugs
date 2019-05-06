import React from 'react';
import logo from './logo.svg';
import './App.css';
import results from "./results"
import Table from './Table';


let id = 0;
function createData(BugID,
Alias,
Product,
Component,
Assignee,
Status,
Resolution,
Summary,
Changed,
Priority,
backlog,
Blocks,
DependsOn,
Whiteboard,
Keyword,) {
  id += 1;
  return { BugID,
  Alias,
  Product,
  Component,
  Assignee,
  Status,
  Resolution,
  Summary,
  Changed,
  Priority,
  backlog,
  Blocks,
  DependsOn,
  Whiteboard,
  Keyword };
}

function App() {
  const table = results.splice(1, 20)
  const rows = table.map(row => createData(...row))
  return (
    <div className="App">
      <Table rows={rows} />
    </div>
  );
}

export default App;
