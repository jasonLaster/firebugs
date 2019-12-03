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
  const search = window.location.toString().match(/\?[^/]*/);

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
    const params = parseParams();
    this.props.setFilter(params);
    this.refresh();
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
      setSearch,
      setSortBy,
    } = this.props;

    const inProgress = filteredBugs.filter(bug => bug.Status == 'ASSIGNED');

    const planned = filteredBugs.filter(
      bug =>
        !inProgress.includes(bug) && bug.Status !== 'ASSIGNED' && bug.Assignee
    );

    const backlog = filteredBugs.filter(
      bug =>
        ![...inProgress, ...planned].includes(bug) &&
        bug.Whiteboard.includes('debugger-mvp')
    );

    const reserve = filteredBugs.filter(
      bug =>
        ![...inProgress, ...planned].includes(bug) &&
        bug.Whiteboard.includes('debugger-reserve')
    );

    function releaseTable(list, label) {
      if (list.length == 0) {
        return null;
      }

      return (
        <div>
          <div className="page-header">
            {list.length} {label}
          </div>
          <Table
            setMeta={setMeta}
            setSearch={setSearch}
            setPriority={setPriority}
            setSortBy={setSortBy}
            rows={list}
            filters={filters}
          />
        </div>
      );
    }

    return (
      <div className="releases-page">
        {releaseTable(inProgress, 'IN PROGRESS')}
        {releaseTable(planned, 'PLANNED')}
        {releaseTable(backlog, 'BACKLOG')}
        {releaseTable(reserve, 'RESERVED')}
      </div>
    );
  }

  renderPage() {
    const {
      filteredBugs,
      setMeta,
      setPriority,
      setSearch,
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
        setSearch={setSearch}
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
