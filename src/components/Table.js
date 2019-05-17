import React from 'react';
import { BugIDLink, BugSummaryLink, BugLink } from './BugLink';
import { isMeta } from '../utils';
import './Table.css';

import moment from 'moment';

function Metas({ metas, setMeta }) {
  return metas.map(b => (
    <span key={b.BugID} className="meta" onClick={() => setMeta(b.name)}>
      {b.name}
    </span>
  ));
}

function formatIntermittent(bug) {
  const match = bug.Summary.match(/Intermittent (.*) \| (.*) -/i);
  if (!match) {
    return bug.Summary;
  }
  const [, testPath, error] = match;
  const test = testPath.split(/\//).slice(-1)[0];
  return (
    <div>
      <div className="test-file">{test}</div>
      <div className="test-error">{error} </div>
    </div>
  );
  // return bug.Summary;
}

function Row({ bug, filters, setMeta, setPriority, setSortBy }) {
  const showIntermittents = filters.page == 'intermittents';
  const releasesPage = filters.page == 'releases';
  const showMetas = filters.keyword == 'meta';
  const shownMetas = bug.Metas.filter(meta => meta.name != filters.meta);
  return (
    <tr>
      <td>
        <div className="bug-summary">
          <span className="bug-alias">{isMeta(bug) ? bug.Alias : ''}</span>{' '}
          <BugLink bug={bug}>
            {showIntermittents ? formatIntermittent(bug) : bug.Summary}{' '}
          </BugLink>
        </div>
        <div className="meta-list">
          <Metas metas={shownMetas} setMeta={setMeta} />
        </div>
      </td>
      {showIntermittents ? (
        <td
          className={`fail-count ${
            Number(bug.failCount) > 20 ? 'important' : ''
          }`}
        >
          {bug.failCount}{' '}
        </td>
      ) : null}

      {showMetas ? (
        <td className={`meta-count ${bug.metaCount > 20 ? 'important' : ''}`}>
          {bug.metaCount}
        </td>
      ) : null}

      {releasesPage ? <td className={`assignee `}>{bug.Assignee} </td> : null}
      <td align="right">
        <div
          onClick={() => setPriority(bug.Priority)}
          className={`priority ${bug.Priority}`}
        >
          {bug.Priority}
        </div>
        <div className="changed" onClick={() => setSortBy('changed')}>
          {moment(bug.Changed, 'YYYYMMDD').fromNow()}
        </div>
      </td>
    </tr>
  );
}

function SimpleTable({ rows, filters, setMeta, setPriority, setSortBy }) {
  if (rows.length == 0) {
    return <h2 className="empty-results"> No results found</h2>;
  }

  debugger;
  return (
    <div className="bugs-table">
      <table className="pure-table pure-table-horizontal">
        <tbody>
          {rows.map(row => (
            <Row
              key={row.BugID}
              bug={row}
              filters={filters}
              setMeta={setMeta}
              setPriority={setPriority}
              setSortBy={setSortBy}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
