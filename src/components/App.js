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
  let page = 'bugs';
  if (window.location.hash) {
    page = window.location.hash.match(/^#(\w*)/)[1];
  }

  if (!search) {
    return { page };
  }

  const params = new URLSearchParams(search[0]);
  return {
    priority: params.get('priority'),
    meta: params.get('meta'),
    keyword: params.get('keyword'),
    page,
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
      filters,
      setMeta,
      setPriority,
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
          setMeta={setMeta}
          setPriority={setPriority}
          filters={filters}
        />
      )),
      <div key="backlog" className="backlog" />,
      ...sortByPriority(backlog).map(meta => (
        <Meta
          key={meta.BugID}
          meta={meta}
          bugsMap={bugsMap}
          filteredIds={filteredIds}
          setMeta={setMeta}
          setPriority={setPriority}
          filters={filters}
        />
      )),
    ];
  }

  renderPage() {
    const {
      filteredBugs,
      setMeta,
      setPriority,
      bugs: { bugs },
      filters,
    } = this.props;

    if (filters.page == 'metas') {
      return this.metas();
    }

    return (
      <Table
        setMeta={setMeta}
        setPriority={setPriority}
        rows={filteredBugs}
        filters={filters}
      />
    );
  }

  render() {
    const { bugs, filteredBugs } = this.props;

    if (!bugs.bugs) {
      return <div>Fetching</div>;
    }

    return (
      <div className="App">
        <Header filteredBugs={filteredBugs} />
        <div className="App-Body">{this.renderPage()}</div>
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
