import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { getFilteredBugs } from '../selectors';

import Table from './Table';
import Header from './Header';

import { sortByPriority, isMeta } from '../utils';
import Meta from './Meta';

import './App.css';

function parseParams() {
  const search = window.location.toString().match(/\?.*/);
  if (!search) {
    return {};
  }

  const params = new URLSearchParams(search[0]);
  return {
    priority: params.get('priority') || 'All',
    meta: params.get('meta'),
    keyword: params.get('keyword'),
    // search: params.get('search')
    //   ? decodeURIComponent(params.get('search'))
    //   : '',
  };
}

class App extends React.Component {
  async componentDidMount() {
    this.refresh();
    const params = parseParams();
    this.props.setFilter(params);
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
      filteredBugs,
    } = this.props;

    const inProgress = metas.filter(meta => meta.Priority === 'P2');
    const backlog = metas.filter(meta => meta.Priority !== 'P2');
    const filteredIds = new Set(filteredBugs.map(b => b.BugID));
    return [
      ...inProgress.map(meta => (
        <Meta
          key={meta.BugID}
          meta={meta}
          bugsMap={bugsMap}
          filteredIds={filteredIds}
        />
      )),
      <div key="backlog" className="backlog" />,
      ...sortByPriority(backlog).map(meta => (
        <Meta
          key={meta.BugID}
          meta={meta}
          bugsMap={bugsMap}
          filteredIds={filteredIds}
        />
      )),
    ];
  }

  render() {
    const {
      filteredBugs,
      setMeta,
      setPriority,
      bugs: { bugs },
      filters,
    } = this.props;
    const groupByMetas = filters.page == 'metas';

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
              filters={filters}
            />
          )}
        </div>
        <div className="App-Footer">
          <div className="content">
            <a href="http://github.com/jasonLaster/firebugs">github</a>
          </div>
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
