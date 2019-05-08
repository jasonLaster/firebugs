import React from 'react';
import Table from './Table';
import { getBugs } from '../utils/fetchBugs';
import { sortByPriority } from '../utils';

import { debounce } from 'lodash';

import Fuse from 'fuse.js';

import Meta from './Meta';

import './App.css';

window.F = Fuse;

const priorities = ['All', 'P1', 'P2', 'P3', 'P4', 'P5', 'None'];
function priorityValue(priority) {
  if (priority === 'All') {
    return null;
  }

  if (priority === 'None') {
    return ' --';
  }

  return priority;
}

function isMeta(bug) {
  return bug.Keywords.includes('meta');
}

class App extends React.Component {
  state = {
    priority: 'All',
    firstBugs: false,
    results: false,
    resultsMap: {},
    groupByMetas: false,
    showMetas: false,
    search: '',
  };

  constructor(props) {
    super(props);
    this.onSearch = debounce(this.onSearch, 100);
  }
  async componentDidMount() {
    this.refresh();
    this.searchInput = this.state.search;
  }

  setPriority(priority) {
    this.setState({
      priority,
      groupByMetas: false,
      showMetas: false,
      firstBugs: false,
    });
  }

  filterList(results) {
    const { priority, showMetas, firstBugs, search } = this.state;
    let filtered = results;

    if (search !== '') {
      const fuse = new Fuse(results, {
        keys: [
          {
            name: 'Summary',
          },
        ],
        tokenize: true,
        matchAllTokens: true,
        threshold: 0.2,
        shouldSort: true,
      });
      filtered = fuse.search(search.trim());
    }

    if (showMetas) {
      return this.findMetas(filtered);
    }

    if (firstBugs) {
      return filtered.filter(b => b.Keywords.includes('first'));
    }

    if (priority === 'All') {
      return filtered;
    }

    return filtered.filter(
      bug => bug.Priority === priorityValue(priority) && !isMeta(bug)
    );
  }

  findMetas(results) {
    return results.filter(isMeta);
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

  onSearch(search) {
    this.setState({ search });
  }

  groupMetas() {
    this.setState({
      firstBugs: false,
      showMetas: false,
      groupByMetas: !this.state.groupByMetas,
    });
  }

  async refresh() {
    const { results, fetched } = await getBugs();
    fetched.then(res => this.updateResults(res));
    this.updateResults(results);
  }

  updateResults(results) {
    const resultsMap = {};
    for (const result of results) {
      resultsMap[result.BugID] = result;
    }
    this.setState({ results, resultsMap });
  }

  metas() {
    const { results, resultsMap } = this.state;
    const metas = this.findMetas(results);

    const inProgress = metas.filter(meta => meta.Priority === 'P2');
    const backlog = metas.filter(meta => meta.Priority !== 'P2');
    return [
      ...inProgress.map(meta => (
        <Meta key={meta.BugID} meta={meta} resultsMap={resultsMap} />
      )),
      <div key="backlog" className="backlog" />,
      ...sortByPriority(backlog).map(meta => (
        <Meta key={meta.BugID} meta={meta} resultsMap={resultsMap} />
      )),
    ];
  }

  render() {
    const { results, groupByMetas, resultsMap } = this.state;

    if (!results) {
      return <div>Fetching</div>;
    }

    const rows = this.filterList(results);
    return (
      <div className="App">
        <div className="App-Header">
          <div className="nav">
            <div className="priorities">
              Filter &nbsp;
              {priorities.map(P => (
                <a href="#" key={P} onClick={() => this.setPriority(P)}>
                  {P}
                </a>
              ))}
              <a href="#" onClick={() => this.toggleMetas()}>
                Metas
              </a>
              <a href="#" onClick={() => this.toggleFirstBugs()}>
                Good First Bugs
              </a>
              <div>
                Group &nbsp;
                <a href="#" onClick={() => this.groupMetas()}>
                  Metas
                </a>
              </div>
              <div>
                Search &nbsp;
                <input
                  type="text"
                  ref={this.searchInput}
                  onChange={e => this.onSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="App-Body">
          {groupByMetas ? (
            this.metas()
          ) : (
            <Table rows={rows} bugs={resultsMap} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
