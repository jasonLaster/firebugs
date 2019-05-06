import React from 'react';
import './App.css';
import Table from './Table';


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
  return {
    BugID,
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

const priorities = ["All", "P1", "P2", "P3", "P4", "P5", "None"]
function priorityValue(priority) {
  if (priority == "All") {
    return null;
  }

  if (priority == "None") {
    return " --"
  }

  return priority;
}

async function fetchData() {
  const results =  await (await fetch(".netlify/functions/bugs")).json()
  results.shift();
  return results.map(row => createData(...row))
}

class App extends React.Component {
  state = {results: [], priority: "All"}
  async componentDidMount() {
    const results = await fetchData();
    window.r = results;
    this.setState({results})
  }

  setPriority(priority) {
    this.setState({priority})
  }

  filterList() {
    const {priority, results} = this.state;
    if (priority == "All") {
      return results;
    }

    return results.filter(bug => bug.Priority == priorityValue(priority))
  }

  render() {
    const rows = this.filterList();
    return (
      <div className="App">
      <div className="priorities">
        {
          priorities.map(P =><a key={P} onClick={() => this.setPriority(P)}>{P}</a>)
        }
        </div>

        <Table rows={rows} />
      </div>
    );
  }
}

export default App;
