import React from 'react';
import Table from './Table';
import { getBugs } from './utils/fetchBugs';
import { sortBy } from 'lodash';
import './App.css';

const priorities = ['All', 'P1', 'P2', 'P3', 'P4', 'P5', 'None'];
function priorityValue(priority) {
  if (priority == 'All') {
    return null;
  }

  if (priority == 'None') {
    return ' --';
  }

  return priority;
}

class App extends React.Component {
  state = {
    priority: 'All',
    results: false,
    resultsMap: {},
    groupByMetas: false,
    showMetas: false,
  };

  async componentDidMount() {
    this.refresh();
  }

  setPriority(priority) {
    this.setState({ priority, showMetas: false });
  }

  filterList(results) {
    const { priority, showMetas } = this.state;

    if (showMetas) {
      return this.findMetas(results);
    }

    if (priority == 'All') {
      return results;
    }

    return results.filter(bug => bug.Priority == priorityValue(priority));
  }

  findMetas(results) {
    return results.filter(bug => bug.Keywords.includes('meta'));
  }

  toggleMetas() {
    this.setState({ showMetas: !this.state.showMetas });
  }

  groupMetas() {
    this.setState({ showMetas: false, groupByMetas: !this.state.groupByMetas });
  }

  async refresh(force = false) {
    if (force) {
      this.setState({ results: false });
    }

    const results = await getBugs(force);
    const resultsMap = {};
    for (const result of results) {
      resultsMap[result.BugID] = result;
    }
    this.setState({ results, resultsMap });
  }

  metas() {
    const { results, resultsMap } = this.state;
    const metas = this.findMetas(results);

    return sortBy(metas, meta =>
      meta.Priority.match(/\d/) ? +meta.Priority.match(/\d/)[0] : 10
    ).map(meta => {
      const deps = meta.DependsOn.split(', ')
        .map(dep => resultsMap[dep])
        .filter(i => i);
      return (
        <div>
          <h2>{meta.Summary}</h2>
          <Table rows={deps} />
        </div>
      );
    });
  }

  render() {
    const { results, groupByMetas } = this.state;

    if (!results) {
      return <div>Fetching</div>;
    }

    const rows = this.filterList(results);
    return (
      <div className="App">
        <a onClick={() => this.refresh(true)}>Refresh</a>
        <div className="priorities">
          Filter By:{' '}
          {priorities.map(P => (
            <a key={P} onClick={() => this.setPriority(P)}>
              {P}
            </a>
          ))}
          <a onClick={() => this.toggleMetas()}>Metas</a>
          <div>
            Group By:
            <a onClick={() => this.groupMetas()}> Metas</a>
          </div>
        </div>
        {groupByMetas ? this.metas() : <Table rows={rows} />}
      </div>
    );
  }
}

export default App;
