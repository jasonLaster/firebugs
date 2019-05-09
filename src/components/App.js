import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { getFilteredBugs } from '../selectors';

import Table from './Table';
import Header from './Header';

import { sortByPriority, isMeta } from '../utils';
import Meta from './Meta';

import './App.css';

class App extends React.Component {
  async componentDidMount() {
    this.refresh();
  }

  async refresh() {
    this.props.fetchBugs();
  }

  updateResults({ results, bugs }) {
    this.setState({ results, bugs });
  }

  metas() {
    const {
      bugs: { bugsMap, metas },
    } = this.props;

    const inProgress = metas.filter(meta => meta.Priority === 'P2');
    const backlog = metas.filter(meta => meta.Priority !== 'P2');
    return [
      ...inProgress.map(meta => (
        <Meta key={meta.BugID} meta={meta} bugsMap={bugsMap} />
      )),
      <div key="backlog" className="backlog" />,
      ...sortByPriority(backlog).map(meta => (
        <Meta key={meta.BugID} meta={meta} bugsMap={bugsMap} />
      )),
    ];
  }

  render() {
    const {
      filteredBugs,
      setMeta,
      setPriority,
      bugs: { bugs },
      filters: { page },
    } = this.props;
    const groupByMetas = page == 'metas';

    if (!bugs) {
      return <div>Fetching</div>;
    }

    return (
      <div className="App">
        <Header filteredBugs={filteredBugs} />
        <div className="App-Body">
          {groupByMetas ? (
            this.metas()
          ) : (
            <Table
              setMeta={setMeta}
              setPriority={setPriority}
              rows={filteredBugs}
            />
          )}
        </div>
        <div className="App-Footer">
          <div className="content" />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state,
    filteredBugs: getFilteredBugs(state),
  }),
  actions
)(App);
