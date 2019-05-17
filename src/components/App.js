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
    type: params.get('type'),
    changed: params.get('changed'),
    sortBy: params.get('sortBy'),
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
    await this.props.fetchBugs();
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

  releases() {
    const {
      bugs: { bugsMap, metas },
      filteredBugs,
      filters,
      setMeta,
      setPriority,
      setSortBy,
    } = this.props;

    const inProgress = filteredBugs.filter(meta => meta.Status == 'ASSIGNED');
    const backlog = filteredBugs.filter(meta => meta.Status !== 'ASSIGNED');

    return (
      <div className="releases-page">
        {inProgress.length > 0 ? (
          <div className="page-header">IN PROGRESS</div>
        ) : null}
        {inProgress.length > 0 ? (
          <Table
            setMeta={setMeta}
            setPriority={setPriority}
            setSortBy={setSortBy}
            rows={inProgress}
            filters={filters}
          />
        ) : null}
        {backlog.length > 0 ? <div className="page-header">PLANNED</div> : null}
        {backlog.length > 0 ? (
          <Table
            setMeta={setMeta}
            setPriority={setPriority}
            setSortBy={setSortBy}
            rows={backlog}
            filters={filters}
          />
        ) : null}
      </div>
    );
  }

  renderPage() {
    const {
      filteredBugs,
      setMeta,
      setPriority,
      setSortBy,
      bugs: { bugs },
      filters,
    } = this.props;

    if (filters.page == 'metas') {
      return this.metas();
    }

    if (filters.page == 'releases') {
      return this.releases();
    }

    return (
      <Table
        setMeta={setMeta}
        setPriority={setPriority}
        setSortBy={setSortBy}
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
