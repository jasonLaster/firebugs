import React from 'react';
import Table from './Table';
import { getBugs } from '../utils/fetchBugs';
import { sortBy } from 'lodash';
import Meta from './Meta';

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
    firstBugs: false,
    results: false,
    resultsMap: {},
    groupByMetas: true,
    showMetas: false,
  };

  async componentDidMount() {
    this.refresh();
  }

  setPriority(priority) {
    this.setState({
      priority,
      groupMetas: false,
      showMetas: false,
      firstBugs: false,
    });
  }

  filterList(results) {
    const { priority, showMetas, firstBugs } = this.state;

    if (showMetas) {
      return this.findMetas(results);
    }

    if (firstBugs) {
      return results.filter(b => b.Keywords.includes('first'));
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
    this.setState({
      groupMetas: false,
      firstBugs: false,
      showMetas: !this.state.showMetas,
    });
  }

  toggleFirstBugs() {
    this.setState({
      groupMetas: false,
      showMetas: false,
      firstBugs: !this.state.firstBugs,
    });
  }

  groupMetas() {
    this.setState({
      firstBugs: false,
      showMetas: false,
      groupByMetas: !this.state.groupByMetas,
    });
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
      return <Meta meta={meta} resultsMap={resultsMap} />;
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
        <div className="App-Header">
          <div className="nav">
            <a onClick={() => this.refresh(true)}>Refresh</a>
            <div className="priorities">
              Filter By:{' '}
              {priorities.map(P => (
                <a key={P} onClick={() => this.setPriority(P)}>
                  {P}
                </a>
              ))}
              <a onClick={() => this.toggleMetas()}>Metas</a>
              <a onClick={() => this.toggleFirstBugs()}>Good First Bugs</a>
              <div>
                Group By:
                <a onClick={() => this.groupMetas()}> Metas</a>
              </div>
            </div>
          </div>
        </div>
        <div className="App-Body">
          {groupByMetas ? this.metas() : <Table rows={rows} />}
        </div>
      </div>
    );
  }
}

export default App;
